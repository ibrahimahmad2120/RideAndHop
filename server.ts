import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent database for prototype backend
const db = {
  driver: {
    id: 'rider_jordan',
    name: 'Jordan Lee',
    rating: 4.94,
    totalRatings: 1420,
    walletBalance: 142.80,
    tipsEarned: 42.50,
    isFavorite: false,
    compliments: {
      'Clean Helmet & Liner': 382,
      'Smooth Lane-Filtering': 420,
      'Expert Safe Driving': 512,
      'Punctual Arrival': 390,
      'Great Navigation': 340,
      'Friendly Demeanour': 295,
    } as Record<string, number>,
  },
  ratings: [] as any[],
  reservations: [
    {
      id: 'res_1',
      pickupName: 'Manchester Piccadilly Approach',
      destinationName: 'Manchester Airport Terminal 1',
      date: 'Tomorrow, 07:30 AM',
      rideType: 'Comfort Cruiser',
      estimatedFare: 24.50,
      status: 'Confirmed',
      assignedDriver: 'Jordan Lee',
    },
    {
      id: 'res_2',
      pickupName: 'Ancoats Marina',
      destinationName: 'MediaCityUK Studio Dock',
      date: 'Thursday, 08:45 AM',
      rideType: 'Express Speed-Pass',
      estimatedFare: 11.20,
      status: 'Scheduled',
      assignedDriver: 'Jordan Lee',
    },
  ],
  membership: {
    isActive: true,
    plan: 'RideNHop One',
    renewDate: '24 Nov 2026',
    discountPercent: 10,
    freeDelivery: true,
    savingsTotal: 34.80,
  },
  surgeZones: [
    { id: 'zone_piccadilly', name: 'Piccadilly & Ancoats', multiplier: 1.3, label: 'High Demand (+30%)' },
    { id: 'zone_oxford', name: 'Oxford Road Student Corridor', multiplier: 1.15, label: 'Moderate Demand (+15%)' },
    { id: 'zone_deansgate', name: 'Deansgate & Spinningfields', multiplier: 1.25, label: 'Rush Hour Surge (+25%)' },
    { id: 'zone_mediacity', name: 'Salford Quays & MediaCity', multiplier: 1.0, label: 'Normal Rates' },
  ],
  safetyPin: '4829', // 4-digit Uber-style PIN verification
  splitFares: [] as any[],
  lostItemTickets: [] as any[],
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // ==========================================
  // BACKEND API ROUTES (Uber Feature Integrations)
  // ==========================================

  // 1. Post-Ride Rating & Tipping Flow
  app.post('/api/rides/:id/rate', (req: Request, res: Response) => {
    const { id } = req.params;
    const { rating, review, tip = 0, compliments = [], isFavorite = false } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
    }

    const tipAmount = Math.max(0, parseFloat(tip) || 0);

    // Update driver in-memory stats
    const currentSum = db.driver.rating * db.driver.totalRatings;
    db.driver.totalRatings += 1;
    db.driver.rating = +((currentSum + rating) / db.driver.totalRatings).toFixed(2);
    db.driver.walletBalance = +(db.driver.walletBalance + tipAmount).toFixed(2);
    db.driver.tipsEarned = +(db.driver.tipsEarned + tipAmount).toFixed(2);
    if (isFavorite) {
      db.driver.isFavorite = true;
    }

    // Increment compliment badges
    if (Array.isArray(compliments)) {
      compliments.forEach((comp: string) => {
        if (db.driver.compliments[comp] !== undefined) {
          db.driver.compliments[comp] += 1;
        } else {
          db.driver.compliments[comp] = 1;
        }
      });
    }

    const record = {
      rideId: id,
      rating,
      review,
      tip: tipAmount,
      compliments,
      isFavorite,
      timestamp: new Date().toISOString(),
    };
    db.ratings.push(record);

    res.json({
      success: true,
      message: `Thank you for rating! Jordan has received your review${tipAmount > 0 ? ` and £${tipAmount.toFixed(2)} tip` : ''}.`,
      updatedDriver: {
        name: db.driver.name,
        newRating: db.driver.rating,
        totalRatings: db.driver.totalRatings,
        walletBalance: db.driver.walletBalance,
        isFavorite: db.driver.isFavorite,
      },
      record,
    });
  });

  // Get driver rating profile & compliments
  app.get('/api/driver/profile', (_req: Request, res: Response) => {
    res.json({
      driver: db.driver,
      recentRatings: db.ratings.slice(-5),
    });
  });

  // 2. Uber Feature: Reserve / Schedule a Ride Ahead
  app.get('/api/reserve', (_req: Request, res: Response) => {
    res.json({ reservations: db.reservations });
  });

  app.post('/api/reserve', (req: Request, res: Response) => {
    const { pickupName, destinationName, date, rideType, estimatedFare } = req.body;
    if (!pickupName || !destinationName || !date) {
      return res.status(400).json({ error: 'Pickup, destination, and reservation date are required' });
    }

    const newRes = {
      id: `res_${Date.now()}`,
      pickupName,
      destinationName,
      date,
      rideType: rideType || 'Standard Bike',
      estimatedFare: estimatedFare || 8.50,
      status: 'Confirmed',
      assignedDriver: 'Jordan Lee (Priority Reserved)',
    };
    db.reservations.push(newRes);

    res.status(201).json({
      success: true,
      message: 'Ride scheduled successfully with on-time pickup guarantee!',
      reservation: newRes,
    });
  });

  app.delete('/api/reserve/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.reservations = db.reservations.filter((r) => r.id !== id);
    res.json({ success: true, message: 'Reservation cancelled' });
  });

  // 3. Uber Feature: 4-Digit Safety PIN Verification ("Verify Your Ride")
  app.get('/api/safety/pin', (_req: Request, res: Response) => {
    res.json({
      pin: db.safetyPin,
      instructions: 'Share this 4-digit code verbally with your rider Jordan before mounting the motorcycle.',
      isEnabled: true,
    });
  });

  app.post('/api/safety/verify-pin', (req: Request, res: Response) => {
    const { enteredPin } = req.body;
    if (enteredPin === db.safetyPin) {
      res.json({ success: true, verified: true, message: 'PIN matched! Journey authorized.' });
    } else {
      res.status(400).json({ success: false, verified: false, message: 'Invalid PIN. Check passenger app.' });
    }
  });

  // 4. Uber Feature: Multi-Stop Routing Engine
  app.post('/api/rides/calculate-multistop', (req: Request, res: Response) => {
    const { stops = [] } = req.body;
    // stops is array of locations e.g. [pickup, stop1, dropoff]
    const stopCount = Math.max(2, stops.length);
    const baseMiles = 1.8 * (stopCount - 1);
    const baseFare = 4.00 + (stopCount - 1) * 2.80;
    const estTimeMinutes = 8 + (stopCount - 1) * 6;

    res.json({
      stopsCount: stopCount,
      totalDistanceMiles: +baseMiles.toFixed(1),
      estimatedDurationMinutes: estTimeMinutes,
      fare: +baseFare.toFixed(2),
      currency: 'GBP',
      stops,
    });
  });

  // 5. Uber Feature: RideNHop One Membership
  app.get('/api/membership', (_req: Request, res: Response) => {
    res.json(db.membership);
  });

  app.post('/api/membership/toggle', (_req: Request, res: Response) => {
    db.membership.isActive = !db.membership.isActive;
    res.json({
      success: true,
      membership: db.membership,
      message: db.membership.isActive ? 'RideNHop One activated!' : 'Membership paused',
    });
  });

  // 6. Uber Feature: Dynamic Upfront Surge Heat Zones
  app.get('/api/pricing/zones', (_req: Request, res: Response) => {
    res.json({
      zones: db.surgeZones,
      currentCity: 'Manchester',
      timestamp: new Date().toLocaleTimeString(),
    });
  });

  // 7. Uber Feature: Split Fare with Friends
  app.post('/api/rides/split-fare', (req: Request, res: Response) => {
    const { totalFare, friends = [] } = req.body;
    if (!totalFare || friends.length === 0) {
      return res.status(400).json({ error: 'Fare and friends list required' });
    }

    const totalSplitters = friends.length + 1; // including requester
    const perPerson = +(totalFare / totalSplitters).toFixed(2);

    const splitRecord = {
      id: `split_${Date.now()}`,
      totalFare,
      perPerson,
      participants: [
        { name: 'Alex Morgan (You)', amount: perPerson, status: 'Paid' },
        ...friends.map((f: string) => ({ name: f, amount: perPerson, status: 'Invite Sent' })),
      ],
      createdAt: new Date().toISOString(),
    };
    db.splitFares.push(splitRecord);

    res.json({
      success: true,
      message: `Split request sent to ${friends.length} friend${friends.length > 1 ? 's' : ''}! £${perPerson} each.`,
      splitRecord,
    });
  });

  // 8. Uber Feature: Lost Item In-App Claim
  app.post('/api/rides/:id/lost-item', (req: Request, res: Response) => {
    const { id } = req.params;
    const { itemDescription, contactPhone } = req.body;

    const ticket = {
      ticketId: `LST-${Math.floor(1000 + Math.random() * 9000)}`,
      rideId: id,
      itemDescription,
      contactPhone: contactPhone || '+44 7911 123456',
      driverContacted: 'Jordan Lee',
      status: 'Driver Alerted',
      createdAt: new Date().toISOString(),
    };
    db.lostItemTickets.push(ticket);

    res.json({
      success: true,
      message: 'Jordan Lee has been notified to check his motorcycle top-box and jacket pockets.',
      ticket,
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RideNHop Backend] Server active and listening on port ${PORT}`);
  });
}

startServer();
