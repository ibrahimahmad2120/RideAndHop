import React, { useState } from 'react';
import {
  Package,
  Bike,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Shield,
  FastForward,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StylizedMap } from '../common/StylizedMap';

interface DeliveryTrackingViewProps {
  onOpenChat: () => void;
  onOpenSafety: () => void;
}

export const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({
  onOpenChat,
  onOpenSafety,
}) => {
  const {
    activeDeliveryBooking,
    deliveryTripStage,
    advanceDeliveryTripStage,
    cancelDeliveryTrip,
    resetDeliveryToIdle,
  } = useApp();

  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  if (!activeDeliveryBooking) return null;

  const courier = activeDeliveryBooking.courier;

  const stagesList = [
    { key: 'request_placed', label: 'Placed', desc: 'Order transmitted' },
    { key: 'rider_assigned', label: 'Assigned', desc: 'Courier accepted' },
    { key: 'heading_to_pickup', label: 'To Pickup', desc: 'Heading to sender' },
    { key: 'parcel_collected', label: 'Collected', desc: 'Package secured' },
    { key: 'in_transit', label: 'In Transit', desc: 'Motorcycle en route' },
    { key: 'out_for_delivery', label: 'Arriving', desc: 'At destination' },
    { key: 'delivered', label: 'Delivered', desc: 'Recipient signed' },
  ];

  const currentStageIndex = stagesList.findIndex((s) => s.key === deliveryTripStage);

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none">
      {/* Map Header */}
      <div className="relative">
        <StylizedMap
          riderPosition={{ x: 50, y: 48, angle: 90 }}
          heightClass="h-64 sm:h-72"
        />

        {/* Floating Top Card */}
        <div className="absolute top-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#E3EAE3] shadow-md flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[#17231B]">
                  Parcel #{activeDeliveryBooking.reference}
                </span>
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.2 rounded-full">
                  {activeDeliveryBooking.urgency}
                </span>
              </div>
              <p className="text-[11px] text-[#68746B]">{activeDeliveryBooking.category} · {activeDeliveryBooking.weight}</p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-[#17231B]">
            £{activeDeliveryBooking.price.toFixed(2)}
          </span>
        </div>

        {/* Advance Pill */}
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={advanceDeliveryTripStage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#17231B] text-white text-xs font-semibold shadow-lg hover:bg-black active:scale-95 transition-transform"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>Advance Delivery State</span>
          </button>
        </div>
      </div>

      {/* Sheet Content */}
      <div className="flex-1 bg-white p-4 sm:p-5 rounded-t-3xl border-t border-[#E3EAE3] shadow-lg flex flex-col justify-between -mt-4 relative z-10 space-y-4">
        {/* Status Stepper Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#17231B]">Delivery Progress</span>
            <span className="text-[11px] text-green-600 font-semibold capitalize">
              {deliveryTripStage.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {stagesList.map((stg, i) => (
              <div key={stg.key} className="flex flex-col items-center">
                <div
                  className={`w-full h-1.5 rounded-full mb-1 transition-all ${
                    i <= currentStageIndex ? 'bg-[#16A34A]' : 'bg-slate-200'
                  }`}
                />
                <span className="text-[8px] font-medium text-slate-500 text-center leading-tight">
                  {stg.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Proof of delivery if delivered */}
        {deliveryTripStage === 'delivered' && (
          <div className="p-3 rounded-2xl bg-green-50 border border-green-200 text-xs space-y-2 animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-green-800 font-bold">
              <FileCheck className="w-4 h-4 text-green-600" />
              <span>Electronic Proof of Delivery Verified</span>
            </div>
            <p className="text-[11px] text-green-700">
              Parcel safely handed over to <strong>{activeDeliveryBooking.recipientName}</strong>.
            </p>
            <div className="p-2 bg-white rounded-xl border border-green-200 text-[10px] text-slate-600 italic">
              Signature: "{activeDeliveryBooking.recipientName.split(' ')[0][0]}. {activeDeliveryBooking.recipientName.split(' ')[1] || 'Recipient'}" (Verified)
            </div>
            <button
              onClick={resetDeliveryToIdle}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs"
            >
              Done & Close Tracking
            </button>
          </div>
        )}

        {/* Courier Details */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3]">
          <div className="flex items-center gap-3">
            <img
              src={courier.avatar}
              alt={courier.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-2xl object-cover border border-green-500"
            />
            <div>
              <h4 className="text-xs font-bold text-[#17231B]">{courier.name} (Courier)</h4>
              <p className="text-[11px] text-slate-600">{courier.bikeModel} · {courier.registrationNumber}</p>
              <span className="text-[10px] text-green-600 font-medium">★ {courier.rating} · Courier Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => alert(`Calling courier ${courier.name} at ${courier.phone}...`)}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChat}
              className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Route Details */}
        <div className="text-xs space-y-1.5 text-slate-600 bg-white p-3 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">From</span>
            <p className="text-xs font-semibold text-[#17231B] truncate">{activeDeliveryBooking.pickupAddress}</p>
          </div>
          <div className="pt-1.5 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">To</span>
            <p className="text-xs font-semibold text-[#17231B] truncate">{activeDeliveryBooking.deliveryAddress}</p>
          </div>
        </div>

        {/* Cancel if not yet collected */}
        {deliveryTripStage !== 'delivered' && deliveryTripStage !== 'in_transit' && (
          <button
            onClick={cancelDeliveryTrip}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-red-600 text-center"
          >
            Cancel Delivery Request
          </button>
        )}
      </div>
    </div>
  );
};
