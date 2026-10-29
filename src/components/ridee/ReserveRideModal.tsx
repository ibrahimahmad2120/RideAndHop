import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bike, CheckCircle2, ShieldCheck, ArrowRight, Trash2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReservationItem } from '../../types';
import { MOCK_LOCATIONS } from '../../data/mockData';

interface ReserveRideModalProps {
  onClose: () => void;
}

export const ReserveRideModal: React.FC<ReserveRideModalProps> = ({ onClose }) => {
  const { pickupLocation } = useApp();
  const [activeTab, setActiveTab] = useState<'new' | 'scheduled'>('new');
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [pickup, setPickup] = useState(pickupLocation.name);
  const [destination, setDestination] = useState(MOCK_LOCATIONS[1].name);
  const [date, setDate] = useState('Tomorrow, 08:30 AM');
  const [rideType, setRideType] = useState('Standard Bike');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch reservations from backend
  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reserve');
      const data = await res.json();
      if (data.reservations) {
        setReservations(data.reservations);
      }
    } catch (err) {
      console.warn('Error fetching reservations:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupName: pickup,
          destinationName: destination,
          date,
          rideType,
          estimatedFare: rideType === 'Comfort Cruiser' ? 12.50 : 8.90,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Ride reserved with on-time driver guarantee!');
        await fetchReservations();
        setTimeout(() => {
          setActiveTab('scheduled');
          setSuccessMessage(null);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      await fetch(`/api/reserve/${id}`, { method: 'DELETE' });
      await fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E3EAE3] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-green-100 text-[#16A34A] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#17231B]">RideNHop Reserve</h3>
              <p className="text-[11px] text-[#68746B]">Uber Reserve-style scheduled trips</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Schedule New
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'scheduled' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            My Reserves ({reservations.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'new' ? (
            <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
              {/* Guarantee Banner */}
              <div className="p-3 rounded-2xl bg-[#E8F5E9] border border-green-200 text-[#14532D] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  <span>On-Time Arrival Guarantee</span>
                </div>
                <p className="text-[10px] text-green-800 leading-relaxed">
                  Reserve up to 30 days ahead. Locked upfront pricing and your driver arrives 5 mins before departure.
                </p>
              </div>

              <div>
                <label className="font-bold text-[#17231B] block mb-1">Pickup Spot</label>
                <input
                  type="text"
                  required
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#17231B] block mb-1">Destination</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#17231B] block mb-1">Date & Time</label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Tomorrow, 07:30 AM">Tomorrow, 07:30 AM</option>
                    <option value="Tomorrow, 08:45 AM">Tomorrow, 08:45 AM</option>
                    <option value="Tomorrow, 05:15 PM">Tomorrow, 05:15 PM</option>
                    <option value="Friday, 08:00 AM">Friday, 08:00 AM</option>
                    <option value="Saturday, 10:00 AM">Saturday, 10:00 AM</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#17231B] block mb-1">Motorcycle</label>
                  <select
                    value={rideType}
                    onChange={(e) => setRideType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Standard Bike">Standard Bike (£8.90)</option>
                    <option value="Comfort Cruiser">Comfort Cruiser (£12.50)</option>
                    <option value="Express Speed-Pass">Express (£14.80)</option>
                  </select>
                </div>
              </div>

              {successMessage && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-center font-bold text-[11px]">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Reserving...' : 'Confirm Reserve Booking'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Scheduled List */
            <div className="space-y-3">
              {reservations.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No upcoming reserved rides. Schedule one to lock in early pickup.
                </div>
              ) : (
                reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[10px]">
                        {res.status}
                      </span>
                      <span className="font-extrabold text-[#17231B]">
                        £{res.estimatedFare.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#17231B]">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{res.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate">From: {res.pickupName}</p>
                      <p className="text-[11px] text-slate-600 truncate">To: {res.destinationName}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{res.assignedDriver}</span>
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
