import React from 'react';
import { Package, MapPin, Flag, Star, Check, X, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { IncomingJobRequest } from '../../types';

interface IncomingDeliveryModalProps {
  request: IncomingJobRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingDeliveryModal: React.FC<IncomingDeliveryModalProps> = ({
  request,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E3EAE3] shadow-2xl p-5 flex flex-col space-y-4">
        {/* Header Alert */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h3 className="font-extrabold text-sm text-[#17231B] uppercase tracking-wider">
              New Parcel Job
            </h3>
          </div>
          <span className="text-base font-extrabold text-amber-700">
            +£{request.earnings.toFixed(2)}
          </span>
        </div>

        {/* Sender / Customer Info */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#17231B]">{request.customerName}</h4>
              <p className="text-[11px] text-slate-500">{request.parcelCategory} · {request.parcelWeight}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            {request.urgency || 'Express'}
          </span>
        </div>

        {/* Special Instructions Note */}
        {request.specialNotes && (
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
            <strong>Notes:</strong> {request.specialNotes}
          </div>
        )}

        {/* Route Details */}
        <div className="relative pl-5 space-y-2 text-xs">
          <div className="absolute left-1 top-2 bottom-2 flex flex-col items-center justify-between">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-0.5 flex-1 bg-slate-300 my-1 border-dashed" />
            <div className="w-2 h-2 rounded-xs bg-[#17231B]" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Pickup Sender ({request.pickupDistanceKm} km away)
            </span>
            <p className="font-bold text-[#17231B]">{request.pickupName}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Recipient Drop-off ({request.totalDistanceKm} km total)
            </span>
            <p className="font-bold text-[#17231B]">{request.destinationName}</p>
          </div>
        </div>

        {/* Actions: Accept or Decline */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={onDecline}
            className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-2 py-3 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-green-900/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Accept Parcel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
