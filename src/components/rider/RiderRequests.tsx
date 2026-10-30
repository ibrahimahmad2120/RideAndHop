import React, { useState } from 'react';
import { Bike, Package, Check, X, MapPin, Flag, Star, ArrowRight, Clock, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncomingJobRequest } from '../../types';

export const RiderRequests: React.FC = () => {
  const { incomingRequests, acceptJobRequest, declineJobRequest } = useApp();
  const [filter, setFilter] = useState<'all' | 'rides' | 'deliveries'>('all');

  const filtered = incomingRequests.filter((req) => {
    if (filter === 'rides') return req.type === 'ride';
    if (filter === 'deliveries') return req.type === 'delivery';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none p-4 pb-28">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#17231B] tracking-tight">Job Dispatch Queue</h2>
        <p className="text-xs text-[#68746B]">Available passenger rides and courier orders nearby</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-2xl mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'all' ? 'bg-white text-[#17231B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({incomingRequests.length})
        </button>
        <button
          onClick={() => setFilter('rides')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'rides' ? 'bg-white text-[#17231B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rides
        </button>
        <button
          onClick={() => setFilter('deliveries')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'deliveries' ? 'bg-white text-[#17231B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Deliveries
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 mx-auto flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#17231B]">All Clear for Now</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              You've accepted or declined all active requests. Use the Demo Controls floating button to trigger fresh requests!
            </p>
          </div>
        ) : (
          filtered.map((req) => {
            const isRide = req.type === 'ride';

            return (
              <div
                key={req.id}
                className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs hover:border-green-400 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isRide ? 'bg-green-100 text-[#16A34A]' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isRide ? <Bike className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#17231B]">{req.customerName}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="font-bold text-slate-700">{req.customerRating}</span>
                        <span>· {isRide ? 'Passenger' : `${req.parcelCategory} (${req.parcelWeight})`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#16A34A]">
                      +£{req.earnings.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{req.paymentType}</span>
                  </div>
                </div>

                {/* Route */}
                <div className="relative pl-5 space-y-1.5 text-xs text-[#17231B]">
                  <div className="absolute left-1 top-2 bottom-2 flex flex-col items-center justify-between">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                    <div className="w-0.5 flex-1 bg-slate-300 my-0.5 border-dashed" />
                    <div className="w-2 h-2 rounded-xs bg-[#17231B]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Pickup ({req.pickupDistanceKm} km away)
                    </span>
                    <p className="font-semibold truncate">{req.pickupName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Destination ({req.totalDistanceKm} km total)
                    </span>
                    <p className="font-semibold truncate">{req.destinationName}</p>
                  </div>
                </div>

                {/* Accept / Decline actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => declineJobRequest(req.id)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => acceptJobRequest(req)}
                    className="flex-2 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Job</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
