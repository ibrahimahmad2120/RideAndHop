import React from 'react';
import { Bike, Navigation, MapPin, Flag } from 'lucide-react';
import { LocationItem } from '../../types';

interface StylizedMapProps {
  pickup?: LocationItem;
  destination?: LocationItem | null;
  riderPosition?: { x: number; y: number; angle?: number };
  showNearbyBikes?: boolean;
  showHeatmap?: boolean;
  onMapClick?: (x: number, y: number) => void;
  heightClass?: string;
  zoomLevel?: 'standard' | 'focused' | 'city';
}

const STATIC_NEARBY_BIKES = [
  { id: 'b1', x: 42, y: 38, deg: 45 },
  { id: 'b2', x: 62, y: 68, deg: 120 },
  { id: 'b3', x: 30, y: 60, deg: -30 },
  { id: 'b4', x: 78, y: 42, deg: 90 },
] as const;

export const StylizedMap: React.FC<StylizedMapProps> = React.memo(({
  pickup,
  destination,
  riderPosition,
  showNearbyBikes = true,
  showHeatmap = false,
  onMapClick,
  heightClass = 'h-64 sm:h-80',
}) => {
  // Default mock coordinates if none provided
  const pX = pickup ? pickup.x : 50;
  const pY = pickup ? pickup.y : 55;
  const dX = destination ? destination.x : 75;
  const dY = destination ? destination.y : 35;

  const handleSvgClick = React.useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!onMapClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onMapClick(x, y);
  }, [onMapClick]);

  return (
    <div className={`relative w-full ${heightClass} bg-[#F4F7F4] overflow-hidden select-none border-b border-[#E3EAE3]`}>
      <svg
        className="w-full h-full cursor-crosshair"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onClick={handleSvgClick}
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          <pattern id="cityGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8E0" strokeWidth="0.4" />
          </pattern>

          {/* Heatmap blur filter */}
          <radialGradient id="heatSurge" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(22, 163, 74, 0.35)" />
            <stop offset="60%" stopColor="rgba(234, 179, 8, 0.20)" />
            <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
          </radialGradient>
        </defs>

        {/* City Blocks Base */}
        <rect width="100" height="100" fill="#F3F7F3" />
        <rect width="100" height="100" fill="url(#cityGrid)" />

        {/* Parks / Green Spaces */}
        <rect x="5" y="8" width="18" height="22" rx="3" fill="#E2EFE2" />
        <rect x="70" y="65" width="22" height="25" rx="3" fill="#E2EFE2" />
        <rect x="42" y="12" width="14" height="12" rx="2" fill="#E2EFE2" />

        {/* River Irwell / Canal Curve */}
        <path
          d="M -5 30 Q 25 25, 45 45 T 70 85 T 105 95"
          fill="none"
          stroke="#D7E8F7"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Urban Road Network (Primary & Secondary Avenues) */}
        {/* Major Highways / Arterials */}
        <path d="M 0 50 Q 50 48, 100 52" stroke="#FFFFFF" strokeWidth="2.8" fill="none" />
        <path d="M 0 50 Q 50 48, 100 52" stroke="#D1DDD1" strokeWidth="0.6" fill="none" />

        <path d="M 50 0 Q 48 50, 52 100" stroke="#FFFFFF" strokeWidth="2.8" fill="none" />
        <path d="M 50 0 Q 48 50, 52 100" stroke="#D1DDD1" strokeWidth="0.6" fill="none" />

        {/* Diagonal Connectors */}
        <path d="M 10 90 L 90 10" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        <path d="M 10 90 L 90 10" stroke="#D1DDD1" strokeWidth="0.5" fill="none" />

        <path d="M 15 15 L 85 85" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        <path d="M 15 15 L 85 85" stroke="#D1DDD1" strokeWidth="0.5" fill="none" />

        {/* Secondary Cross Streets */}
        <line x1="0" y1="28" x2="100" y2="28" stroke="#FFFFFF" strokeWidth="1.4" />
        <line x1="0" y1="72" x2="100" y2="72" stroke="#FFFFFF" strokeWidth="1.4" />
        <line x1="28" y1="0" x2="28" y2="100" stroke="#FFFFFF" strokeWidth="1.4" />
        <line x1="72" y1="0" x2="72" y2="100" stroke="#FFFFFF" strokeWidth="1.4" />

        {/* Demand Surge Heatmap (Rider mode) */}
        {showHeatmap && (
          <>
            <circle cx="65" cy="42" r="18" fill="url(#heatSurge)" />
            <circle cx="35" cy="55" r="14" fill="url(#heatSurge)" />
            <circle cx="50" cy="30" r="12" fill="url(#heatSurge)" />
          </>
        )}

        {/* Route Line if destination exists */}
        {destination && (
          <>
            {/* Soft Route Shadow */}
            <path
              d={`M ${pX} ${pY} Q ${(pX + dX) / 2 + 6} ${(pY + dY) / 2 - 6}, ${dX} ${dY}`}
              fill="none"
              stroke="rgba(22, 163, 74, 0.25)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Active Route with Animated Dash */}
            <path
              d={`M ${pX} ${pY} Q ${(pX + dX) / 2 + 6} ${(pY + dY) / 2 - 6}, ${dX} ${dY}`}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="2.2"
              strokeDasharray="2 1.5"
              strokeLinecap="round"
              className="animate-pulse"
            />
          </>
        )}
      </svg>

      {/* Pickup Location Marker */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300"
        style={{ left: `${pX}%`, top: `${pY}%` }}
      >
        <div className="relative flex flex-col items-center">
          <div className="bg-[#16A34A] text-white p-1.5 rounded-full shadow-lg ring-4 ring-[#16A34A]/25 flex items-center justify-center animate-bounce">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="bg-white/95 backdrop-blur-xs text-[#17231B] text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs border border-[#E3EAE3] mt-1 whitespace-nowrap">
            Pickup
          </div>
        </div>
      </div>

      {/* Destination Location Marker */}
      {destination && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300"
          style={{ left: `${dX}%`, top: `${dY}%` }}
        >
          <div className="relative flex flex-col items-center">
            <div className="bg-[#17231B] text-white p-1.5 rounded-full shadow-lg ring-4 ring-black/10 flex items-center justify-center">
              <Flag className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white/95 backdrop-blur-xs text-[#17231B] text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs border border-[#E3EAE3] mt-1 whitespace-nowrap">
              Drop-off
            </div>
          </div>
        </div>
      )}

      {/* Assigned Rider Moving Marker */}
      {riderPosition && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 ease-out z-10"
          style={{ left: `${riderPosition.x}%`, top: `${riderPosition.y}%` }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg ring-4 ring-[#16A34A]/30">
              <Bike className="w-4 h-4 transform" style={{ transform: `rotate(${riderPosition.angle || 0}deg)` }} />
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#17231B] text-white text-[9px] font-medium px-1.5 py-0.2 rounded whitespace-nowrap">
              Jordan (MT-07)
            </div>
          </div>
        </div>
      )}

      {/* Nearby Idle Motorcycle Drivers on map */}
      {showNearbyBikes && !riderPosition && (
        <>
          {STATIC_NEARBY_BIKES.map((bike) => (
            <div
              key={bike.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-700"
              style={{ left: `${bike.x}%`, top: `${bike.y}%` }}
            >
              <div
                className="w-6 h-6 rounded-full bg-white text-[#16A34A] border border-[#16A34A]/40 shadow-xs flex items-center justify-center"
                style={{ transform: `rotate(${bike.deg}deg)` }}
              >
                <Bike className="w-3 h-3" />
              </div>
            </div>
          ))}
        </>
      )}

      {/* Map Floating Badges & Recenter Control */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#17231B] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#E3EAE3] shadow-xs flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
        <span>Manchester Central</span>
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <button
          type="button"
          aria-label="Recenter map"
          className="w-8 h-8 bg-white/95 backdrop-blur-xs text-[#17231B] rounded-full shadow-sm border border-[#E3EAE3] flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-[#16A34A]" />
        </button>
      </div>

      {showHeatmap && (
        <div className="absolute bottom-3 left-3 bg-[#17231B]/85 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>High Demand Zone (+1.3x)</span>
        </div>
      )}
    </div>
  );
});
