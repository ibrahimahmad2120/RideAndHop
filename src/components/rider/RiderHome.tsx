import React from 'react';
import {
  Power,
  Navigation,
  Bike,
  Package,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  ChevronRight,
  Flame,
  AlertCircle,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StylizedMap } from '../common/StylizedMap';

interface RiderHomeProps {
  onOpenRequests: () => void;
  onOpenEarnings: () => void;
}

export const RiderHome: React.FC<RiderHomeProps> = ({ onOpenRequests, onOpenEarnings }) => {
  const {
    isRiderOnline,
    setIsRiderOnline,
    riderProfile,
    riderEarningsToday,
    riderCompletedRides,
    riderCompletedDeliveries,
    riderAcceptanceRate,
    riderRating,
    incomingRequests,
    activeRiderJob,
    setActiveRiderTab,
    openModal,
  } = useApp();

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none pb-20">
      {/* Top Header Zone */}
      <div className="px-4 pt-2 pb-3 bg-white border-b border-[#E3EAE3] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={riderProfile.avatar}
              alt={riderProfile.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-2xl object-cover border border-green-500 shadow-xs"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                isRiderOnline ? 'bg-green-500' : 'bg-slate-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#17231B]">{riderProfile.name}</span>
              <span className="text-[10px] font-semibold text-slate-500">({riderProfile.bikeModel.split('(')[0]})</span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#16A34A]" />
              <span>Deansgate Square · Idle</span>
            </p>
          </div>
        </div>

        {/* Online / Offline Switch Button */}
        <button
          onClick={() => setIsRiderOnline(!isRiderOnline)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-xs shadow-xs transition-all ${
            isRiderOnline
              ? 'bg-[#16A34A] text-white hover:bg-[#15803D]'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isRiderOnline ? 'Online' : 'Offline'}</span>
        </button>
      </div>

      {/* Online Status Banner */}
      {!isRiderOnline ? (
        <div className="bg-slate-800 text-white p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>You are currently offline. Go online to receive ride requests.</span>
          </div>
          <button
            onClick={() => setIsRiderOnline(true)}
            className="px-2.5 py-1 bg-[#16A34A] rounded-lg text-white font-bold text-[11px]"
          >
            Go Online
          </button>
        </div>
      ) : (
        <div className="bg-[#E8F5E9] text-[#14532D] px-4 py-1.5 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
            <span>Accepting Passenger Rides & Parcel Deliveries</span>
          </span>
          <span className="text-[10px] font-bold text-[#16A34A]">High Demand</span>
        </div>
      )}

      {/* Stylized Map with Heatmap Zones */}
      <div className="relative">
        <StylizedMap
          riderPosition={{ x: 38, y: 55, angle: 90 }}
          showHeatmap={true}
          heightClass="h-44 sm:h-52"
        />

        {/* Floating Demand Pill */}
        <div className="absolute top-2.5 left-3 bg-[#17231B]/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-slate-700 shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Piccadilly Surge (+£1.50/trip)</span>
        </div>
      </div>

      {/* Main Stats & Queue */}
      <div className="p-4 space-y-4">
        {/* Today's KPI Strip */}
        <div
          onClick={onOpenEarnings}
          className="p-4 rounded-3xl bg-gradient-to-br from-[#14532D] to-[#0A2614] text-white shadow-md flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-[11px] font-medium text-green-300">Today's Earnings</span>
            <div className="text-2xl font-extrabold tracking-tight mt-0.5">
              £{riderEarningsToday.toFixed(2)}
            </div>
            <p className="text-[10px] text-green-200 mt-1">
              {riderCompletedRides} Rides · {riderCompletedDeliveries} Parcels · 4h 25m online
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-green-300 hover:text-white">
            <span>Details</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Mini Performance Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-white border border-[#E3EAE3] text-center shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold block">Rating</span>
            <div className="text-sm font-extrabold text-[#17231B] flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>{riderRating}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#E3EAE3] text-center shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold block">Accept Rate</span>
            <div className="text-sm font-extrabold text-[#16A34A] mt-0.5">
              {riderAcceptanceRate}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#E3EAE3] text-center shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold block">Today's Jobs</span>
            <div className="text-sm font-extrabold text-[#17231B] mt-0.5">
              {riderCompletedRides + riderCompletedDeliveries}
            </div>
          </div>
        </div>

        {/* Incoming Dispatch Queue Shortcut */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#17231B]">Available Requests</span>
              <span className="text-[10px] font-bold text-white bg-green-600 px-1.5 py-0.2 rounded-full">
                {incomingRequests.length}
              </span>
            </div>
            <button
              onClick={onOpenRequests}
              className="text-[11px] font-bold text-[#16A34A] hover:underline"
            >
              View Queue
            </button>
          </div>

          {incomingRequests.length > 0 ? (
            <div
              onClick={onOpenRequests}
              className="p-3.5 rounded-2xl bg-white border border-green-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-[#16A34A] flex items-center justify-center">
                  {incomingRequests[0].type === 'ride' ? (
                    <Bike className="w-5 h-5" />
                  ) : (
                    <Package className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17231B]">
                    {incomingRequests[0].customerName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {incomingRequests[0].pickupName.split('(')[0]} · {incomingRequests[0].pickupDistanceKm} km
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-[#16A34A] block">
                  +£{incomingRequests[0].earnings.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">Tap to respond</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              No pending jobs in your immediate zone. Stay online!
            </div>
          )}
        </div>

        {/* Quick Simulation Trigger Buttons for Testing */}
        <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-green-200 text-xs space-y-2">
          <span className="font-bold text-green-900 block">Rider Test Triggers</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openModal('incoming_ride')}
              className="py-2 px-2 bg-white rounded-xl text-[11px] font-bold text-[#14532D] shadow-xs border border-green-200 flex items-center justify-center gap-1 hover:bg-green-50"
            >
              <Bike className="w-3.5 h-3.5 text-green-600" />
              <span>Trigger Ride</span>
            </button>
            <button
              onClick={() => openModal('incoming_delivery')}
              className="py-2 px-2 bg-white rounded-xl text-[11px] font-bold text-[#14532D] shadow-xs border border-green-200 flex items-center justify-center gap-1 hover:bg-green-50"
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Trigger Parcel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
