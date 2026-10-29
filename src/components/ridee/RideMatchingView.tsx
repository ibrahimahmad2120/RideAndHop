import React, { useEffect } from 'react';
import { Bike, X, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RideMatchingView: React.FC = () => {
  const { advanceRideTripStage, cancelRideTrip, selectedRideOption, pickupLocation, destinationLocation } = useApp();

  // Auto transition to matched rider after 2.5s for realistic simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      advanceRideTripStage();
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-white to-[#F7FAF7] select-none animate-in fade-in">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
          RideNHop Dispatch
        </span>
        <button
          onClick={cancelRideTrip}
          className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Radar Animation Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="relative flex items-center justify-center">
          {/* Pulsing Concentric Radar Rings */}
          <div className="absolute w-52 h-52 rounded-full border border-green-500/20 animate-ping duration-1000" />
          <div className="absolute w-40 h-40 rounded-full border border-green-500/30 animate-pulse duration-700" />
          <div className="absolute w-28 h-28 rounded-full bg-green-50 border border-green-200" />

          {/* Central Bike Icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-xl shadow-green-900/30">
            <Bike className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#17231B] mt-8 tracking-tight">
          Finding Your Rider...
        </h3>
        <p className="text-xs text-[#68746B] mt-1 text-center max-w-xs">
          Scanning verified motorcycle drivers near {pickupLocation.name.split('(')[0]}...
        </p>

        {/* Selected Ride Spec */}
        <div className="mt-6 flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E3EAE3] shadow-xs text-xs">
          <span className="font-bold text-[#17231B]">{selectedRideOption.name}</span>
          <span className="text-slate-300">|</span>
          <span className="text-green-700 font-semibold">£{selectedRideOption.price.toFixed(2)}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Sanitized Helmet Included</span>
        </div>
      </div>

      {/* Manual Instant Match & Cancel Controls */}
      <div className="space-y-2">
        <button
          onClick={advanceRideTripStage}
          className="w-full h-12 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <span>Fast-Forward: Connect Jordan Lee Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={cancelRideTrip}
          className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-red-600 text-center"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};
