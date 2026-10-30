import React, { useState } from 'react';
import {
  Wrench,
  FastForward,
  PlusCircle,
  Package,
  Bike,
  RefreshCw,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Layers,
  ArrowRightLeft,
  X,
  Minus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const {
    currentRole,
    switchRole,
    rideTripStage,
    advanceRideTripStage,
    deliveryTripStage,
    advanceDeliveryTripStage,
    activeRiderJob,
    riderJobStage,
    advanceRiderJobStage,
    resetAllDemoState,
    resetOnboarding,
    openModal,
    closeModal,
    activeModal,
    topUpWallet,
  } = useApp();

  const isAnyRideActive = rideTripStage !== 'idle';
  const isAnyDeliveryActive = deliveryTripStage !== 'idle';
  const isRiderJobActive = activeRiderJob !== null && riderJobStage !== 'idle';

  const shouldShowSheet = isOpen || activeModal === 'demo_controls';

  const handleClose = () => {
    setIsOpen(false);
    if (activeModal === 'demo_controls') {
      closeModal();
    }
  };

  return (
    <>
      {/* Floating Pill Trigger (Placed safely at bottom-24 above the bottom nav bar, never overlapping) */}
      {!shouldShowSheet && !isMinimized && (
        <div className="absolute bottom-24 right-3.5 z-40 select-none flex items-center gap-1">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900/95 hover:bg-black text-white text-[11px] font-semibold px-3 py-2 rounded-full shadow-xl border border-slate-700/80 transition-all hover:scale-105 active:scale-95"
          >
            <Wrench className="w-3.5 h-3.5 text-green-400" />
            <span>Demo Tools</span>
            <ChevronUp className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 bg-slate-900/95 hover:bg-black text-slate-400 hover:text-white rounded-full border border-slate-700/80 shadow-md transition-colors"
            title="Hide floating trigger (can reopen from top bar)"
          >
            <Minus className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Minimized Tiny Dot if user collapsed floating pill */}
      {!shouldShowSheet && isMinimized && (
        <div className="absolute bottom-24 right-3.5 z-40 select-none">
          <button
            onClick={() => setIsMinimized(false)}
            className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-black text-green-400 border border-slate-700/80 shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="Expand Demo Controls trigger"
          >
            <Wrench className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Full Interactive Demo Controls Bottom Sheet Drawer */}
      {shouldShowSheet && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="w-full max-h-[85vh] bg-slate-900 text-slate-100 rounded-t-3xl border-t border-slate-700 p-4 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle */}
            <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-3" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold text-sm tracking-tight text-white">Interactive Demo Controls</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              {/* Quick Role Switch */}
              <div className="bg-slate-800/80 p-3 rounded-2xl flex items-center justify-between border border-slate-700/50">
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Experience</span>
                  <span className="font-bold text-white capitalize text-sm">
                    {currentRole === 'ridee' ? 'Passenger (Ridee)' : 'Driver (Rider)'}
                  </span>
                </div>
                <button
                  onClick={() => switchRole(currentRole === 'ridee' ? 'rider' : 'ridee')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-semibold transition-colors shadow-sm"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Switch to {currentRole === 'ridee' ? 'Driver' : 'Passenger'}</span>
                </button>
              </div>

              {/* Stage Progress for Active Workflows */}
              {(isAnyRideActive || isAnyDeliveryActive || isRiderJobActive) && (
                <div className="bg-green-950/60 border border-green-800/60 p-3 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">
                    Simulated Active Trip State
                  </span>

                  {isAnyRideActive && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 capitalize font-medium">
                        Ride: {rideTripStage.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={advanceRideTripStage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-[11px] shadow-sm"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                        <span>Next Stage</span>
                      </button>
                    </div>
                  )}

                  {isAnyDeliveryActive && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 capitalize font-medium">
                        Delivery: {deliveryTripStage.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={advanceDeliveryTripStage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-[11px] shadow-sm"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                        <span>Next Stage</span>
                      </button>
                    </div>
                  )}

                  {isRiderJobActive && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 capitalize font-medium">
                        Job: {riderJobStage.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={advanceRiderJobStage}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-[11px] shadow-sm"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                        <span>Next Stage</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Simulation Triggers */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    openModal('incoming_ride');
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-left border border-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-green-400 font-semibold mb-0.5">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Incoming Ride</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Simulate passenger request</p>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    openModal('incoming_delivery');
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-left border border-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
                    <Package className="w-3.5 h-3.5" />
                    <span>Incoming Parcel</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Trigger courier parcel alert</p>
                </button>
              </div>

              {/* Wallet Top-up & Onboarding */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => topUpWallet(20)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-left border border-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-0.5">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+£20 Wallet</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Add passenger balance</p>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    resetOnboarding();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-left border border-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-0.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Onboarding</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Replay welcome flow</p>
                </button>
              </div>

              {/* Export Deliverables & Reset Row */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    openModal('export_android');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-green-400" />
                  <span>Android Deliverables & Code</span>
                </button>
                <button
                  onClick={resetAllDemoState}
                  className="flex items-center gap-1 py-2 px-3 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl font-medium border border-red-800/40 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
