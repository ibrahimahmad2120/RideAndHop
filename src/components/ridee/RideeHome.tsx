import React, { useState, useEffect } from 'react';
import {
  Bike,
  Package,
  Search,
  MapPin,
  Clock,
  Bookmark,
  Bell,
  Shield,
  Tag,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Calendar,
  Zap,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StylizedMap } from '../common/StylizedMap';
import { MOCK_LOCATIONS } from '../../data/mockData';

interface RideeHomeProps {
  onOpenSearch: () => void;
  onOpenChooseRide: () => void;
  onOpenParcelModal: () => void;
  onOpenNotifications: () => void;
  onOpenSafety: () => void;
  onOpenReserve: () => void;
}

export const RideeHome: React.FC<RideeHomeProps> = ({
  onOpenSearch,
  onOpenChooseRide,
  onOpenParcelModal,
  onOpenNotifications,
  onOpenSafety,
  onOpenReserve,
}) => {
  const {
    pickupLocation,
    destinationLocation,
    setDestinationLocation,
    unreadNotifCount,
    appliedPromo,
    pastRides,
    setActiveRideeTab,
  } = useApp();

  const [membershipActive, setMembershipActive] = useState<boolean>(true);
  const [activeSurge, setActiveSurge] = useState<string>('Normal Rates');

  useEffect(() => {
    // Fetch live pricing zones and membership from backend
    fetch('/api/pricing/zones')
      .then((res) => res.json())
      .then((data) => {
        if (data.zones && data.zones[0]) {
          setActiveSurge(data.zones[0].label);
        }
      })
      .catch(() => {});

    fetch('/api/membership')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isActive === 'boolean') {
          setMembershipActive(data.isActive);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectRecent = (loc: typeof MOCK_LOCATIONS[0]) => {
    setDestinationLocation(loc);
    onOpenChooseRide();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none pb-20">
      {/* Top App Bar Zone */}
      <div className="px-4 pt-2 pb-3 bg-white border-b border-[#E3EAE3] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveRideeTab('profile')}
            className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center font-bold text-sm border border-green-300 cursor-pointer"
          >
            AM
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#68746B]">Good afternoon,</span>
              <span className="text-xs font-bold text-[#17231B]">Alex 👋</span>
            </div>
            <p className="text-[11px] text-[#16A34A] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Greater Manchester · Live</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSafety}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Safety Guidelines"
          >
            <Shield className="w-5 h-5 text-green-700" />
          </button>
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>

      {/* NextRide One / Uber One Membership Strip */}
      {membershipActive && (
        <div className="bg-slate-900 text-white px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-green-500 text-slate-950 px-1.5 py-0.2 rounded font-mono">
              ONE
            </span>
            <span className="text-[11px] font-semibold text-slate-200">
              NextRide One Member · 10% off rides & free delivery active
            </span>
          </div>
          <span className="text-[10px] text-green-400 font-bold">Saved £34.80</span>
        </div>
      )}

      {/* Stylized City Map Preview with Idle Bikes */}
      <div className="relative">
        <StylizedMap
          pickup={pickupLocation}
          destination={destinationLocation}
          showNearbyBikes={true}
          heightClass="h-44 sm:h-52"
        />

        {/* Floating Pickup & Live Surge Badge */}
        <div className="absolute bottom-2.5 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-[#E3EAE3] shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
            <span className="font-bold text-[#17231B] truncate">{pickupLocation.name}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
              <span>{activeSurge}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* Destination Search Field Trigger */}
        <div
          onClick={onOpenSearch}
          className="p-3.5 rounded-2xl bg-white border border-[#E3EAE3] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#16A34A] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#17231B] flex items-center justify-center group-hover:bg-[#E8F5E9] group-hover:text-[#16A34A] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#17231B] block">Where to, Alex?</span>
              <span className="text-[11px] text-[#68746B]">
                {destinationLocation ? destinationLocation.name : 'Search address, station, venue...'}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#16A34A] flex items-center gap-0.5">
            <span>Go</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>

        {/* Action Grid: Book a Bike, Send Parcel & Uber Reserve Ahead */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Book a Bike */}
          <div
            onClick={onOpenChooseRide}
            className="p-3 rounded-2xl bg-white border-2 border-[#16A34A] shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group text-center flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs text-[#17231B]">Ride Now</h3>
            <span className="text-[10px] font-bold text-[#16A34A] mt-1">From £4.80</span>
          </div>

          {/* Send a Parcel */}
          <div
            onClick={onOpenParcelModal}
            className="p-3 rounded-2xl bg-white border border-[#E3EAE3] shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group text-center flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs text-[#17231B]">Courier</h3>
            <span className="text-[10px] font-bold text-amber-700 mt-1">From £5.80</span>
          </div>

          {/* Uber Reserve: Schedule Ahead */}
          <div
            onClick={onOpenReserve}
            className="p-3 rounded-2xl bg-white border border-[#E3EAE3] shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group text-center flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-xs text-[#17231B]">Reserve</h3>
            <span className="text-[10px] font-bold text-blue-700 mt-1">Plan Ahead</span>
          </div>
        </div>

        {/* Saved Shortcuts: Home & Work */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSelectRecent(MOCK_LOCATIONS[1])}
            className="p-3 rounded-2xl bg-white border border-[#E3EAE3] flex items-center gap-2.5 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-[#17231B] block truncate">Home</span>
              <span className="text-[10px] text-slate-400 block truncate">Ancoats Marina</span>
            </div>
          </button>

          <button
            onClick={() => handleSelectRecent(MOCK_LOCATIONS[2])}
            className="p-3 rounded-2xl bg-white border border-[#E3EAE3] flex items-center gap-2.5 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-[#17231B] block truncate">Work</span>
              <span className="text-[10px] text-slate-400 block truncate">MediaCityUK</span>
            </div>
          </button>
        </div>

        {/* Promo Banner Card */}
        <div
          onClick={() => setActiveRideeTab('offers')}
          className="p-4 rounded-3xl bg-gradient-to-r from-[#14532D] to-[#16A34A] text-white shadow-md flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                {appliedPromo ? 'Promo Active' : 'Special Offer'}
              </span>
              <h4 className="font-extrabold text-xs mt-1">
                {appliedPromo ? `${appliedPromo.code}: ${appliedPromo.discountTitle}` : '50% Off Your First 2 Rides'}
              </h4>
              <p className="text-[10px] text-green-100">
                {appliedPromo ? 'Applied automatically at checkout' : 'Tap to copy code NEXTRIDE50'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-green-200" />
        </div>

        {/* Recent Destinations Carousel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#17231B]">Recent Destinations</span>
            <button
              onClick={onOpenSearch}
              className="text-[11px] font-bold text-[#16A34A] hover:underline"
            >
              Search All
            </button>
          </div>

          <div className="space-y-1.5">
            {MOCK_LOCATIONS.slice(3, 6).map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleSelectRecent(loc)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-[#17231B] truncate">{loc.name}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{loc.address}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
