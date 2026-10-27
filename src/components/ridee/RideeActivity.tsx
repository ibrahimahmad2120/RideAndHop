import React, { useState } from 'react';
import { Bike, Package, ArrowRight, Download, Star, Calendar, FileText, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RideBooking, ParcelDeliveryBooking } from '../../types';

export const RideeActivity: React.FC = () => {
  const { pastRides, pastDeliveries, setPickupLocation, setDestinationLocation, setSelectedRideOption, openModal } = useApp();
  const [filter, setFilter] = useState<'all' | 'rides' | 'deliveries'>('all');
  const [selectedRideDetail, setSelectedRideDetail] = useState<RideBooking | null>(null);
  const [selectedDeliveryDetail, setSelectedDeliveryDetail] = useState<ParcelDeliveryBooking | null>(null);

  const handleRebookRide = (booking: RideBooking) => {
    setPickupLocation(booking.pickup);
    setDestinationLocation(booking.destination);
    setSelectedRideOption(booking.rideType);
    openModal('choose_ride');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none p-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#17231B] tracking-tight">Your Activity</h2>
        <p className="text-xs text-[#68746B]">Completed journeys & parcel deliveries</p>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-2xl mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'all' ? 'bg-white text-[#17231B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('rides')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'rides' ? 'bg-white text-[#17231B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bikes ({pastRides.length})
        </button>
        <button
          onClick={() => setFilter('deliveries')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'deliveries' ? 'bg-white text-[#17231B] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Parcels ({pastDeliveries.length})
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {(filter === 'all' || filter === 'rides') &&
          pastRides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => setSelectedRideDetail(ride)}
              className="p-3.5 rounded-2xl bg-white border border-[#E3EAE3] shadow-xs hover:border-green-300 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#17231B]">{ride.rideType.name}</h4>
                    <p className="text-[10px] text-slate-400">{ride.createdAt} · Ref: {ride.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#17231B]">
                    £{(ride.finalFare + (ride.tip || 0)).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-green-600 block font-medium">Completed</span>
                </div>
              </div>

              {/* Route */}
              <div className="text-[11px] text-[#17231B] pl-2 border-l-2 border-green-500/40 space-y-0.5">
                <p className="truncate font-medium">{ride.pickup.name}</p>
                <p className="truncate font-semibold text-slate-700">{ride.destination.name}</p>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-bold text-slate-700">{ride.rating || 5}.0</span>
                  <span className="text-slate-400">· {ride.rider.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRebookRide(ride);
                  }}
                  className="font-bold text-[#16A34A] hover:underline flex items-center gap-0.5"
                >
                  <span>Rebook</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

        {(filter === 'all' || filter === 'deliveries') &&
          pastDeliveries.map((del) => (
            <div
              key={del.id}
              onClick={() => setSelectedDeliveryDetail(del)}
              className="p-3.5 rounded-2xl bg-white border border-[#E3EAE3] shadow-xs hover:border-amber-300 transition-all cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#17231B]">{del.category} Delivery</h4>
                    <p className="text-[10px] text-slate-400">{del.createdAt} · Ref: {del.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#17231B]">£{del.price.toFixed(2)}</span>
                  <span className="text-[10px] text-green-600 block font-medium">Delivered</span>
                </div>
              </div>

              <div className="text-[11px] text-[#17231B] pl-2 border-l-2 border-amber-500/40 space-y-0.5">
                <p className="truncate font-medium">{del.pickupAddress}</p>
                <p className="truncate font-semibold text-slate-700">{del.deliveryAddress}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                <span>Recipient: {del.recipientName}</span>
                <span className="text-green-700 font-semibold">{del.proofSignature || 'Signed'}</span>
              </div>
            </div>
          ))}
      </div>

      {/* Ride Detail Modal */}
      {selectedRideDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#17231B]">Ride Receipt</h3>
                <p className="text-[10px] text-slate-400">Ref: {selectedRideDetail.reference}</p>
              </div>
              <button
                onClick={() => setSelectedRideDetail(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Rider</span>
                <span className="font-bold text-[#17231B]">{selectedRideDetail.rider.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Motorcycle</span>
                <span className="font-medium">{selectedRideDetail.rider.bikeModel}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vehicle Plate</span>
                <span className="font-mono font-bold">{selectedRideDetail.rider.registrationNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method</span>
                <span>{selectedRideDetail.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-[#17231B]">
                <span>Total Fare</span>
                <span className="text-[#16A34A]">£{selectedRideDetail.finalFare.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                handleRebookRide(selectedRideDetail);
                setSelectedRideDetail(null);
              }}
              className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl text-xs"
            >
              Rebook This Route
            </button>
          </div>
        </div>
      )}

      {/* Delivery Detail Modal */}
      {selectedDeliveryDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#17231B]">Delivery Receipt</h3>
                <p className="text-[10px] text-slate-400">Ref: {selectedDeliveryDetail.reference}</p>
              </div>
              <button
                onClick={() => setSelectedDeliveryDetail(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Category</span>
                <span className="font-bold text-[#17231B]">{selectedDeliveryDetail.category}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Weight & Size</span>
                <span>{selectedDeliveryDetail.weight} · {selectedDeliveryDetail.size}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Courier</span>
                <span className="font-semibold">{selectedDeliveryDetail.courier.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Proof of Delivery</span>
                <span className="text-green-700 font-bold">{selectedDeliveryDetail.proofSignature}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-[#17231B]">
                <span>Total Paid</span>
                <span className="text-[#16A34A]">£{selectedDeliveryDetail.price.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDeliveryDetail(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
