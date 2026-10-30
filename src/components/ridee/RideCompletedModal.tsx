import React, { useState } from 'react';
import {
  CheckCircle2,
  Star,
  Download,
  Bike,
  ArrowRight,
  Heart,
  HelpCircle,
  ThumbsUp,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  DollarSign,
  Loader2,
  X,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RideCompletedModal: React.FC = () => {
  const { activeRideBooking, submitRideReview, resetRideToIdle } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTip, setSelectedTip] = useState<number>(2.00);
  const [customTip, setCustomTip] = useState<string>('');
  const [isCustomTip, setIsCustomTip] = useState<boolean>(false);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([
    'Clean Helmet & Liner',
    'Smooth Lane-Filtering',
  ]);
  const [reviewNote, setReviewNote] = useState<string>('');
  const [isFavoriteDriver, setIsFavoriteDriver] = useState<boolean>(true);
  const [receiptDownloaded, setReceiptDownloaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Lost item modal inside rating flow
  const [showLostItemModal, setShowLostItemModal] = useState<boolean>(false);
  const [lostItemDesc, setLostItemDesc] = useState<string>('');
  const [lostItemTicket, setLostItemTicket] = useState<string | null>(null);

  if (!activeRideBooking) return null;

  const compliments5Stars = [
    'Clean Helmet & Liner',
    'Smooth Lane-Filtering',
    'Expert Safe Driving',
    'Punctual Arrival',
    'Great Navigation',
    'Friendly Demeanour',
  ];

  const feedbackLowStars = [
    'Late Pickup',
    'Harsh Braking',
    'Helmet Fit Issue',
    'Route Navigation Delay',
  ];

  const currentCompliments = rating >= 4 ? compliments5Stars : feedbackLowStars;

  const toggleCompliment = (tag: string) => {
    setSelectedCompliments((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getTipAmount = (): number => {
    if (isCustomTip) {
      const parsed = parseFloat(customTip);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }
    return selectedTip;
  };

  const tipAmount = getTipAmount();
  const totalCharged = +(activeRideBooking.finalFare + tipAmount).toFixed(2);

  const getRatingSentiment = (stars: number): { text: string; sub: string } => {
    switch (stars) {
      case 5:
        return { text: 'Outstanding!', sub: 'Jordan provided an exceptional journey' };
      case 4:
        return { text: 'Great Ride!', sub: 'Smooth and enjoyable ride' };
      case 3:
        return { text: 'It was okay', sub: 'What could Jordan improve?' };
      case 2:
        return { text: 'Below expectations', sub: 'We are sorry about your experience' };
      case 1:
        return { text: 'Poor experience', sub: 'Please tell us what went wrong' };
      default:
        return { text: 'Rate your ride', sub: 'How was your motorcycle journey?' };
    }
  };

  const sentiment = getRatingSentiment(hoverRating || rating);

  const handleSubmitRatingFlow = async () => {
    setIsSubmitting(true);
    try {
      // Send rating & tip to backend API
      const res = await fetch(`/api/rides/${activeRideBooking.reference}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          review: reviewNote,
          tip: tipAmount,
          compliments: selectedCompliments,
          isFavorite: isFavoriteDriver,
        }),
      });

      if (!res.ok) {
        throw new Error('Rating submission failed');
      }
    } catch (err) {
      // In prototype or offline fallback, continue smoothly
      console.warn('Backend sync warning, proceeding with in-memory storage:', err);
    }

    // Update in-memory context state
    submitRideReview(rating, reviewNote, tipAmount, selectedCompliments);
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const receiptTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDownloadReceipt = () => {
    setReceiptDownloaded(true);
    if (receiptTimerRef.current) clearTimeout(receiptTimerRef.current);
    receiptTimerRef.current = setTimeout(() => setReceiptDownloaded(false), 2500);
  };

  React.useEffect(() => {
    return () => {
      if (receiptTimerRef.current) clearTimeout(receiptTimerRef.current);
    };
  }, []);

  const handleReportLostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostItemDesc.trim()) return;

    try {
      const res = await fetch(`/api/rides/${activeRideBooking.reference}/lost-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemDescription: lostItemDesc,
          contactPhone: '+44 7911 123456',
        }),
      });
      const data = await res.json();
      setLostItemTicket(data.ticket ? data.ticket.ticketId : 'LST-8902');
    } catch {
      setLostItemTicket('LST-8902');
    }
  };

  return (
    <div
      onClick={resetRideToIdle}
      className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E3EAE3] flex flex-col max-h-[92vh]"
      >
        {/* Top Header Card */}
        <div className="p-4 bg-gradient-to-b from-[#E8F5E9] to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeRideBooking.rider.avatar}
                alt={activeRideBooking.rider.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-green-600 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-green-600 text-white p-0.5 rounded-full border border-white">
                <Bike className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#17231B]">
                  {activeRideBooking.rider.name}
                </h3>
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded-full">
                  Rider
                </span>
              </div>
              <p className="text-[11px] text-[#68746B]">
                {activeRideBooking.rider.bikeModel.split('(')[0]} · {activeRideBooking.rider.registrationNumber}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Ref</span>
            <span className="font-mono font-bold text-xs text-slate-700">
              {activeRideBooking.reference}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {submitSuccess ? (
            /* Celebration Completion State */
            <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-green-100 text-green-600 mx-auto flex items-center justify-center shadow-lg">
                <Sparkles className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-black text-[#17231B]">Thank You!</h3>
              <p className="text-xs text-[#68746B] max-w-xs mx-auto">
                Your rating and {tipAmount > 0 ? `£${tipAmount.toFixed(2)} tip have` : 'feedback has'} been sent to{' '}
                <strong>Jordan Lee</strong>.
              </p>

              {isFavoriteDriver && (
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <span>Jordan added to your Favorite Drivers list</span>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3] text-xs space-y-1.5 text-left">
                <div className="flex justify-between text-slate-600">
                  <span>Ride Fare:</span>
                  <span>£{activeRideBooking.finalFare.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Driver Tip (100% to Jordan):</span>
                    <span>+£{tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-[#17231B]">
                  <span>Total Charged:</span>
                  <span className="text-base text-[#16A34A]">£{totalCharged.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>{receiptDownloaded ? 'Receipt Saved!' : 'Download VAT Receipt'}</span>
                </button>

                <button
                  onClick={resetRideToIdle}
                  className="w-full h-12 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all"
                >
                  <span>Book Another Ride</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Main Rating & Tipping Form */
            <>
              {/* Star Rating Section */}
              <div className="text-center space-y-2 pb-1">
                <div>
                  <h4 className="font-extrabold text-base text-[#17231B]">{sentiment.text}</h4>
                  <p className="text-xs text-[#68746B]">{sentiment.sub}</p>
                </div>

                <div className="flex justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Compliments / Feedback Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#17231B] block">
                  {rating >= 4 ? 'Recognize Jordan with Compliments' : 'What went wrong?'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCompliments.map((comp) => {
                    const isSelected = selectedCompliments.includes(comp);
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => toggleCompliment(comp)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-[#16A34A] text-white font-bold shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{comp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Driver Tip Selection (Uber Tipping Pattern) */}
              <div className="p-3.5 rounded-3xl bg-[#F7FAF7] border border-[#E3EAE3] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#16A34A]" />
                    <span className="font-bold text-xs text-[#17231B]">Add a Tip for Jordan</span>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    100% to Driver
                  </span>
                </div>

                <p className="text-[10px] text-[#68746B]">
                  Tips go directly to Jordan Lee's verified bank account without any platform deductions.
                </p>

                {/* Preset Tip Buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1.00, 2.00, 3.00].map((amt) => {
                    const active = !isCustomTip && selectedTip === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setIsCustomTip(false);
                          setSelectedTip(amt);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          active
                            ? 'border-[#16A34A] bg-[#16A34A] text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {amt === 0 ? 'No Tip' : `£${amt.toFixed(2)}`}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tip Input */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomTip(true);
                      setSelectedTip(5.00);
                    }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold border ${
                      isCustomTip && !customTip
                        ? 'border-[#16A34A] bg-green-50 text-green-800'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    £5.00
                  </button>

                  <div className="flex-1 flex items-center rounded-xl border border-slate-200 bg-white px-2 py-1">
                    <span className="text-xs font-bold text-slate-400 mr-1">£</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={customTip}
                      placeholder="Custom tip amount"
                      onChange={(e) => {
                        setIsCustomTip(true);
                        setCustomTip(e.target.value);
                      }}
                      className="w-full text-xs font-bold text-[#17231B] outline-hidden bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Uber Feature: Favorite Driver Toggle */}
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E3EAE3] cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Heart
                    className={`w-4 h-4 ${
                      isFavoriteDriver ? 'text-red-500 fill-red-500' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold text-[#17231B] block">Add to Favorite Drivers</span>
                    <span className="text-[10px] text-[#68746B]">Prioritize matching Jordan on your future rides</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFavoriteDriver}
                  onChange={(e) => setIsFavoriteDriver(e.target.checked)}
                  className="w-4 h-4 accent-[#16A34A] rounded"
                />
              </label>

              {/* Optional written note */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Compliment or Note for Jordan (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Great pace through the Piccadilly rush hour traffic..."
                  className="w-full text-xs p-2.5 rounded-2xl border border-slate-200 outline-hidden focus:border-[#16A34A]"
                />
              </div>

              {/* Itemized Fare & Tip Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3] text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Base Ride Fare</span>
                  <span>£{activeRideBooking.fare.toFixed(2)}</span>
                </div>
                {activeRideBooking.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount Applied</span>
                    <span>-£{activeRideBooking.discount.toFixed(2)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Rider Tip</span>
                    <span>+£{tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-extrabold text-sm text-[#17231B]">
                  <span>Total Bill Charged</span>
                  <span className="text-base text-[#16A34A]">£{totalCharged.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Paid via {activeRideBooking.paymentMethod} · Includes 20% UK VAT
                </p>
              </div>

              {/* Uber Feature: Lost Item In-App Assistance */}
              <div className="pt-1 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setShowLostItemModal(true)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline"
                >
                  Find lost item from this ride
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline"
                >
                  {receiptDownloaded ? 'Receipt Saved!' : 'Download VAT Receipt'}
                </button>
              </div>

              {/* Main Submit Rating Button */}
              <button
                type="button"
                onClick={handleSubmitRatingFlow}
                disabled={isSubmitting}
                className="w-full h-13 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-between px-5 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Rating & Tip'}</span>
                <span className="text-sm font-extrabold flex items-center gap-1">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : `£${totalCharged.toFixed(2)}`}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lost Item Claim In-App Drawer (Uber Feature) */}
      {showLostItemModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#17231B]">Lost Item on Motorcycle</h4>
              <button onClick={() => setShowLostItemModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {lostItemTicket ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-2xl text-xs space-y-2">
                <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                <p className="font-bold text-green-900 text-center">Jordan Has Been Alerted</p>
                <p className="text-[11px] text-green-800">
                  Case ref: <strong>{lostItemTicket}</strong>. Jordan will inspect the motorcycle top box and helmet compartment.
                </p>
                <button
                  onClick={() => {
                    setShowLostItemModal(false);
                    setLostItemTicket(null);
                    setLostItemDesc('');
                  }}
                  className="w-full py-2 bg-green-600 text-white font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportLostItem} className="space-y-3 text-xs">
                <p className="text-[11px] text-slate-500">
                  Leave a description of the forgotten belonging (e.g. gloves, phone, keys).
                </p>
                <textarea
                  rows={3}
                  required
                  value={lostItemDesc}
                  onChange={(e) => setLostItemDesc(e.target.value)}
                  placeholder="Describe item and where it might be (top box, jacket pocket)..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-[#16A34A]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
                >
                  Alert Driver Jordan
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
