import React, { useState } from 'react';
import {
  X,
  Package,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ParcelDeliveryModalProps {
  onClose: () => void;
}

export const ParcelDeliveryModal: React.FC<ParcelDeliveryModalProps> = ({ onClose }) => {
  const { startParcelDeliveryBooking, pickupLocation } = useApp();

  const [senderName, setSenderName] = useState('Alex Morgan');
  const [senderPhone, setSenderPhone] = useState('+44 7911 123456');
  const [pickupAddress, setPickupAddress] = useState(pickupLocation.address);

  const [recipientName, setRecipientName] = useState('Emma Watson');
  const [recipientPhone, setRecipientPhone] = useState('+44 7822 889900');
  const [deliveryAddress, setDeliveryAddress] = useState('The Greenhouse, MediaCityUK, M50 2EQ');

  const [category, setCategory] = useState<'Documents' | 'Small Box' | 'Food & Groceries' | 'Clothing' | 'Electronics'>('Documents');
  const [description, setDescription] = useState('Confidential contract folder & keys');
  const [size, setSize] = useState<'Envelope' | 'Small Bag' | 'Medium Box (Fits on bike)'>('Envelope');
  const [weight, setWeight] = useState<'Under 1kg' | '1 - 3kg' | '3 - 5kg' | '5 - 10kg'>('Under 1kg');
  const [handlingNotes, setHandlingNotes] = useState('Please keep upright and away from rain.');
  const [urgency, setUrgency] = useState<'Standard' | 'Express'>('Express');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const estimatedFare = urgency === 'Express' ? 8.90 : 5.80;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    startParcelDeliveryBooking({
      senderName,
      senderPhone,
      pickupAddress,
      recipientName,
      recipientPhone,
      deliveryAddress,
      category,
      description,
      size,
      weight,
      handlingNotes,
      urgency,
      price: estimatedFare,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-300">
      {/* Top Header */}
      <div className="p-4 border-b border-[#E3EAE3] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#17231B]">Send a Parcel by Bike</h3>
            <p className="text-[11px] text-[#68746B]">Same-day rapid courier dispatch</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* Addresses Section */}
        <div className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3] space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Pickup & Delivery Route
          </span>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Sender Pickup Spot</label>
            <input
              type="text"
              required
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
            />
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <input
                type="text"
                placeholder="Sender Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
              />
              <input
                type="tel"
                placeholder="Sender Phone"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Recipient Destination</label>
            <input
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
            />
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <input
                type="text"
                placeholder="Recipient Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
              />
              <input
                type="tel"
                placeholder="Recipient Phone"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Parcel Category & Specs */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#17231B] block">Parcel Category</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['Documents', 'Small Box', 'Food & Groceries', 'Clothing', 'Electronics'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-2 rounded-xl text-center text-xs font-medium border transition-all ${
                  category === cat
                    ? 'border-[#16A34A] bg-green-50 text-green-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Package Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Spare keys, legal papers, laptop charger..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          {/* Weight & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Weight</label>
              <select
                value={weight}
                onChange={(e) => setWeight(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Under 1kg">Under 1kg</option>
                <option value="1 - 3kg">1 - 3kg</option>
                <option value="3 - 5kg">3 - 5kg</option>
                <option value="5 - 10kg">5 - 10kg (Max for bike)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Envelope">Envelope</option>
                <option value="Small Bag">Small Bag</option>
                <option value="Medium Box (Fits on bike)">Medium Box</option>
              </select>
            </div>
          </div>

          {/* Photo Placeholder */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Package Photo (Optional verification)
            </label>
            <button
              type="button"
              onClick={() => setHasPhoto(!hasPhoto)}
              className="w-full py-3 rounded-2xl border border-dashed border-slate-300 hover:border-green-500 bg-slate-50 flex items-center justify-center gap-2 text-xs text-slate-600 transition-colors"
            >
              <Camera className="w-4 h-4 text-slate-400" />
              <span>{hasPhoto ? '✓ Photo Attached (package_demo.jpg)' : 'Attach Package Photo'}</span>
            </button>
          </div>
        </div>

        {/* Speed / Urgency Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#17231B] block">Delivery Urgency</label>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setUrgency('Express')}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                urgency === 'Express'
                  ? 'border-[#16A34A] bg-green-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-green-700 font-bold text-xs">
                <Zap className="w-4 h-4 fill-current" />
                <span>Express Courier</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Direct point-to-point in ~25 min</p>
              <span className="text-sm font-extrabold text-[#17231B] block mt-1">£8.90</span>
            </div>

            <div
              onClick={() => setUrgency('Standard')}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                urgency === 'Standard'
                  ? 'border-[#16A34A] bg-green-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>Standard</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Delivered within 60 min</p>
              <span className="text-sm font-extrabold text-[#17231B] block mt-1">£5.80</span>
            </div>
          </div>
        </div>

        {/* Prohibited items warning notice */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Prohibited Items Notice:</strong> RideNHop couriers do not transport cash, illegal substances,
            firearms, flammable chemicals, or fragile oversized cargo. Max motorcycle carry capacity is 10kg.
          </p>
        </div>

        {/* Terms agreement */}
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 accent-[#16A34A] rounded"
          />
          <span>I confirm parcel complies with RideNHop transport standards.</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={!acceptedTerms}
          className="w-full h-13 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-between px-5 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50"
        >
          <span>Dispatch Delivery Courier</span>
          <span className="text-base font-extrabold">£{estimatedFare.toFixed(2)}</span>
        </button>
      </form>
    </div>
  );
};
