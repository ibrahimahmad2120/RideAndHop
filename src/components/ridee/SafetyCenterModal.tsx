import React, { useState } from 'react';
import { X, ShieldCheck, PhoneCall, AlertTriangle, HelpCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SafetyCenterModalProps {
  onClose: () => void;
}

export const SafetyCenterModal: React.FC<SafetyCenterModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'emergency' | 'lost'>('checklist');
  const [lostItemText, setLostItemText] = useState('');
  const [lostReported, setLostReported] = useState(false);

  const handleReportLost = (e: React.FormEvent) => {
    e.preventDefault();
    setLostReported(true);
    setTimeout(() => {
      setLostReported(false);
      setLostItemText('');
      alert('Lost item case filed with NextRide 24/7 Operations. Reference: #LST-9102');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-200">
      <div className="p-4 border-b border-[#E3EAE3] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#17231B]">NextRide Safety Centre</h3>
            <p className="text-[11px] text-[#68746B]">Your safety is our foundational standard</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50 px-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`py-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'checklist'
              ? 'border-[#16A34A] text-[#16A34A]'
              : 'border-transparent text-slate-500'
          }`}
        >
          Ride Guidelines
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`py-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'emergency'
              ? 'border-[#16A34A] text-[#16A34A]'
              : 'border-transparent text-slate-500'
          }`}
        >
          Emergency (Demo)
        </button>
        <button
          onClick={() => setActiveTab('lost')}
          className={`py-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'lost'
              ? 'border-[#16A34A] text-[#16A34A]'
              : 'border-transparent text-slate-500'
          }`}
        >
          Lost Property
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-[#17231B]">
        {activeTab === 'checklist' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-green-200">
              <h4 className="font-bold text-green-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>NextRide Passenger Safety Rules</span>
              </h4>
              <p className="text-[11px] text-green-800 mt-1">
                Motorcycle commuting is fast and nimble. Follow these simple tips for a smooth journey.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h5 className="font-bold text-slate-900">Always Fasten the Helmet Chinstrap</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your rider will provide an ECE 22.06 certified helmet. Ensure it feels snug and the buckle clicks securely.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h5 className="font-bold text-slate-900">Feet on Passenger Pegs at All Times</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Keep your feet firmly planted on the rear foot pegs even when stopping at red lights or in traffic.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h5 className="font-bold text-slate-900">Lean Naturally With the Rider</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Do not fight motorcycle cornering angles; remain relaxed and aligned with your rider's torso.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <h5 className="font-bold text-slate-900">Vetted Background & Insurance</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Every NextRide driver passes rigorous DVLA licence checks, enhanced DBS vetting, and holds commercial passenger hire & reward coverage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Simulated Emergency Assistance</span>
              </div>
              <p className="text-[11px] text-red-700 mt-1">
                Notice: This is a prototype application. Pressing these controls simulates triggering emergency protocols without placing real 999 emergency calls.
              </p>
            </div>

            <button
              onClick={() => alert('[PROTOTYPE SIMULATION]: In a live app, this transmits live GPS coordinates and rider license details to emergency services.')}
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Simulate SOS Dispatch (Demo Only)</span>
            </button>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <h5 className="font-bold text-slate-900 mb-1">Configured Emergency Contact</h5>
              <p className="text-[11px] text-slate-600">Sarah Morgan (Sister) · +44 7700 900555</p>
              <p className="text-[10px] text-slate-400 mt-1">Status: Active SMS Trip Broadcast</p>
            </div>
          </div>
        )}

        {activeTab === 'lost' && (
          <form onSubmit={handleReportLost} className="space-y-3">
            <p className="text-[11px] text-slate-600">
              Left a helmet, phone, backpack, or keys in the top box or with your rider?
            </p>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Item Description</label>
              <textarea
                rows={3}
                required
                value={lostItemText}
                onChange={(e) => setLostItemText(e.target.value)}
                placeholder="e.g. Black thermos flask left in Comfort top box on trip NR-8821..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-hidden focus:border-[#16A34A]"
              />
            </div>
            <button
              type="submit"
              disabled={!lostItemText.trim() || lostReported}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50 hover:bg-slate-800"
            >
              {lostReported ? 'Filing Report...' : 'Submit Lost Property Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
