import React, { useState } from 'react';
import { Bike, Package, DollarSign, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding, switchRole } = useApp();
  const [step, setStep] = useState<'splash' | 'slides' | 'role_select' | 'phone_otp' | 'permissions'>('splash');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ridee');
  const [phone, setPhone] = useState('7911 123456');
  const [otp, setOtp] = useState(['8', '2', '9', '1']);

  // Auto transition from splash to slides after 1.8s
  React.useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('slides');
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const slides = [
    {
      title: 'Book a Bike in Minutes',
      subtitle: 'Beat city traffic on high-efficiency motorcycles. Fast, affordable, and vetted pro riders.',
      icon: Bike,
      accent: '#16A34A',
    },
    {
      title: 'Send Parcels Rapidly',
      subtitle: 'Documents, food, keys, or urgent parcels dispatched directly across town in minutes.',
      icon: Package,
      accent: '#D97706',
    },
    {
      title: 'Earn On Your Own Terms',
      subtitle: 'Take on passenger rides or parcel drops. Instant daily & weekly payouts to your bank.',
      icon: DollarSign,
      accent: '#2563EB',
    },
  ];

  if (step === 'splash') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#14532D] to-[#0A2614] text-white select-none animate-in fade-in duration-500">
        <div className="relative flex flex-col items-center">
          {/* Animated Glow & Logo */}
          <div className="w-24 h-24 rounded-3xl bg-[#16A34A] flex items-center justify-center shadow-2xl ring-8 ring-green-500/20 animate-pulse">
            <Bike className="w-12 h-12 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight">NextRide</h1>
          <p className="mt-2 text-xs font-medium text-green-200 tracking-wide text-center">
            Your city. Your ride. Your delivery.
          </p>

          <div className="mt-12 flex items-center gap-1.5 text-[11px] text-green-300/70">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            <span>Manchester Urban Core · Ready</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'slides') {
    const slide = slides[currentSlide];
    const IconComponent = slide.icon;

    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7FAF7] select-none">
        {/* Skip button */}
        <div className="flex justify-end">
          <button
            onClick={() => setStep('role_select')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 px-3 rounded-lg"
          >
            Skip
          </button>
        </div>

        {/* Slide Visual & Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg mb-8 transition-transform hover:scale-105"
            style={{ backgroundColor: slide.accent }}
          >
            <IconComponent className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-[#17231B] tracking-tight mb-3">
            {slide.title}
          </h2>
          <p className="text-sm text-[#68746B] max-w-xs leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-8">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-[#16A34A]' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div>
          <button
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide((prev) => prev + 1);
              } else {
                setStep('role_select');
              }
            }}
            className="w-full h-13 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all"
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'role_select') {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7FAF7] select-none">
        <div>
          <div className="w-10 h-10 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-[#17231B] tracking-tight">
            How will you use NextRide?
          </h2>
          <p className="text-xs text-[#68746B] mt-1">
            Choose your initial mode. You can toggle between roles at any time.
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4 my-6">
          <div
            onClick={() => setSelectedRole('ridee')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedRole === 'ridee'
                ? 'border-[#16A34A] bg-white shadow-md ring-2 ring-[#16A34A]/20'
                : 'border-[#E3EAE3] bg-white/70 hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17231B]">Passenger & Sender</h3>
                  <p className="text-xs text-[#68746B]">Continue as Ridee</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'ridee' ? 'border-[#16A34A] bg-[#16A34A]' : 'border-slate-300'
                }`}
              >
                {selectedRole === 'ridee' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>
            <p className="mt-3 text-xs text-[#68746B] leading-relaxed">
              Book fast motorcycle commutes through traffic or dispatch urgent parcels across Greater Manchester.
            </p>
          </div>

          <div
            onClick={() => setSelectedRole('rider')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedRole === 'rider'
                ? 'border-[#16A34A] bg-white shadow-md ring-2 ring-[#16A34A]/20'
                : 'border-[#E3EAE3] bg-white/70 hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17231B]">Driver & Courier</h3>
                  <p className="text-xs text-[#68746B]">Continue as Rider</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'rider' ? 'border-[#16A34A] bg-[#16A34A]' : 'border-slate-300'
                }`}
              >
                {selectedRole === 'rider' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>
            <p className="mt-3 text-xs text-[#68746B] leading-relaxed">
              Earn competitive payouts accepting passenger trips and on-demand parcel deliveries on your motorbike.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep('phone_otp')}
          className="w-full h-13 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (step === 'phone_otp') {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7FAF7] select-none">
        <div>
          <h2 className="text-2xl font-bold text-[#17231B] tracking-tight">
            Verify Phone Number
          </h2>
          <p className="text-xs text-[#68746B] mt-1">
            We will send a 4-digit demo verification code via SMS.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#17231B] block mb-1">
                UK Mobile Number
              </label>
              <div className="flex items-center rounded-2xl border border-[#E3EAE3] bg-white px-3 py-2.5">
                <span className="text-xs font-bold text-slate-700 mr-2 border-r border-slate-200 pr-2">
                  🇬🇧 +44
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-medium text-[#17231B] outline-hidden bg-transparent"
                  placeholder="7123 456789"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#17231B] block mb-1">
                Enter 4-Digit Code (Demo prefilled: 8291)
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-13 h-13 text-center text-lg font-bold rounded-2xl border border-[#E3EAE3] bg-white text-[#17231B] focus:border-[#16A34A] outline-hidden shadow-xs"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <button
            onClick={() => setStep('permissions')}
            className="w-full h-13 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all"
          >
            <span>Verify & Continue</span>
          </button>

          <button
            onClick={() => {
              switchRole(selectedRole);
              completeOnboarding();
            }}
            className="w-full py-2.5 text-xs font-semibold text-[#68746B] hover:text-[#17231B] text-center"
          >
            Skip demo verification
          </button>
        </div>
      </div>
    );
  }

  // Permissions Screen
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F7FAF7] select-none">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#16A34A] flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-[#17231B] tracking-tight">
          Permissions & Safety
        </h2>
        <p className="text-xs text-[#68746B] mt-1">
          To connect you seamlessly with nearby motorcycle riders and deliver real-time trip status.
        </p>

        <div className="space-y-4 mt-6">
          <div className="p-4 rounded-2xl bg-white border border-[#E3EAE3] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
              📍
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#17231B]">Precise Urban Location</h4>
              <p className="text-[11px] text-[#68746B] mt-0.5">
                Allows riders to pinpoint your exact pickup spot and calculate optimal lane-split routing.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E3EAE3] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
              🔔
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#17231B]">Trip & Delivery Alerts</h4>
              <p className="text-[11px] text-[#68746B] mt-0.5">
                Instant push alerts when your rider arrives, starts the engine, or delivers your parcel.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          switchRole(selectedRole);
          completeOnboarding();
        }}
        className="w-full h-13 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all"
      >
        <span>Allow & Enter NextRide</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
