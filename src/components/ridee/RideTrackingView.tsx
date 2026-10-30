import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Shield,
  Share2,
  Bike,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  FastForward,
  KeyRound,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StylizedMap } from '../common/StylizedMap';

interface RideTrackingViewProps {
  onOpenChat: () => void;
  onOpenSafety: () => void;
  onOpenSplitFare: () => void;
}

export const RideTrackingView: React.FC<RideTrackingViewProps> = ({
  onOpenChat,
  onOpenSafety,
  onOpenSplitFare,
}) => {
  const {
    activeRideBooking,
    rideTripStage,
    advanceRideTripStage,
    cancelRideTrip,
    showToast,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const safetyPin = '4829'; // 4-digit Uber Verify Your Ride PIN

  if (!activeRideBooking) return null;

  const rider = activeRideBooking.rider;

  // Calculate simulated rider coordinates along route based on stage
  const getRiderCoordinates = () => {
    switch (rideTripStage) {
      case 'rider_assigned':
        return { x: 58, y: 40, angle: 45 };
      case 'rider_approaching':
        return { x: 54, y: 48, angle: 90 };
      case 'rider_arrived':
        return { x: activeRideBooking.pickup.x, y: activeRideBooking.pickup.y, angle: 180 };
      case 'in_trip':
        return {
          x: (activeRideBooking.pickup.x + activeRideBooking.destination.x) / 2,
          y: (activeRideBooking.pickup.y + activeRideBooking.destination.y) / 2,
          angle: 120,
        };
      case 'approaching_destination':
        return { x: activeRideBooking.destination.x - 3, y: activeRideBooking.destination.y + 3, angle: 135 };
      default:
        return { x: 50, y: 50, angle: 0 };
    }
  };

  const getStageTitle = () => {
    switch (rideTripStage) {
      case 'rider_assigned':
        return {
          title: 'Rider Assigned',
          sub: 'Jordan is wrapping up nearby and heading to you',
          eta: '3 mins',
          badge: 'Confirmed',
        };
      case 'rider_approaching':
        return {
          title: 'Rider Approaching Pickup',
          sub: 'Passing Portland St. Helmet & liner ready',
          eta: '1 min',
          badge: 'On the way',
        };
      case 'rider_arrived':
        return {
          title: 'Jordan Has Arrived!',
          sub: 'Waiting outside pickup point. Look for MT23 RDE',
          eta: 'Arrived',
          badge: 'At Pickup',
        };
      case 'in_trip':
        return {
          title: 'Trip in Progress',
          sub: 'Heading to destination via Oxford Road corridor',
          eta: '7 mins left',
          badge: 'Cruising',
        };
      case 'approaching_destination':
        return {
          title: 'Approaching Destination',
          sub: 'Preparing for drop-off at destination curb',
          eta: '1 min left',
          badge: 'Almost there',
        };
      default:
        return {
          title: 'Active Trip',
          sub: 'RideNHop active motorbike journey',
          eta: '--',
          badge: 'Active',
        };
    }
  };

  const stageInfo = getStageTitle();

  const handleShareTrip = () => {
    navigator.clipboard.writeText(`https://ridenhop.app/track/${activeRideBooking.reference}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleMockCall = () => {
    showToast(`Connecting masked audio call to ${rider.name} (${rider.phone})...`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none">
      {/* Map View */}
      <div className="relative">
        <StylizedMap
          pickup={activeRideBooking.pickup}
          destination={activeRideBooking.destination}
          riderPosition={getRiderCoordinates()}
          heightClass="h-72 sm:h-84"
        />

        {/* Floating Stage Header Banner */}
        <div className="absolute top-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#E3EAE3] shadow-md flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
              <h3 className="font-bold text-xs text-[#17231B]">{stageInfo.title}</h3>
            </div>
            <p className="text-[11px] text-[#68746B] mt-0.5">{stageInfo.sub}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#16A34A] block">{stageInfo.eta}</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              {stageInfo.badge}
            </span>
          </div>
        </div>

        {/* Demo Advance Floating Pill */}
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={advanceRideTripStage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#17231B] hover:bg-black text-white text-xs font-semibold shadow-lg transition-transform active:scale-95"
          >
            <FastForward className="w-3.5 h-3.5 text-green-400" />
            <span>Advance Demo State</span>
          </button>
        </div>
      </div>

      {/* Trip Information Sheet */}
      <div className="flex-1 bg-white p-4 sm:p-5 rounded-t-3xl border-t border-[#E3EAE3] shadow-lg flex flex-col justify-between -mt-4 relative z-10 space-y-4">
        {/* Rider Profile & Vehicle Specs */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={rider.avatar}
                alt={rider.name}
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-2xl object-cover border-2 border-green-500 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-600 text-white p-0.5 rounded-full border border-white">
                <Bike className="w-3 h-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-[#17231B]">{rider.name}</h4>
                <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rider.rating}</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{rider.bikeModel}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                  {rider.registrationNumber}
                </span>
                <span className="text-[11px] text-slate-400">· {rider.bikeColor}</span>
              </div>
            </div>
          </div>

          {/* Action Icons: Call, Chat */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMockCall}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              title="Call Rider"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChat}
              className="w-10 h-10 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center justify-center shadow-md transition-colors relative"
              title="Chat with Rider"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
            </button>
          </div>
        </div>

        {/* Uber Feature: 4-Digit Safety PIN ("Verify Your Ride") */}
        <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-green-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Verify Your Ride (PIN Code)
              </span>
              <p className="text-[11px] text-slate-300">
                Give code to Jordan before mounting
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-mono font-black text-base tracking-widest">
            {safetyPin}
          </div>
        </div>

        {/* Safety, Sharing, and Uber Split Fare Utilities */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenSafety}
            className="flex items-center justify-center gap-1.5 p-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-green-600" />
            <span>Safety</span>
          </button>

          <button
            onClick={handleShareTrip}
            className="flex items-center justify-center gap-1.5 p-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={onOpenSplitFare}
            className="flex items-center justify-center gap-1.5 p-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Split Fare</span>
          </button>
        </div>

        {/* Trip Fare & Reference Card */}
        <div className="p-3 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Booking Ref: {activeRideBooking.reference}
            </span>
            <span className="font-semibold text-slate-700">{activeRideBooking.paymentMethod}</span>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-[#17231B]">
              £{activeRideBooking.finalFare.toFixed(2)}
            </span>
            <span className="text-[10px] text-green-600 font-semibold block">Fixed Rate</span>
          </div>
        </div>

        {/* Cancel Prompt or Confirmation */}
        {rideTripStage !== 'in_trip' && rideTripStage !== 'approaching_destination' && (
          <div>
            {!showCancelPrompt ? (
              <button
                onClick={() => setShowCancelPrompt(true)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-red-600 text-center transition-colors"
              >
                Cancel Ride
              </button>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-2">
                <p className="font-bold text-red-900">Are you sure you want to cancel?</p>
                <p className="text-[11px] text-red-700">No cancellation fee applies for demo prototype.</p>
                <div className="flex gap-2">
                  <button
                    onClick={cancelRideTrip}
                    className="flex-1 py-1.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700"
                  >
                    Yes, Cancel Ride
                  </button>
                  <button
                    onClick={() => setShowCancelPrompt(false)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300"
                  >
                    Keep Ride
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
