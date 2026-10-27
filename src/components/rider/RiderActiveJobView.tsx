import React, { useState } from 'react';
import {
  Navigation,
  CheckCircle2,
  Phone,
  MessageSquare,
  Shield,
  FastForward,
  Compass,
  ArrowRight,
  Package,
  Bike,
  Star,
  MapPin,
  Flag,
  KeyRound,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StylizedMap } from '../common/StylizedMap';
import { RiderNavigationHUD } from './RiderNavigationHUD';

export const RiderActiveJobView: React.FC = () => {
  const {
    activeRiderJob,
    riderJobStage,
    advanceRiderJobStage,
    cancelRiderJob,
    openModal,
  } = useApp();

  const [showHUD, setShowHUD] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  if (!activeRiderJob) return null;

  const isRide = activeRiderJob.type === 'ride';

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/safety/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enteredPin }),
      });
      const data = await res.json();
      if (data.verified) {
        setPinVerified(true);
        setPinError(null);
      } else {
        setPinError('Invalid PIN code. Ask customer.');
      }
    } catch {
      if (enteredPin === '4829') {
        setPinVerified(true);
      } else {
        setPinError('Code must match passenger PIN 4829');
      }
    }
  };

  const getStageHeader = () => {
    if (isRide) {
      switch (riderJobStage) {
        case 'navigating_pickup':
          return {
            title: 'Heading to Pickup',
            instruction: 'In 300m turn left on Portland St towards Station Approach',
            nextAction: 'Mark Arrived at Pickup',
            sub: `Passenger: ${activeRiderJob.customerName}`,
          };
        case 'arrived_pickup':
          return {
            title: 'Arrived at Pickup',
            instruction: 'Waiting for passenger. Check sanitized helmet and verify safety PIN',
            nextAction: pinVerified ? 'Passenger Onboard · Start Ride' : 'Verify PIN to Start Ride',
            sub: `${activeRiderJob.customerName} (Rating 4.9★)`,
          };
        case 'in_trip':
          return {
            title: 'Ride In Progress',
            instruction: 'Cruising via Oxford Road corridor. Keep safe following distance',
            nextAction: 'Approaching Destination',
            sub: `Heading to ${activeRiderJob.destinationName}`,
          };
        case 'approaching_dest':
          return {
            title: 'Approaching Destination',
            instruction: 'Pull up safely to the left curb at destination point',
            nextAction: 'Complete Ride & Collect Fare',
            sub: 'Prepare receipt summary',
          };
        default:
          return {
            title: 'Active Job',
            instruction: 'NextRide Navigation active',
            nextAction: 'Continue',
            sub: '',
          };
      }
    } else {
      // delivery stages
      switch (riderJobStage) {
        case 'navigating_sender':
          return {
            title: 'Heading to Sender',
            instruction: 'Navigate to pickup sender location',
            nextAction: 'Mark Arrived at Sender',
            sub: `Pickup: ${activeRiderJob.pickupName}`,
          };
        case 'arrived_sender':
          return {
            title: 'Arrived at Sender',
            instruction: 'Verify parcel weight & securely latch into motorcycle top box',
            nextAction: 'Confirm Parcel Collected',
            sub: `${activeRiderJob.parcelCategory} (${activeRiderJob.parcelWeight})`,
          };
        case 'in_transit':
          return {
            title: 'Courier In Transit',
            instruction: 'Heading directly to recipient drop-off',
            nextAction: 'Arrived at Recipient',
            sub: `Delivery to ${activeRiderJob.destinationName}`,
          };
        case 'arrived_recipient':
          return {
            title: 'At Recipient Address',
            instruction: 'Hand over parcel and obtain recipient signature confirmation',
            nextAction: 'Complete Delivery & Electronic POD',
            sub: `Recipient: ${activeRiderJob.customerName}`,
          };
        default:
          return {
            title: 'Delivery Job',
            instruction: 'Follow route safely',
            nextAction: 'Continue',
            sub: '',
          };
      }
    }
  };

  const stage = getStageHeader();

  if (showHUD) {
    return (
      <RiderNavigationHUD
        onCloseHUD={() => setShowHUD(false)}
        activeJob={activeRiderJob}
        onAdvance={advanceRiderJobStage}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none">
      {/* Map Header */}
      <div className="relative">
        <StylizedMap
          riderPosition={{ x: 52, y: 50, angle: 60 }}
          heightClass="h-68 sm:h-76"
        />

        {/* Floating Navigation Prompt */}
        <div className="absolute top-3 left-3 right-3 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">
                {stage.title}
              </span>
              <p className="text-xs font-bold text-white line-clamp-1">{stage.instruction}</p>
            </div>
          </div>
          <button
            onClick={() => setShowHUD(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold whitespace-nowrap border border-slate-700"
          >
            Open HUD
          </button>
        </div>

        {/* Demo Fast Forward Pill */}
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={advanceRiderJobStage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16A34A] text-white text-xs font-semibold shadow-lg hover:bg-[#15803D] active:scale-95 transition-transform"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Next Stage</span>
          </button>
        </div>
      </div>

      {/* Active Job Action Sheet */}
      <div className="flex-1 bg-white p-4 sm:p-5 rounded-t-3xl border-t border-[#E3EAE3] shadow-lg flex flex-col justify-between -mt-4 relative z-10 space-y-4">
        {/* Customer / Job Specs */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#16A34A] font-bold flex items-center justify-center">
              {isRide ? <Bike className="w-6 h-6" /> : <Package className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-[#17231B]">{activeRiderJob.customerName}</h4>
                <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{activeRiderJob.customerRating}</span>
                </div>
              </div>
              <p className="text-[11px] text-[#68746B]">{stage.sub}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-[#16A34A]">
              +£{activeRiderJob.earnings.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 block">{activeRiderJob.paymentType}</span>
          </div>
        </div>

        {/* Uber Feature: 4-digit PIN Verification for Rider */}
        {isRide && riderJobStage === 'arrived_pickup' && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <KeyRound className="w-4 h-4 text-amber-700" />
                <span>Verify Passenger PIN (Uber feature)</span>
              </div>
              {pinVerified && (
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {!pinVerified ? (
              <form onSubmit={handleVerifyPin} className="space-y-1.5">
                <p className="text-[11px] text-amber-800">
                  Ask Alex for the 4-digit security code (Demo code: <strong>4829</strong>) before taking off.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="Enter 4-digit PIN..."
                    className="flex-1 p-2 rounded-xl border border-amber-300 bg-white font-mono font-bold text-center tracking-widest text-sm"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs"
                  >
                    Check PIN
                  </button>
                </div>
                {pinError && <p className="text-[10px] font-bold text-red-600">{pinError}</p>}
              </form>
            ) : (
              <p className="text-[11px] text-green-800 font-medium">
                PIN code confirmed! Passenger verified to safely board the motorcycle.
              </p>
            )}
          </div>
        )}

        {/* Route Details Box */}
        <div className="p-3 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3] text-xs space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</span>
              <p className="font-semibold text-slate-800">{activeRiderJob.pickupName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
            <Flag className="w-4 h-4 text-[#17231B] shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Destination</span>
              <p className="font-semibold text-slate-800">{activeRiderJob.destinationName}</p>
            </div>
          </div>
        </div>

        {/* Contact customer / Call & Chat */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Connecting masked line to passenger ${activeRiderJob.customerName}...`)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-green-600" />
            <span>Call Customer</span>
          </button>
          <button
            onClick={() => openModal('chat_modal')}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Message</span>
          </button>
        </div>

        {/* Primary Action Button to advance stage */}
        <button
          onClick={advanceRiderJobStage}
          className="w-full h-13 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all"
        >
          <span>{stage.nextAction}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={cancelRiderJob}
          className="text-center text-[11px] font-semibold text-slate-400 hover:text-red-600"
        >
          Cancel Job (Emergency only)
        </button>
      </div>
    </div>
  );
};
