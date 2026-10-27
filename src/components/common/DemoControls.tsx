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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_INCOMING_REQUESTS } from '../../data/mockData';

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    topUpWallet,
  } = useApp();

  const isAnyRideActive = rideTripStage !== 'idle';
  const isAnyDeliveryActive = deliveryTripStage !== 'idle';
  const isRiderJobActive = activeRiderJob !== null && riderJobStage !== 'idle';

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      {/* Floating Pill Toggle Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#17231B] hover:bg-black text-white text-xs font-semibold px-3.5 py-2.5 rounded-full shadow-2xl border border-slate-700/80 transition-all hover:scale-105 active:scale-95"
        >
          <Wrench className="w-4 h-4 text-green-400" />
          <span>Demo Controls</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        <div className="w-80 bg-slate-900/95 backdrop-blur-xl text-slate-100 rounded-3xl border border-slate-700 p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-bold text-sm tracking-tight text-white">Interactive Demo Controls</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mt-3 text-xs">
            {/* Quick Role Switch */}
            <div className="bg-slate-800/80 p-2.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Current Experience</span>
                <span className="font-semibold text-white capitalize text-sm">{currentRole}</span>
              </div>
              <button
                onClick={() => switchRole(currentRole === 'ridee' ? 'rider' : 'ridee')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Switch to {currentRole === 'ridee' ? 'Rider' : 'Ridee'}</span>
              </button>
            </div>

            {/* Stage Progress for Active Workflows */}
            {(isAnyRideActive || isAnyDeliveryActive || isRiderJobActive) && (
              <div className="bg-green-950/50 border border-green-800/50 p-2.5 rounded-2xl space-y-1.5">
                <span className="text-[11px] font-semibold text-green-400 uppercase tracking-wider block">
                  Simulated Trip State
                </span>

                {isAnyRideActive && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize">Ride: {rideTripStage.replace('_', ' ')}</span>
                    <button
                      onClick={advanceRideTripStage}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-[11px]"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Next Stage</span>
                    </button>
                  </div>
                )}

                {isAnyDeliveryActive && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize">Delivery: {deliveryTripStage.replace('_', ' ')}</span>
                    <button
                      onClick={advanceDeliveryTripStage}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-[11px]"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Next Stage</span>
                    </button>
                  </div>
                )}

                {isRiderJobActive && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize">Rider Job: {riderJobStage.replace('_', ' ')}</span>
                    <button
                      onClick={advanceRiderJobStage}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-[11px]"
                    >
                      <FastForward className="w-3 h-3" />
                      <span>Next Step</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Triggers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openModal('incoming_ride')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <div className="flex items-center gap-1.5 text-green-400 font-semibold mb-0.5">
                  <Bike className="w-3.5 h-3.5" />
                  <span>Incoming Ride</span>
                </div>
                <p className="text-[10px] text-slate-400">Trigger passenger request</p>
              </button>

              <button
                onClick={() => openModal('incoming_delivery')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>Incoming Parcel</span>
                </div>
                <p className="text-[10px] text-slate-400">Trigger delivery request</p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => topUpWallet(20)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-0.5">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+£20 Wallet</span>
                </div>
                <p className="text-[10px] text-slate-400">Top-up passenger balance</p>
              </button>

              <button
                onClick={resetOnboarding}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left border border-slate-700/60"
              >
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-0.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Onboarding</span>
                </div>
                <p className="text-[10px] text-slate-400">Replay welcome walkthrough</p>
              </button>
            </div>

            {/* Export & Reset Row */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => openModal('export_android')}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium"
              >
                <Layers className="w-3.5 h-3.5 text-green-400" />
                <span>APK Guide & Code</span>
              </button>
              <button
                onClick={resetAllDemoState}
                className="flex items-center gap-1 py-1.5 px-3 bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded-xl font-medium border border-red-800/40"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
