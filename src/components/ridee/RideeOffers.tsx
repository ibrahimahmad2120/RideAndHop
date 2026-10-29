import React, { useState } from 'react';
import { Tag, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_OFFERS } from '../../data/mockData';

export const RideeOffers: React.FC = () => {
  const { applyPromoCode, appliedPromo } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [testInput, setTestInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyPromoCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleManualApply = () => {
    if (!testInput.trim()) return;
    const res = applyPromoCode(testInput);
    setStatusMsg({ text: res.message, error: !res.success });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none p-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#17231B] tracking-tight">Promotions & Vouchers</h2>
        <p className="text-xs text-[#68746B]">Exclusive discounts on city rides & courier delivery</p>
      </div>

      {/* Manual Code Input Bar */}
      <div className="p-3.5 bg-white rounded-2xl border border-[#E3EAE3] shadow-xs mb-4">
        <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Have a Promo Code?</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="e.g. RIDENHOP50"
            className="flex-1 text-xs font-semibold uppercase p-2 rounded-xl border border-slate-200 outline-hidden focus:border-[#16A34A]"
          />
          <button
            onClick={handleManualApply}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Apply
          </button>
        </div>
        {statusMsg && (
          <p className={`text-[11px] font-semibold mt-1.5 ${statusMsg.error ? 'text-red-600' : 'text-green-700'}`}>
            {statusMsg.text}
          </p>
        )}
      </div>

      {/* Offers Cards List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {MOCK_OFFERS.map((offer) => {
          const isApplied = appliedPromo?.code === offer.code;

          return (
            <div
              key={offer.id}
              className={`p-4 rounded-3xl border-2 transition-all bg-white relative overflow-hidden ${
                isApplied ? 'border-[#16A34A] shadow-md ring-2 ring-[#16A34A]/20' : 'border-[#E3EAE3]'
              }`}
            >
              {/* Top Accent Ribbon */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-green-100 text-[#16A34A] flex items-center justify-center font-bold">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {offer.code}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2 capitalize">· For {offer.applicableTo}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    isApplied
                      ? 'bg-[#16A34A] text-white'
                      : copiedCode === offer.code
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </>
                  ) : copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Offer Details */}
              <div className="mt-3">
                <h4 className="text-sm font-bold text-[#17231B]">{offer.discountTitle}</h4>
                <p className="text-[11px] text-[#68746B] mt-1">{offer.terms}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Expires {offer.expiry}</span>
                </span>
                <span>Min spend £{offer.minSpend.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
