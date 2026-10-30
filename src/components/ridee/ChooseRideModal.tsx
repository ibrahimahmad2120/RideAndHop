import React, { useState } from 'react';
import {
  Bike,
  ShieldCheck,
  CreditCard,
  Tag,
  Check,
  ChevronDown,
  Info,
  ArrowRight,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_RIDE_OPTIONS } from '../../data/mockData';
import { RideTypeOption } from '../../types';

interface ChooseRideModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ChooseRideModal: React.FC<ChooseRideModalProps> = ({ onConfirm, onCancel }) => {
  const {
    pickupLocation,
    destinationLocation,
    selectedRideOption,
    setSelectedRideOption,
    appliedPromo,
    applyPromoCode,
    removePromo,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [showFareBreakdown, setShowFareBreakdown] = useState(false);

  // Swipe-down / drag-down to dismiss gesture
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setStartY(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startY === null) return;
    const diff = e.clientY - startY;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handlePointerUp = () => {
    if (dragY > 40) {
      onCancel();
    }
    setDragY(0);
    setStartY(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 40) {
      onCancel();
    }
    setDragY(0);
    setStartY(null);
  };

  const rawFare = selectedRideOption.price;
  const discount = appliedPromo
    ? (appliedPromo.code === 'RIDENHOP50' || appliedPromo.code === 'NEXTRIDE50'
        ? rawFare * 0.5
        : 2.50)
    : 0;
  const finalFare = Math.max(1.50, +(rawFare - discount).toFixed(2));

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div
      style={{ transform: dragY > 0 ? `translateY(${dragY}px)` : undefined }}
      className="bg-white rounded-t-3xl shadow-2xl border-t border-[#E3EAE3] flex flex-col max-h-[85dvh] sm:max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-250 transition-transform select-none"
    >
      {/* Top Drag & Swipe Handle Zone */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="shrink-0 pt-3 pb-2.5 px-5 cursor-grab active:cursor-grabbing border-b border-slate-100/80 bg-white touch-none"
      >
        <div className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto mb-2 transition-colors" />
        {/* Route Summary */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate flex-1 mr-2">
            <span className="font-bold text-[#17231B] truncate">{pickupLocation.name.split('(')[0]}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-[#17231B] truncate">
              {destinationLocation ? destinationLocation.name.split('(')[0] : 'City Destination'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-green-700 whitespace-nowrap bg-green-50 px-2 py-0.5 rounded-full">
              ~2.4 km · 11 min
            </span>
            <button
              onClick={onCancel}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Body (Options, Notice, Promo, Payment) */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 min-h-0">
        {/* Ride Options Cards */}
        <div className="space-y-2">
        {MOCK_RIDE_OPTIONS.map((option: RideTypeOption) => {
          const isSelected = selectedRideOption.id === option.id;
          const discountedOptFare = appliedPromo
            ? (appliedPromo.code === 'RIDENHOP50' || appliedPromo.code === 'NEXTRIDE50'
              ? option.price * 0.5
              : Math.max(1.50, option.price - 2.50))
            : option.price;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedRideOption(option)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-[#16A34A] bg-[#F7FAF7] shadow-sm ring-1 ring-[#16A34A]'
                  : 'border-[#E3EAE3] bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#16A34A] text-white' : 'bg-[#E8F5E9] text-[#16A34A]'
                  }`}
                >
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#17231B]">{option.name}</h4>
                    {option.id === 'express' && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">
                        Fastest
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#68746B] mt-0.5">{option.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-[#16A34A]">
                      <Clock className="w-3 h-3" />
                      {option.etaMinutes} min away
                    </span>
                    <span>·</span>
                    <span>Sanitized helmet included</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0 ml-3">
                <div className="text-sm font-bold text-[#17231B]">
                  £{discountedOptFare.toFixed(2)}
                </div>
                {appliedPromo && (
                  <div className="text-[10px] text-slate-400 line-through">
                    £{option.price.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety / Helmet Guarantee Notice */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#E8F5E9] text-xs text-[#14532D]">
        <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
        <span className="text-[11px] leading-tight">
          Safety First: Sanitized ECE 22.06 certified helmet & clean disposable liner provided.
        </span>
      </div>

      {/* Promo Code Input & Payment Selection */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        {/* Promo Code */}
        {appliedPromo ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-green-50 border border-green-200 text-xs">
            <div className="flex items-center gap-1.5 text-green-800 font-semibold">
              <Tag className="w-3.5 h-3.5 text-green-600" />
              <span>{appliedPromo.code}: {appliedPromo.discountTitle}</span>
            </div>
            <button
              onClick={removePromo}
              className="text-[11px] font-bold text-red-600 hover:text-red-700 underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo (e.g. RIDENHOP50)"
                className="w-full text-xs font-medium text-[#17231B] bg-transparent outline-hidden uppercase"
              />
            </div>
            <button
              onClick={handleApplyPromo}
              className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Apply
            </button>
          </div>
        )}

        {promoMessage && (
          <p
            className={`text-[11px] font-medium ${
              promoMessage.isError ? 'text-red-600' : 'text-green-700'
            }`}
          >
            {promoMessage.text}
          </p>
        )}

        {/* Payment Method Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPaymentPicker(!showPaymentPicker)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-600" />
              <span className="font-semibold text-[#17231B]">{selectedPaymentMethod.name}</span>
              <span className="text-[11px] text-slate-500">({selectedPaymentMethod.detail})</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showPaymentPicker && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-20 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Select Payment Method
              </span>
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => {
                    setSelectedPaymentMethod(pm);
                    setShowPaymentPicker(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer ${
                    selectedPaymentMethod.id === pm.id
                      ? 'bg-green-50 text-green-800 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{pm.name}</span>
                    <span className="text-[10px] text-slate-400">· {pm.detail}</span>
                  </div>
                  {selectedPaymentMethod.id === pm.id && <Check className="w-3.5 h-3.5 text-green-600" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Sticky Bottom Action Buttons Footer */}
      <div className="shrink-0 p-4 pt-2.5 border-t border-slate-100 flex items-center gap-3 bg-white shadow-xs">
        <button
          onClick={onCancel}
          className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shrink-0"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 h-12 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-between px-5 shadow-lg shadow-green-900/20 transition-all"
        >
          <span>Confirm {selectedRideOption.name}</span>
          <span className="text-base font-extrabold">£{finalFare.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};
