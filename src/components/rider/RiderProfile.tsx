import React from 'react';
import {
  User,
  ShieldCheck,
  Bike,
  Star,
  CheckCircle2,
  ArrowRightLeft,
  Award,
  FileCheck,
  ChevronRight,
  Headphones,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RiderProfile: React.FC = () => {
  const { riderProfile, switchRole, openModal } = useApp();

  const documents = [
    { title: 'DVLA Full Motorcycle Licence (Cat A)', status: 'Verified', expires: '2031' },
    { title: 'Commercial Passenger & Parcel Insurance', status: 'Active Policy', expires: 'Jan 2027' },
    { title: 'Vehicle MOT & Emissions Check', status: 'Passed', expires: 'Nov 2027' },
    { title: 'Enhanced DBS Background Vetting', status: 'Cleared', expires: '2028' },
  ];

  const badges = [
    { title: 'Top Rated Rider', desc: 'Maintained 4.9+ rating for 6+ months' },
    { title: '1,000+ Safe Trips', desc: 'Zero incident record across Manchester' },
    { title: 'Express Courier Pro', desc: '98% on-time rapid parcel delivery' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none p-4 pb-28">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#17231B] tracking-tight">Rider Partner Profile</h2>
        <p className="text-xs text-[#68746B]">Driver credentials, vehicle specs, and ratings</p>
      </div>

      {/* Driver Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={riderProfile.avatar}
            alt={riderProfile.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-green-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#17231B]">{riderProfile.name}</h3>
              <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{riderProfile.rating}</span>
              </div>
            </div>
            <p className="text-xs text-[#68746B]">{riderProfile.bikeModel}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                {riderProfile.registrationNumber}
              </span>
              <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                ✓ Verified Partner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Switch to Ridee Mode Banner */}
      <div
        onClick={() => switchRole('ridee')}
        className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md flex items-center justify-between cursor-pointer mb-4 transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs">Switch to Passenger (Ridee) Mode</h4>
            <p className="text-[11px] text-slate-300">Book bike rides or send parcels</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Performance Scorecard */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs mb-4">
        <span className="text-xs font-bold text-[#17231B] block mb-3">Partner Performance</span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-[#F7FAF7] border border-slate-100">
            <span className="text-xs font-extrabold text-[#16A34A] block">96%</span>
            <span className="text-[10px] text-slate-500">Acceptance</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#F7FAF7] border border-slate-100">
            <span className="text-xs font-extrabold text-blue-600 block">98%</span>
            <span className="text-[10px] text-slate-500">On-Time</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#F7FAF7] border border-slate-100">
            <span className="text-xs font-extrabold text-amber-600 block">2%</span>
            <span className="text-[10px] text-slate-500">Cancellation</span>
          </div>
        </div>
      </div>

      {/* Verified Documents Checklist */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs mb-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#17231B]">Licence & Safety Verification</span>
          <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">
            All Documents Approved
          </span>
        </div>

        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F7FAF7] border border-slate-100 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <div>
                  <h5 className="font-semibold text-slate-800 text-[11px]">{doc.title}</h5>
                  <span className="text-[10px] text-slate-400">Valid through {doc.expires}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-green-700">{doc.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges / Milestones */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs space-y-2">
        <span className="text-xs font-bold text-[#17231B] block">Earned RideNHop Badges</span>
        <div className="space-y-2">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-2xl bg-amber-50/50 border border-amber-200/60">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-amber-950">{b.title}</h5>
                <p className="text-[10px] text-amber-800">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
