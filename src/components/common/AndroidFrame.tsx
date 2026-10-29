import React from 'react';
import { Smartphone, Monitor, RefreshCw, Layers, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const {
    currentRole,
    switchRole,
    deviceFrameEnabled,
    setDeviceFrameEnabled,
    openModal,
    resetAllDemoState,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start py-2 sm:py-6 px-1 sm:px-4 text-slate-100 font-sans">
      {/* Top Controller Bar */}
      <header className="w-full max-w-4xl mb-3 flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#16A34A] flex items-center justify-center font-bold text-white shadow-md shadow-green-900/30">
            RH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">RideNHop</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-green-400 border border-green-500/30">
                Android Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Two-sided motorcycle ride & parcel delivery marketplace
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Switch Role Button */}
          <button
            onClick={() => switchRole(currentRole === 'ridee' ? 'rider' : 'ridee')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Switch between Passenger and Driver experience"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-green-400" />
            <span>Role: <strong className="text-white capitalize">{currentRole}</strong></span>
          </button>

          {/* Toggle Device Frame */}
          <button
            onClick={() => setDeviceFrameEnabled(!deviceFrameEnabled)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Toggle between Android device frame and responsive screen"
          >
            {deviceFrameEnabled ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>Responsive View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Pixel 8 Frame</span>
              </>
            )}
          </button>

          {/* Export Project Source Info */}
          <button
            onClick={() => openModal('export_android')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android Deliverables</span>
            <span className="sm:hidden">APK / Code</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={resetAllDemoState}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Reset demo data to initial state"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main App Container */}
      <main
        className={`w-full transition-all duration-300 flex justify-center ${
          deviceFrameEnabled ? 'max-w-[430px]' : 'max-w-2xl'
        }`}
      >
        <div
          className={`w-full relative bg-[#F7FAF7] text-[#17231B] overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${
            deviceFrameEnabled
              ? 'rounded-[44px] border-[10px] border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] h-[880px] max-h-[92vh]'
              : 'rounded-2xl border border-slate-800 min-h-[820px]'
          }`}
        >
          {/* Android Status Bar (Material 3 style) */}
          <div className="shrink-0 h-9 px-6 bg-transparent flex items-center justify-between text-xs font-medium z-30 select-none text-[#17231B]">
            <span className="font-semibold text-[13px] tracking-tight">16:15</span>

            {/* Front Camera Punch-hole Notch */}
            <div className="w-4 h-4 rounded-full bg-black/80 ring-2 ring-black/10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800/80" />
            </div>

            {/* Status Icons: 5G, Wi-Fi, Battery */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[10px] font-bold tracking-tight">5G</span>
              {/* Wi-Fi Icon */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 2.5c3.8 0 7.23 1.54 9.75 4.04L12 18.28 2.25 10.54C4.77 8.04 8.2 6.5 12 6.5z" />
              </svg>
              {/* Battery Icon */}
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
                  <div className="h-full w-[85%] bg-current rounded-2xs" />
                </div>
                <div className="w-0.5 h-1 bg-current rounded-r-xs" />
              </div>
            </div>
          </div>

          {/* Screen Content Container with inner scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#F7FAF7]">
            {children}
          </div>

          {/* Android Gesture Navigation Pill Bar */}
          <div className="shrink-0 h-5 bg-[#F7FAF7] flex items-center justify-center pointer-events-none z-30">
            <div className="w-32 h-1 bg-slate-400/60 rounded-full" />
          </div>
        </div>
      </main>

      {/* Footer Prototype Notice */}
      <footer className="w-full max-w-4xl mt-3 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        <span>RideNHop Android Prototype · Fictional UK mobility sandbox · No real payments or GPS required</span>
      </footer>
    </div>
  );
};
