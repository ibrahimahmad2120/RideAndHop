import React, { useState } from 'react';
import {
  Bike,
  Package,
  Clock,
  Tag,
  User,
  TrendingUp,
  Inbox,
  Shield,
  Layers,
  ArrowRightLeft,
  Navigation,
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/common/AndroidFrame';
import { DemoControls } from './components/common/DemoControls';
import { ExportAndroidModal } from './components/common/ExportAndroidModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { SupportModal } from './components/common/SupportModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

// Ridee Components
import { RideeHome } from './components/ridee/RideeHome';
import { LocationSearchModal } from './components/ridee/LocationSearchModal';
import { ChooseRideModal } from './components/ridee/ChooseRideModal';
import { RideMatchingView } from './components/ridee/RideMatchingView';
import { RideTrackingView } from './components/ridee/RideTrackingView';
import { RideCompletedModal } from './components/ridee/RideCompletedModal';
import { ParcelDeliveryModal } from './components/ridee/ParcelDeliveryModal';
import { DeliveryTrackingView } from './components/ridee/DeliveryTrackingView';
import { RideeActivity } from './components/ridee/RideeActivity';
import { RideeOffers } from './components/ridee/RideeOffers';
import { RideePayments } from './components/ridee/RideePayments';
import { RideeProfile } from './components/ridee/RideeProfile';
import { SafetyCenterModal } from './components/ridee/SafetyCenterModal';
import { ChatModal } from './components/ridee/ChatModal';
import { ReserveRideModal } from './components/ridee/ReserveRideModal';
import { SplitFareModal } from './components/ridee/SplitFareModal';

// Rider Components
import { RiderHome } from './components/rider/RiderHome';
import { RiderRequests } from './components/rider/RiderRequests';
import { RiderEarnings } from './components/rider/RiderEarnings';
import { RiderProfile } from './components/rider/RiderProfile';
import { RiderActiveJobView } from './components/rider/RiderActiveJobView';
import { IncomingRideModal } from './components/rider/IncomingRideModal';
import { IncomingDeliveryModal } from './components/rider/IncomingDeliveryModal';
import { MOCK_INCOMING_REQUESTS } from './data/mockData';

const MainAppContent: React.FC = () => {
  const {
    currentRole,
    hasCompletedOnboarding,
    activeRideeTab,
    setActiveRideeTab,
    activeRiderTab,
    setActiveRiderTab,
    rideTripStage,
    deliveryTripStage,
    activeRideBooking,
    activeRiderJob,
    activeModal,
    openModal,
    closeModal,
    startBookingRide,
    cancelRideTrip,
    acceptJobRequest,
    declineJobRequest,
    incomingRequests,
    setDestinationLocation,
    unreadNotifCount,
  } = useApp();

  // If user hasn't finished onboarding or restarted it
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {/* -------------------- RIDEE EXPERIENCE -------------------- */}
      {currentRole === 'ridee' && (
        <div className="flex-1 flex flex-col relative h-full">
          {/* Active Ride Matching radar */}
          {rideTripStage === 'searching' && <RideMatchingView />}

          {/* Active Ride Tracking */}
          {rideTripStage !== 'idle' &&
            rideTripStage !== 'searching' &&
            rideTripStage !== 'completed' && (
              <RideTrackingView
                onOpenChat={() => openModal('chat_modal')}
                onOpenSafety={() => openModal('safety_center')}
                onOpenSplitFare={() => openModal('split_fare')}
              />
            )}

          {/* Active Delivery Tracking */}
          {deliveryTripStage !== 'idle' && deliveryTripStage !== 'delivered' && (
            <DeliveryTrackingView
              onOpenChat={() => openModal('chat_modal')}
              onOpenSafety={() => openModal('safety_center')}
            />
          )}

          {/* Default Tabbed View when no active full-screen trip */}
          {rideTripStage === 'idle' && deliveryTripStage === 'idle' && (
            <div className="flex-1 flex flex-col relative h-full min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {activeRideeTab === 'home' && (
                  <RideeHome
                    onOpenSearch={() => openModal('search_location')}
                    onOpenChooseRide={() => openModal('choose_ride')}
                    onOpenParcelModal={() => openModal('parcel_delivery')}
                    onOpenNotifications={() => openModal('notifications')}
                    onOpenSafety={() => openModal('safety_center')}
                    onOpenReserve={() => openModal('reserve_ride')}
                  />
                )}

                {activeRideeTab === 'activity' && <RideeActivity />}
                {activeRideeTab === 'offers' && <RideeOffers />}
                {activeRideeTab === 'profile' && <RideeProfile />}
              </div>

              {/* Ridee Bottom Navigation Bar (Material 3 style) */}
              <nav className="shrink-0 w-full h-16 bg-white/95 backdrop-blur-md border-t border-[#E3EAE3] flex items-center justify-around px-2 select-none z-20">
                <button
                  onClick={() => setActiveRideeTab('home')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    activeRideeTab === 'home' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <Bike className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Rides</span>
                </button>

                <button
                  onClick={() => setActiveRideeTab('activity')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    activeRideeTab === 'activity' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <Clock className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Activity</span>
                </button>

                <button
                  onClick={() => setActiveRideeTab('offers')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    activeRideeTab === 'offers' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <Tag className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Offers</span>
                </button>

                <button
                  onClick={() => setActiveRideeTab('profile')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    activeRideeTab === 'profile' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Profile</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* -------------------- RIDER EXPERIENCE -------------------- */}
      {currentRole === 'rider' && (
        <div className="flex-1 flex flex-col relative h-full">
          {/* Active In-Progress Rider Job */}
          {activeRiderJob ? (
            <RiderActiveJobView />
          ) : (
            <div className="flex-1 flex flex-col relative h-full min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {activeRiderTab === 'home' && (
                  <RiderHome
                    onOpenRequests={() => setActiveRiderTab('requests')}
                    onOpenEarnings={() => setActiveRiderTab('earnings')}
                  />
                )}

                {activeRiderTab === 'requests' && <RiderRequests />}
                {activeRiderTab === 'earnings' && <RiderEarnings />}
                {activeRiderTab === 'profile' && <RiderProfile />}
              </div>

              {/* Rider Bottom Navigation Bar */}
              <nav className="shrink-0 w-full h-16 bg-white/95 backdrop-blur-md border-t border-[#E3EAE3] flex items-center justify-around px-2 select-none z-20">
                <button
                  onClick={() => setActiveRiderTab('home')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    activeRiderTab === 'home' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <Navigation className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Drive</span>
                </button>

                <button
                  onClick={() => setActiveRiderTab('requests')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                    activeRiderTab === 'requests' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <Inbox className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Requests</span>
                  {incomingRequests.length > 0 && (
                    <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" />
                  )}
                </button>

                <button
                  onClick={() => setActiveRiderTab('earnings')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    activeRiderTab === 'earnings' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Earnings</span>
                </button>

                <button
                  onClick={() => setActiveRiderTab('profile')}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    activeRiderTab === 'profile' ? 'text-[#16A34A] font-bold' : 'text-[#68746B] hover:text-[#17231B]'
                  }`}
                >
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-[10px] tracking-tight">Partner</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* -------------------- SHARED & OVERLAY MODALS -------------------- */}

      {/* Ride Completed (Passenger) - Surfaced with Post-Ride Rating & Tipping Flow */}
      {rideTripStage === 'completed' && <RideCompletedModal />}

      {/* Search Location Picker with Multi-stop Routing */}
      {activeModal === 'search_location' && (
        <LocationSearchModal
          onClose={closeModal}
          onSelectDestination={(loc) => {
            setDestinationLocation(loc);
            openModal('choose_ride');
          }}
        />
      )}

      {/* Choose Ride Modal */}
      {activeModal === 'choose_ride' && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs">
          <ChooseRideModal
            onConfirm={() => {
              startBookingRide();
              closeModal();
            }}
            onCancel={closeModal}
          />
        </div>
      )}

      {/* Uber Reserve Modal: Scheduled Rides */}
      {activeModal === 'reserve_ride' && (
        <ReserveRideModal onClose={closeModal} />
      )}

      {/* Uber Split Fare Modal */}
      {activeModal === 'split_fare' && (
        <SplitFareModal
          totalFare={activeRideBooking ? activeRideBooking.finalFare : 6.80}
          onClose={closeModal}
        />
      )}

      {/* Parcel Delivery Modal */}
      {activeModal === 'parcel_delivery' && (
        <ParcelDeliveryModal onClose={closeModal} />
      )}

      {/* In-app masked chat */}
      {activeModal === 'chat_modal' && <ChatModal onClose={closeModal} />}

      {/* Safety Centre */}
      {activeModal === 'safety_center' && <SafetyCenterModal onClose={closeModal} />}

      {/* Notifications */}
      {activeModal === 'notifications' && <NotificationsModal onClose={closeModal} />}

      {/* Help & Support */}
      {activeModal === 'support_modal' && <SupportModal onClose={closeModal} />}

      {/* Export Android project deliverables */}
      {activeModal === 'export_android' && <ExportAndroidModal />}

      {/* Incoming ride request simulation */}
      {activeModal === 'incoming_ride' && (
        <IncomingRideModal
          request={MOCK_INCOMING_REQUESTS[0]}
          onAccept={() => {
            acceptJobRequest(MOCK_INCOMING_REQUESTS[0]);
            closeModal();
          }}
          onDecline={() => {
            declineJobRequest(MOCK_INCOMING_REQUESTS[0].id);
            closeModal();
          }}
        />
      )}

      {/* Incoming parcel delivery request simulation */}
      {activeModal === 'incoming_delivery' && (
        <IncomingDeliveryModal
          request={MOCK_INCOMING_REQUESTS[1]}
          onAccept={() => {
            acceptJobRequest(MOCK_INCOMING_REQUESTS[1]);
            closeModal();
          }}
          onDecline={() => {
            declineJobRequest(MOCK_INCOMING_REQUESTS[1].id);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidFrame>
        <MainAppContent />
        <DemoControls />
      </AndroidFrame>
    </AppProvider>
  );
}
