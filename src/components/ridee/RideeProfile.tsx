import React, { useState } from 'react';
import {
  User,
  Shield,
  MapPin,
  Headphones,
  ArrowRightLeft,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RideeProfile: React.FC = () => {
  const { switchRole, resetOnboarding, openModal, resetAllDemoState } = useApp();
  const [helmetSize, setHelmetSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none p-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#17231B] tracking-tight">Profile & Settings</h2>
        <p className="text-xs text-[#68746B]">Account preferences and safety</p>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-green-100 text-[#16A34A] flex items-center justify-center font-bold text-xl border-2 border-green-500/40">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#17231B]">Alex Morgan</h3>
              <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                <Star className="w-3 h-3 fill-current" />
                <span>4.9</span>
              </div>
            </div>
            <p className="text-xs text-[#68746B]">alex.morgan@example.co.uk</p>
            <span className="text-[10px] text-slate-400">+44 7911 123456 · Ridee Account</span>
          </div>
        </div>
      </div>

      {/* Switch to Rider Mode Banner */}
      <div
        onClick={() => switchRole('rider')}
        className="p-4 rounded-3xl bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white shadow-md flex items-center justify-between cursor-pointer mb-4 transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-xs">Switch to Rider Mode</h4>
            <p className="text-[11px] text-green-100">Accept rides, courier jobs, and earn</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-green-200" />
      </div>

      {/* Helmet & Equipment Preference */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#17231B]">Passenger Helmet Size</span>
          <span className="text-[11px] text-green-600 font-semibold">{helmetSize}</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Riders ensure a sanitized helmet with fresh hairnet matching your size is ready at pickup.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(['Small', 'Medium', 'Large'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setHelmetSize(s)}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                helmetSize === s
                  ? 'border-[#16A34A] bg-green-50 text-green-800'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              Size {s[0]} ({s})
            </button>
          ))}
        </div>
      </div>

      {/* Shortcuts List */}
      <div className="bg-white rounded-3xl border border-[#E3EAE3] overflow-hidden shadow-xs divide-y divide-slate-100 mb-4">
        <button
          onClick={() => openModal('safety_center')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#17231B] block">Safety Centre</span>
              <span className="text-[10px] text-slate-500">Safety standards, emergency contacts</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => openModal('support_modal')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#17231B] block">Help & Support Tickets</span>
              <span className="text-[10px] text-slate-500">24/7 dedicated mobility care</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={resetOnboarding}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#17231B] block">Replay App Onboarding</span>
              <span className="text-[10px] text-slate-500">View welcome slides & permissions</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => openModal('export_android')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#17231B] block">Android Project Source & APK</span>
              <span className="text-[10px] text-slate-500">Manifest, build.gradle, and compile guides</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Logout & Reset Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-2.5 rounded-2xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Demo Sign Out</span>
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-[#17231B]">Confirm Sign Out?</h3>
            <p className="text-xs text-slate-500">
              This will reset the demo session back to the onboarding welcome walkthrough.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  resetAllDemoState();
                  resetOnboarding();
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
