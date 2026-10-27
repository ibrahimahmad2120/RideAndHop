import React from 'react';
import { ArrowUpRight, ArrowLeft, Navigation, Volume2, X, Compass, ShieldAlert } from 'lucide-react';
import { StylizedMap } from '../common/StylizedMap';
import { IncomingJobRequest } from '../../types';

interface RiderNavigationHUDProps {
  onCloseHUD: () => void;
  activeJob: IncomingJobRequest;
  onAdvance: () => void;
}

export const RiderNavigationHUD: React.FC<RiderNavigationHUDProps> = ({
  onCloseHUD,
  activeJob,
  onAdvance,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none relative h-full">
      {/* Top Turn Instruction Card (Dark Mode GPS style) */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 z-20 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>GPS Locked · Lane Assist Active</span>
          </span>
          <button
            onClick={onCloseHUD}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-900/40">
            <ArrowUpRight className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">In 200 metres</div>
            <p className="text-xs font-semibold text-slate-300">
              Turn slight left onto Oxford Road (B5117)
            </p>
          </div>
        </div>
      </div>

      {/* Stylized Vector Route Canvas in Dark Mode */}
      <div className="flex-1 relative overflow-hidden bg-slate-900">
        <StylizedMap
          riderPosition={{ x: 50, y: 55, angle: 75 }}
          heightClass="h-full"
        />

        {/* Speedometer & Compass Floating Overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Speed Indicator */}
          <div className="w-16 h-16 rounded-2xl bg-slate-950/90 border border-slate-700 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-white tabular-nums tracking-tighter">28</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">MPH</span>
          </div>

          <div className="w-8 h-8 rounded-xl bg-slate-950/90 border border-slate-700 flex items-center justify-center text-green-400 shadow-md">
            <Compass className="w-4 h-4 animate-spin duration-3000" />
          </div>
        </div>

        {/* Recenter & Audio Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={() => alert('Voice directions unmuted: "In 200m turn left on Oxford Road"')}
            className="w-10 h-10 rounded-2xl bg-slate-950/90 border border-slate-700 text-white flex items-center justify-center shadow-md hover:bg-slate-800"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => alert('Map recentered on motorcycle GPS telemetry')}
            className="w-10 h-10 rounded-2xl bg-slate-950/90 border border-slate-700 text-green-400 flex items-center justify-center shadow-md hover:bg-slate-800"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Route Telemetry & Controls */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 z-20 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Destination Target</span>
            <span className="font-bold text-white line-clamp-1">{activeJob.destinationName}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-green-400">1.4 km · 4 min</span>
            <span className="text-[10px] text-slate-400 block">ETA 16:24</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCloseHUD}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs transition-colors"
          >
            Exit HUD
          </button>
          <button
            onClick={() => {
              onAdvance();
              onCloseHUD();
            }}
            className="flex-2 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
          >
            Advance Route Step
          </button>
        </div>
      </div>
    </div>
  );
};
