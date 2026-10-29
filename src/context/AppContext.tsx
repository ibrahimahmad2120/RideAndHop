import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  LocationItem,
  RideTypeOption,
  RideTripStage,
  DeliveryTripStage,
  RideBooking,
  ParcelDeliveryBooking,
  Offer,
  PaymentMethodItem,
  NotificationItem,
  ChatMessage,
  SupportTicket,
  IncomingJobRequest,
  RiderInfo,
} from '../types';
import {
  MOCK_LOCATIONS,
  MOCK_RIDE_OPTIONS,
  MOCK_RIDER_JORDAN,
  MOCK_OFFERS,
  MOCK_PAYMENT_METHODS,
  MOCK_NOTIFICATIONS,
  INITIAL_CHAT_MESSAGES,
  MOCK_PAST_RIDES,
  MOCK_PAST_DELIVERIES,
  MOCK_INCOMING_REQUESTS,
} from '../data/mockData';

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  deviceFrameEnabled: boolean;
  setDeviceFrameEnabled: (enabled: boolean) => void;
  activeRideeTab: 'home' | 'activity' | 'offers' | 'profile';
  setActiveRideeTab: (tab: 'home' | 'activity' | 'offers' | 'profile') => void;
  activeRiderTab: 'home' | 'requests' | 'earnings' | 'profile';
  setActiveRiderTab: (tab: 'home' | 'requests' | 'earnings' | 'profile') => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Ridee State
  pickupLocation: LocationItem;
  destinationLocation: LocationItem | null;
  setPickupLocation: (loc: LocationItem) => void;
  setDestinationLocation: (loc: LocationItem | null) => void;
  selectedRideOption: RideTypeOption;
  setSelectedRideOption: (opt: RideTypeOption) => void;
  appliedPromo: Offer | null;
  applyPromoCode: (code: string) => { success: boolean; message: string; discount?: number };
  removePromo: () => void;
  paymentMethods: PaymentMethodItem[];
  selectedPaymentMethod: PaymentMethodItem;
  setSelectedPaymentMethod: (pm: PaymentMethodItem) => void;
  walletBalance: number;
  topUpWallet: (amount: number) => void;

  // Active Ride Workflow
  rideTripStage: RideTripStage;
  activeRideBooking: RideBooking | null;
  startBookingRide: () => void;
  advanceRideTripStage: () => void;
  cancelRideTrip: () => void;
  submitRideReview: (rating: number, review: string, tip: number, tags: string[]) => void;
  resetRideToIdle: () => void;

  // Active Delivery Workflow
  deliveryTripStage: DeliveryTripStage;
  activeDeliveryBooking: ParcelDeliveryBooking | null;
  startParcelDeliveryBooking: (booking: Partial<ParcelDeliveryBooking>) => void;
  advanceDeliveryTripStage: () => void;
  cancelDeliveryTrip: () => void;
  resetDeliveryToIdle: () => void;

  // Activity History
  pastRides: RideBooking[];
  pastDeliveries: ParcelDeliveryBooking[];

  // Rider State
  isRiderOnline: boolean;
  setIsRiderOnline: (online: boolean) => void;
  riderProfile: RiderInfo;
  riderEarningsToday: number;
  riderBalance: number;
  riderCompletedRides: number;
  riderCompletedDeliveries: number;
  riderAcceptanceRate: number;
  riderRating: number;
  incomingRequests: IncomingJobRequest[];
  activeRiderJob: IncomingJobRequest | null;
  riderJobStage: string;
  acceptJobRequest: (req: IncomingJobRequest) => void;
  declineJobRequest: (reqId: string) => void;
  advanceRiderJobStage: () => void;
  completeRiderJob: () => void;
  cancelRiderJob: () => void;
  requestPayout: (amount: number) => { success: boolean; message: string };

  // Notifications & Chat & Support
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  supportTickets: SupportTicket[];
  submitSupportTicket: (category: string, subject: string, message: string) => string;

  // Modals & Popups
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;

  // Global Demo reset
  resetAllDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Roles & View
  const [currentRole, setCurrentRole] = useState<UserRole>('ridee');
  const [deviceFrameEnabled, setDeviceFrameEnabled] = useState<boolean>(true);
  const [activeRideeTab, setActiveRideeTab] = useState<'home' | 'activity' | 'offers' | 'profile'>('home');
  const [activeRiderTab, setActiveRiderTab] = useState<'home' | 'requests' | 'earnings' | 'profile'>('home');

  // Onboarding
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  // Ridee Location & Options
  const [pickupLocation, setPickupLocation] = useState<LocationItem>(MOCK_LOCATIONS[0]);
  const [destinationLocation, setDestinationLocation] = useState<LocationItem | null>(MOCK_LOCATIONS[1]);
  const [selectedRideOption, setSelectedRideOption] = useState<RideTypeOption>(MOCK_RIDE_OPTIONS[0]);
  const [appliedPromo, setAppliedPromo] = useState<Offer | null>(null);

  // Payments
  const [paymentMethods] = useState<PaymentMethodItem[]>(MOCK_PAYMENT_METHODS);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodItem>(MOCK_PAYMENT_METHODS[0]);
  const [walletBalance, setWalletBalance] = useState<number>(38.50);

  // Active Ride Booking
  const [rideTripStage, setRideTripStage] = useState<RideTripStage>('idle');
  const [activeRideBooking, setActiveRideBooking] = useState<RideBooking | null>(null);

  // Active Delivery Booking
  const [deliveryTripStage, setDeliveryTripStage] = useState<DeliveryTripStage>('idle');
  const [activeDeliveryBooking, setActiveDeliveryBooking] = useState<ParcelDeliveryBooking | null>(null);

  // History
  const [pastRides, setPastRides] = useState<RideBooking[]>(MOCK_PAST_RIDES);
  const [pastDeliveries, setPastDeliveries] = useState<ParcelDeliveryBooking[]>(MOCK_PAST_DELIVERIES);

  // Rider State
  const [isRiderOnline, setIsRiderOnline] = useState<boolean>(true);
  const [riderProfile] = useState<RiderInfo>(MOCK_RIDER_JORDAN);
  const [riderEarningsToday, setRiderEarningsToday] = useState<number>(68.40);
  const [riderBalance, setRiderBalance] = useState<number>(142.80);
  const [riderCompletedRides, setRiderCompletedRides] = useState<number>(6);
  const [riderCompletedDeliveries, setRiderCompletedDeliveries] = useState<number>(4);
  const [riderAcceptanceRate] = useState<number>(96);
  const [riderRating] = useState<number>(4.94);
  const [incomingRequests, setIncomingRequests] = useState<IncomingJobRequest[]>(MOCK_INCOMING_REQUESTS);
  const [activeRiderJob, setActiveRiderJob] = useState<IncomingJobRequest | null>(null);
  const [riderJobStage, setRiderJobStage] = useState<string>('idle');

  // Notifications & Chat
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-2094',
      category: 'Ride Experience',
      subject: 'Left water bottle in top box',
      message: 'Left my black thermos in the comfort top box yesterday afternoon.',
      status: 'Resolved',
      date: 'Yesterday 17:30',
    },
  ]);

  // Modal control
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    closeModal();
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase() === 'NEXTRIDE50' ? 'RIDENHOP50' : code.trim().toUpperCase();
    const found = MOCK_OFFERS.find((o) => o.code === clean);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try RIDENHOP50 or TWOWHEELS' };
    }
    setAppliedPromo(found);
    return { success: true, message: `Promo applied: ${found.discountTitle}!`, discount: 2.50 };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const topUpWallet = (amount: number) => {
    setWalletBalance((prev) => +(prev + amount).toFixed(2));
    const newNotif: NotificationItem = {
      id: `topup_${Date.now()}`,
      title: 'Wallet Topped Up',
      message: `Successfully added £${amount.toFixed(2)} to your RideNHop Wallet.`,
      time: 'Just now',
      isRead: false,
      type: 'promo',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Booking a Ride
  const startBookingRide = () => {
    const rawFare = selectedRideOption.price;
    const discount = appliedPromo ? (appliedPromo.code === 'RIDENHOP50' || appliedPromo.code === 'NEXTRIDE50' ? rawFare * 0.5 : 2.50) : 0;
    const finalFare = Math.max(1.50, +(rawFare - discount).toFixed(2));

    const newBooking: RideBooking = {
      id: `bk_${Date.now()}`,
      reference: `RH-${Math.floor(1000 + Math.random() * 9000)}`,
      rideType: selectedRideOption,
      pickup: pickupLocation,
      destination: destinationLocation || MOCK_LOCATIONS[1],
      fare: rawFare,
      discount,
      finalFare,
      paymentMethod: selectedPaymentMethod.name,
      promoCodeApplied: appliedPromo?.code,
      status: 'searching',
      rider: MOCK_RIDER_JORDAN,
      createdAt: 'Just now',
    };

    setActiveRideBooking(newBooking);
    setRideTripStage('searching');
  };

  const advanceRideTripStage = () => {
    if (!activeRideBooking) return;

    const stages: RideTripStage[] = [
      'searching',
      'rider_assigned',
      'rider_approaching',
      'rider_arrived',
      'in_trip',
      'approaching_destination',
      'completed',
    ];

    const currentIndex = stages.indexOf(rideTripStage);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setRideTripStage(nextStage);
      setActiveRideBooking({
        ...activeRideBooking,
        status: nextStage,
      });

      if (nextStage === 'completed') {
        // Add to past rides
        setPastRides((prev) => [
          {
            ...activeRideBooking,
            status: 'completed',
            rating: 5,
          },
          ...prev,
        ]);
        // Deduct from wallet if wallet payment
        if (selectedPaymentMethod.type === 'wallet') {
          setWalletBalance((prev) => Math.max(0, +(prev - activeRideBooking.finalFare).toFixed(2)));
        }
      }
    }
  };

  const cancelRideTrip = () => {
    setRideTripStage('idle');
    setActiveRideBooking(null);
  };

  const resetRideToIdle = () => {
    setRideTripStage('idle');
    setActiveRideBooking(null);
  };

  const submitRideReview = (rating: number, review: string, tip: number, tags: string[]) => {
    if (activeRideBooking) {
      setPastRides((prev) =>
        prev.map((r) =>
          r.id === activeRideBooking.id
            ? { ...r, rating, review, tip, tags }
            : r
        )
      );
    }
    resetRideToIdle();
  };

  // Parcel Delivery
  const startParcelDeliveryBooking = (data: Partial<ParcelDeliveryBooking>) => {
    const newDelivery: ParcelDeliveryBooking = {
      id: `del_${Date.now()}`,
      reference: `PD-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName: data.senderName || 'Alex Morgan',
      senderPhone: data.senderPhone || '+44 7911 123456',
      pickupAddress: data.pickupAddress || pickupLocation.address,
      recipientName: data.recipientName || 'Jordan Bell',
      recipientPhone: data.recipientPhone || '+44 7822 998877',
      deliveryAddress: data.deliveryAddress || '10 Oxford Road, Manchester, M1 5QA',
      category: data.category || 'Documents',
      description: data.description || 'Important contract envelope',
      size: data.size || 'Small Bag',
      weight: data.weight || '1 - 3kg',
      urgency: data.urgency || 'Express',
      price: data.urgency === 'Express' ? 8.90 : 5.80,
      paymentMethod: selectedPaymentMethod.name,
      status: 'request_placed',
      courier: MOCK_RIDER_JORDAN,
      createdAt: 'Just now',
    };

    setActiveDeliveryBooking(newDelivery);
    setDeliveryTripStage('request_placed');
  };

  const advanceDeliveryTripStage = () => {
    if (!activeDeliveryBooking) return;

    const stages: DeliveryTripStage[] = [
      'request_placed',
      'rider_assigned',
      'heading_to_pickup',
      'parcel_collected',
      'in_transit',
      'out_for_delivery',
      'delivered',
    ];

    const idx = stages.indexOf(deliveryTripStage);
    if (idx >= 0 && idx < stages.length - 1) {
      const nextStage = stages[idx + 1];
      setDeliveryTripStage(nextStage);
      setActiveDeliveryBooking({
        ...activeDeliveryBooking,
        status: nextStage,
      });

      if (nextStage === 'delivered') {
        setPastDeliveries((prev) => [
          {
            ...activeDeliveryBooking,
            status: 'delivered',
            proofSignature: 'Recipient Signed (Electronic POD)',
          },
          ...prev,
        ]);
      }
    }
  };

  const cancelDeliveryTrip = () => {
    setDeliveryTripStage('idle');
    setActiveDeliveryBooking(null);
  };

  const resetDeliveryToIdle = () => {
    setDeliveryTripStage('idle');
    setActiveDeliveryBooking(null);
  };

  // Rider Actions
  const acceptJobRequest = (req: IncomingJobRequest) => {
    setActiveRiderJob(req);
    setRiderJobStage(req.type === 'ride' ? 'navigating_pickup' : 'navigating_sender');
    setIncomingRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const declineJobRequest = (reqId: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const advanceRiderJobStage = () => {
    if (!activeRiderJob) return;

    if (activeRiderJob.type === 'ride') {
      const stages = ['navigating_pickup', 'arrived_pickup', 'in_trip', 'approaching_dest', 'completed'];
      const curIdx = stages.indexOf(riderJobStage);
      if (curIdx >= 0 && curIdx < stages.length - 1) {
        const nextStage = stages[curIdx + 1];
        setRiderJobStage(nextStage);
        if (nextStage === 'completed') {
          completeRiderJob();
        }
      }
    } else {
      // delivery stages
      const stages = ['navigating_sender', 'arrived_sender', 'parcel_collected', 'in_transit', 'arrived_recipient', 'completed'];
      const curIdx = stages.indexOf(riderJobStage);
      if (curIdx >= 0 && curIdx < stages.length - 1) {
        const nextStage = stages[curIdx + 1];
        setRiderJobStage(nextStage);
        if (nextStage === 'completed') {
          completeRiderJob();
        }
      }
    }
  };

  const completeRiderJob = () => {
    if (activeRiderJob) {
      const earned = activeRiderJob.earnings;
      setRiderEarningsToday((prev) => +(prev + earned).toFixed(2));
      setRiderBalance((prev) => +(prev + earned).toFixed(2));
      if (activeRiderJob.type === 'ride') {
        setRiderCompletedRides((prev) => prev + 1);
      } else {
        setRiderCompletedDeliveries((prev) => prev + 1);
      }
    }
    setActiveRiderJob(null);
    setRiderJobStage('idle');
  };

  const cancelRiderJob = () => {
    setActiveRiderJob(null);
    setRiderJobStage('idle');
  };

  const requestPayout = (amount: number) => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than £0' };
    if (amount > riderBalance) return { success: false, message: 'Insufficient balance for payout' };

    setRiderBalance((prev) => +(prev - amount).toFixed(2));
    const newNotif: NotificationItem = {
      id: `payout_${Date.now()}`,
      title: 'Payout Processed',
      message: `£${amount.toFixed(2)} sent via Faster Payments to Barclays Business •••• 8109.`,
      time: 'Just now',
      isRead: false,
      type: 'earnings',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return { success: true, message: `Payout of £${amount.toFixed(2)} requested successfully!` };
  };

  // Notifications & Chat
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Simulated quick rider reply after 800ms
    setTimeout(() => {
      const autoReplyText = text.toLowerCase().includes('helmet')
        ? 'Yes! I have a sanitized Nolan size M helmet with full face shield and disposable liner.'
        : text.toLowerCase().includes('where') || text.toLowerCase().includes('outside')
        ? "I am pulling up right outside now on the black Yamaha MT-07. Hazard lights on!"
        : "Understood! Thanks for letting me know, see you in a minute!";

      const riderReply: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'rider',
        text: autoReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, riderReply]);
    }, 900);
  };

  const submitSupportTicket = (category: string, subject: string, message: string) => {
    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      category,
      subject,
      message,
      status: 'Open',
      date: 'Just now',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    return ticketId;
  };

  const resetAllDemoState = () => {
    setRideTripStage('idle');
    setActiveRideBooking(null);
    setDeliveryTripStage('idle');
    setActiveDeliveryBooking(null);
    setActiveRiderJob(null);
    setRiderJobStage('idle');
    setIncomingRequests(MOCK_INCOMING_REQUESTS);
    setRiderEarningsToday(68.40);
    setRiderBalance(142.80);
    setWalletBalance(38.50);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setAppliedPromo(null);
    closeModal();
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        deviceFrameEnabled,
        setDeviceFrameEnabled,
        activeRideeTab,
        setActiveRideeTab,
        activeRiderTab,
        setActiveRiderTab,
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
        pickupLocation,
        destinationLocation,
        setPickupLocation,
        setDestinationLocation,
        selectedRideOption,
        setSelectedRideOption,
        appliedPromo,
        applyPromoCode,
        removePromo,
        paymentMethods,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        walletBalance,
        topUpWallet,
        rideTripStage,
        activeRideBooking,
        startBookingRide,
        advanceRideTripStage,
        cancelRideTrip,
        submitRideReview,
        resetRideToIdle,
        deliveryTripStage,
        activeDeliveryBooking,
        startParcelDeliveryBooking,
        advanceDeliveryTripStage,
        cancelDeliveryTrip,
        resetDeliveryToIdle,
        pastRides,
        pastDeliveries,
        isRiderOnline,
        setIsRiderOnline,
        riderProfile,
        riderEarningsToday,
        riderBalance,
        riderCompletedRides,
        riderCompletedDeliveries,
        riderAcceptanceRate,
        riderRating,
        incomingRequests,
        activeRiderJob,
        riderJobStage,
        acceptJobRequest,
        declineJobRequest,
        advanceRiderJobStage,
        completeRiderJob,
        cancelRiderJob,
        requestPayout,
        notifications,
        unreadNotifCount,
        markNotificationRead,
        markAllNotificationsRead,
        chatMessages,
        sendChatMessage,
        supportTickets,
        submitSupportTicket,
        activeModal,
        openModal,
        closeModal,
        resetAllDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
