export type UserRole = 'ridee' | 'rider';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  category: 'saved' | 'recent' | 'popular';
  x: number; // coordinate percentage on stylised map (0-100)
  y: number; // coordinate percentage on stylised map (0-100)
}

export interface RideTypeOption {
  id: 'standard' | 'comfort' | 'express';
  name: string;
  tagline: string;
  description: string;
  price: number;
  etaMinutes: number;
  travelMinutes: number;
  capacity: number;
  helmetIncluded: boolean;
  bikeType: string;
}

export type RideTripStage =
  | 'idle'
  | 'searching'
  | 'rider_assigned'
  | 'rider_approaching'
  | 'rider_arrived'
  | 'in_trip'
  | 'approaching_destination'
  | 'completed'
  | 'cancelled';

export type DeliveryTripStage =
  | 'idle'
  | 'request_placed'
  | 'rider_assigned'
  | 'heading_to_pickup'
  | 'parcel_collected'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface RiderInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  bikeModel: string;
  registrationNumber: string;
  bikeColor: string;
  phone: string;
  verified: boolean;
}

export interface RideBooking {
  id: string;
  reference: string;
  rideType: RideTypeOption;
  pickup: LocationItem;
  destination: LocationItem;
  fare: number;
  discount: number;
  finalFare: number;
  paymentMethod: string;
  promoCodeApplied?: string;
  status: RideTripStage;
  rider: RiderInfo;
  createdAt: string;
  rating?: number;
  review?: string;
  tip?: number;
  tags?: string[];
}

export interface ParcelDeliveryBooking {
  id: string;
  reference: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  category: 'Documents' | 'Small Box' | 'Food & Groceries' | 'Clothing' | 'Electronics';
  description: string;
  size: 'Envelope' | 'Small Bag' | 'Medium Box (Fits on bike)';
  weight: 'Under 1kg' | '1 - 3kg' | '3 - 5kg' | '5 - 10kg';
  handlingNotes?: string;
  urgency: 'Standard' | 'Express';
  price: number;
  paymentMethod: string;
  status: DeliveryTripStage;
  courier: RiderInfo;
  createdAt: string;
  proofSignature?: string;
}

export interface Offer {
  id: string;
  code: string;
  discountTitle: string;
  discountValue: string;
  minSpend: number;
  expiry: string;
  terms: string;
  applicableTo: 'rides' | 'delivery' | 'all';
}

export interface PaymentMethodItem {
  id: string;
  type: 'card' | 'wallet' | 'cash' | 'googlepay';
  name: string;
  detail: string;
  isDefault: boolean;
  balance?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'ride' | 'delivery' | 'promo' | 'earnings' | 'safety';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'rider' | 'system';
  text: string;
  time: string;
}

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  date: string;
}

export interface IncomingJobRequest {
  id: string;
  type: 'ride' | 'delivery';
  customerName: string;
  customerRating: number;
  pickupName: string;
  pickupDistanceKm: number;
  destinationName: string;
  totalDistanceKm: number;
  durationMinutes: number;
  earnings: number;
  paymentType: string;
  parcelCategory?: string;
  parcelWeight?: string;
  urgency?: string;
  specialNotes?: string;
}

export interface ReservationItem {
  id: string;
  pickupName: string;
  destinationName: string;
  date: string;
  rideType: string;
  estimatedFare: number;
  status: string;
  assignedDriver: string;
}

export interface SafetyPinData {
  pin: string;
  instructions: string;
  isEnabled: boolean;
}

export interface MembershipData {
  isActive: boolean;
  plan: string;
  renewDate: string;
  discountPercent: number;
  freeDelivery: boolean;
  savingsTotal: number;
}

export interface SplitFareData {
  id: string;
  totalFare: number;
  perPerson: number;
  participants: { name: string; amount: number; status: string }[];
  createdAt: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

