import React, { useState, useEffect } from 'react';
import { RefreshCw, Layers, ArrowRightLeft, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const {
    currentRole,
    switchRole,
    openModal,
    closeModal,
    activeModal,
    activeRideeTab,
    setActiveRideeTab,
    activeRiderTab,
    setActiveRiderTab,
    rideTripStage,
    cancelRideTrip,
    deliveryTripStage,
    cancelDeliveryTrip,
    toasts,
    dismissToast,
    showToast,
    resetAllDemoState,
  } = useApp();

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // System & Gesture Back Navigation handler
  const handleSystemBack = () => {
    if (activeModal) {
      closeModal();
      return;
    }
    if (currentRole === 'ridee') {
      if (rideTripStage === 'searching') {
        cancelRideTrip();
        showToast('Ride search cancelled', 'info');
        return;
      }
      if (deliveryTripStage === 'request_placed') {
        cancelDeliveryTrip();
        showToast('Delivery request cancelled', 'info');
        return;
      }
      if (activeRideeTab !== 'home') {
        setActiveRideeTab('home');
        return;
      }
    } else {
      if (activeRiderTab !== 'home') {
        setActiveRiderTab('home');
        return;
      }
    }
    showToast('Press again or switch apps to exit', 'info');
  };

  // Keyboard Escape & Browser PopState back navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        handleSystemBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, currentRole, activeRideeTab, activeRiderTab, rideTripStage, deliveryTripStage]);

  return (
    <div className="w-full h-screen h-[100dvh] bg-[#F7FAF7] flex justify-center items-center overflow-hidden font-sans select-none">
      {/* Native Mobile App Shell: 100% edge-to-edge full screen in webviews & mobile, centered on large desktop viewports */}
      <div className="w-full h-full max-w-none sm:max-w-[430px] sm:h-[100dvh] sm:max-h-[920px] sm:rounded-[36px] sm:shadow-2xl sm:border-[6px] sm:border-slate-800/90 relative flex flex-col bg-[#F7FAF7] text-[#17231B] overflow-hidden">
        
        {/* Native Android / Material 3 Status Bar */}
        <div className="shrink-0 h-8 px-5 bg-white border-b border-slate-100 flex items-center justify-between text-xs font-semibold z-30 select-none text-[#17231B]">
          <span className="font-bold text-[12px] tracking-tight">{currentTime}</span>

          {/* Front Camera Punch-hole Notch */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900/90 ring-2 ring-black/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700/80" />
          </div>

          {/* Status Icons: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <span className="text-[10px] font-bold tracking-tight">5G</span>
            {/* Wi-Fi Icon */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 2.5c3.8 0 7.23 1.54 9.75 4.04L12 18.28 2.25 10.54C4.77 8.04 8.2 6.5 12 6.5z" />
            </svg>
            {/* Battery Icon */}
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
                <div className="h-full w-[85%] bg-[#16A34A] rounded-2xs" />
              </div>
              <div className="w-0.5 h-1 bg-current rounded-r-xs" />
            </div>
          </div>
        </div>

        {/* Discreet Native Top Quick-Bar: Role Switcher & Demo Tools */}
        <div className="shrink-0 px-3 py-1.5 bg-slate-900 text-white flex items-center justify-between z-30 border-b border-slate-800 text-[11px]">
          {/* Role switcher chip */}
          <button
            onClick={() => switchRole(currentRole === 'ridee' ? 'rider' : 'ridee')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-semibold border border-slate-700 transition-colors"
            title="Switch between Passenger and Driver mode"
          >
            <ArrowRightLeft className="w-3 h-3 text-[#16A34A]" />
            <span>Role: <strong className="text-white capitalize">{currentRole === 'ridee' ? 'Passenger' : 'Driver'}</strong></span>
          </button>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openModal('demo_controls')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#16A34A]/25 hover:bg-[#16A34A]/40 active:bg-[#16A34A]/50 text-green-300 font-semibold border border-[#16A34A]/40 transition-colors shadow-xs"
              title="Open Interactive Demo & Scenario Controls"
            >
              <Wrench className="w-3 h-3 text-green-400" />
              <span>Demo Tools</span>
            </button>

            <button
              onClick={() => openModal('export_android')}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Android Deliverables & Code"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={resetAllDemoState}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset Demo State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main App Content Viewport */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[#F7FAF7] min-h-0">
          {children}

          {/* Native Android Floating Toast Stack */}
          {toasts.length > 0 && (
            <div className="absolute bottom-16 left-4 right-4 z-60 pointer-events-none flex flex-col items-center gap-2">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  onClick={() => dismissToast(toast.id)}
                  className={`pointer-events-auto px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 max-w-[90%] transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 border ${
                    toast.type === 'error'
                      ? 'bg-rose-900 text-white border-rose-700'
                      : toast.type === 'warning'
                      ? 'bg-amber-900 text-white border-amber-700'
                      : toast.type === 'success'
                      ? 'bg-emerald-900 text-white border-emerald-700'
                      : 'bg-slate-900/95 text-white border-slate-700/80 backdrop-blur-md'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0 bg-[#16A34A]" />
                  <span className="leading-snug">{toast.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Android Gesture Navigation Pill Bar with Back action */}
        <div
          onClick={handleSystemBack}
          className="shrink-0 h-5 bg-white flex items-center justify-between px-6 pb-1 select-none z-20 border-t border-slate-100/50 cursor-pointer hover:bg-slate-50 transition-colors"
          title="Tap gesture bar to trigger Android System Back"
        >
          <span className="text-[9px] font-bold text-slate-400">◁ Back</span>
          <div className="w-24 h-1 bg-slate-300 rounded-full" />
          <span className="text-[9px] font-bold text-slate-400">○ Home</span>
        </div>
      </div>
    </div>
  );
};
