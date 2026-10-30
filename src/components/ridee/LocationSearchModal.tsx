import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Clock, Bookmark, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_LOCATIONS } from '../../data/mockData';
import { LocationItem } from '../../types';

interface LocationSearchModalProps {
  onClose: () => void;
  onSelectDestination: (loc: LocationItem) => void;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  onClose,
  onSelectDestination,
}) => {
  const { pickupLocation, setPickupLocation } = useApp();
  const [pickupText, setPickupText] = useState(pickupLocation.name);
  const [destText, setDestText] = useState('');
  const [stopText, setStopText] = useState('');
  const [hasIntermediateStop, setHasIntermediateStop] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'stop' | 'dest'>('dest');
  const [multiStopSummary, setMultiStopSummary] = useState<{ fare: number; minutes: number } | null>(null);

  const getCurrentSearchText = () => {
    if (activeInput === 'dest') return destText;
    if (activeInput === 'stop') return stopText;
    return pickupText;
  };

  const currentText = getCurrentSearchText();

  const filteredLocations = useMemo(() => {
    const query = currentText.toLowerCase().trim();
    if (!query) return MOCK_LOCATIONS;
    return MOCK_LOCATIONS.filter((loc) =>
      loc.name.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query)
    );
  }, [currentText]);

  const handleSelect = async (loc: LocationItem) => {
    if (activeInput === 'pickup') {
      setPickupLocation(loc);
      setPickupText(loc.name);
      setActiveInput(hasIntermediateStop ? 'stop' : 'dest');
    } else if (activeInput === 'stop') {
      setStopText(loc.name);
      setActiveInput('dest');
      // Calculate multi-stop fare via backend
      try {
        const res = await fetch('/api/rides/calculate-multistop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stops: [pickupLocation.name, loc.name, destText || 'Destination'] }),
        });
        const data = await res.json();
        setMultiStopSummary({ fare: data.fare, minutes: data.estimatedDurationMinutes });
      } catch {
        setMultiStopSummary({ fare: 7.80, minutes: 16 });
      }
    } else {
      onSelectDestination(loc);
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-200">
      {/* Top Search Bar Header */}
      <div className="p-4 border-b border-[#E3EAE3] bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-[#17231B]">
            {activeInput === 'dest'
              ? 'Where are you heading?'
              : activeInput === 'stop'
              ? 'Add an Intermediate Stop'
              : 'Set Pickup Spot'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pickup, Stop & Drop-off Inputs with Route Line */}
        <div className="relative pl-6 space-y-2">
          {/* Connector Graphic */}
          <div className="absolute left-2 top-3 bottom-3 flex flex-col items-center justify-between">
            <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <div className="w-0.5 flex-1 bg-slate-300 my-1 border-dashed" />
            {hasIntermediateStop && (
              <>
                <div className="w-2 h-2 rounded-full bg-blue-500 my-0.5" />
                <div className="w-0.5 flex-1 bg-slate-300 my-1 border-dashed" />
              </>
            )}
            <div className="w-2.5 h-2.5 rounded-xs bg-[#17231B]" />
          </div>

          {/* Pickup Field */}
          <div
            onClick={() => setActiveInput('pickup')}
            className={`flex items-center rounded-xl px-3 py-2 border transition-all ${
              activeInput === 'pickup'
                ? 'border-[#16A34A] bg-[#F7FAF7] ring-1 ring-[#16A34A]'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <input
              type="text"
              value={pickupText}
              onChange={(e) => setPickupText(e.target.value)}
              placeholder="Enter pickup address"
              className="w-full text-xs font-semibold text-[#17231B] bg-transparent outline-hidden"
            />
          </div>

          {/* Optional Intermediate Stop (Uber Feature) */}
          {hasIntermediateStop && (
            <div
              onClick={() => setActiveInput('stop')}
              className={`flex items-center justify-between rounded-xl px-3 py-2 border transition-all ${
                activeInput === 'stop'
                  ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <input
                type="text"
                value={stopText}
                onChange={(e) => setStopText(e.target.value)}
                placeholder="Add stop (e.g. Manchester Arndale)..."
                className="w-full text-xs font-semibold text-[#17231B] bg-transparent outline-hidden"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasIntermediateStop(false);
                  setStopText('');
                  setMultiStopSummary(null);
                  setActiveInput('dest');
                }}
                className="text-slate-400 hover:text-red-500 ml-1 p-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Destination Field */}
          <div
            onClick={() => setActiveInput('dest')}
            className={`flex items-center rounded-xl px-3 py-2 border transition-all ${
              activeInput === 'dest'
                ? 'border-[#16A34A] bg-[#F7FAF7] ring-1 ring-[#16A34A]'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <input
              type="text"
              value={destText}
              onChange={(e) => setDestText(e.target.value)}
              placeholder="Search destination in Manchester..."
              autoFocus={!hasIntermediateStop}
              className="w-full text-xs font-semibold text-[#17231B] bg-transparent outline-hidden"
            />
            {destText && (
              <button onClick={() => setDestText('')} className="p-1 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Uber "Add a Stop" Toggle */}
        {!hasIntermediateStop && (
          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={() => {
                setHasIntermediateStop(true);
                setActiveInput('stop');
              }}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add a stop along route (Uber feature)</span>
            </button>
          </div>
        )}

        {/* Multi-stop backend calculation card */}
        {multiStopSummary && (
          <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between">
            <span className="text-blue-900 font-medium">
              Multi-stop route: ~{multiStopSummary.minutes} mins
            </span>
            <span className="font-extrabold text-blue-950">
              Est. £{multiStopSummary.fare.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {activeInput === 'dest'
            ? 'Popular & Saved Places'
            : activeInput === 'stop'
            ? 'Popular Midway Stops'
            : 'Nearby Pickup Locations'}
        </span>

        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => handleSelect(loc)}
            className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-green-300 hover:bg-green-50/50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  loc.category === 'saved'
                    ? 'bg-amber-100 text-amber-700'
                    : loc.category === 'recent'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {loc.category === 'saved' ? (
                  <Bookmark className="w-4 h-4" />
                ) : loc.category === 'recent' ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#17231B]">{loc.name}</h4>
                <p className="text-[11px] text-[#68746B] line-clamp-1">{loc.address}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
