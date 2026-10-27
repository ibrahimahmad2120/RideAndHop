import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Download,
  Calendar,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_RIDER_EARNINGS_DAYS } from '../../data/mockData';

export const RiderEarnings: React.FC = () => {
  const { riderEarningsToday, riderBalance, requestPayout } = useApp();
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>('50.00');
  const [payoutStatus, setPayoutStatus] = useState<{ text: string; error?: boolean } | null>(null);

  const weeklyTotal = 523.40;
  const ridesIncome = 328.00;
  const deliveryIncome = 195.40;
  const tipsTotal = 42.50;
  const bonusTotal = 30.00;
  const platformFee = -78.50;

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(payoutAmount);
    if (isNaN(parsed)) return;

    const res = requestPayout(parsed);
    if (res.success) {
      setPayoutStatus({ text: res.message, error: false });
      setTimeout(() => {
        setShowPayoutModal(false);
        setPayoutStatus(null);
      }, 2000);
    } else {
      setPayoutStatus({ text: res.message, error: true });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none p-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#17231B] tracking-tight">Earnings & Payouts</h2>
        <p className="text-xs text-[#68746B]">Fictional GBP mobility partner earnings</p>
      </div>

      {/* Available Balance Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#14532D] to-[#0A2614] text-white shadow-xl relative overflow-hidden mb-5">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] font-medium text-green-300">Withdrawable Balance</span>
            <div className="text-3xl font-extrabold tracking-tight mt-1">
              £{riderBalance.toFixed(2)}
            </div>
            <p className="text-[10px] text-green-200 mt-1">
              Today's Net Gain: +£{riderEarningsToday.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-green-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Cash Out
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-green-800/60 flex items-center justify-between text-[11px]">
          <span>Payout Method: Barclays Faster Payments</span>
          <span className="font-mono text-green-200">•••• 8109</span>
        </div>
      </div>

      {/* Daily Performance Bar Chart */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#17231B]">Weekly Breakdown</span>
          <span className="text-xs font-extrabold text-[#16A34A]">£{weeklyTotal.toFixed(2)}</span>
        </div>

        {/* SVG Mini Bar Chart */}
        <div className="h-32 flex items-end justify-between gap-2 pt-2 px-1">
          {MOCK_RIDER_EARNINGS_DAYS.map((d) => {
            const heightPct = Math.round((d.amount / 120) * 100);
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[9px] font-bold text-slate-500 tabular-nums">
                  £{Math.round(d.amount)}
                </span>
                <div
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] rounded-t-lg transition-all"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] font-semibold text-slate-400">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Income Breakdown */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3EAE3] shadow-xs space-y-2 mb-4 text-xs">
        <span className="font-bold text-[#17231B] block mb-1">Weekly Earnings Statement</span>

        <div className="flex justify-between text-slate-600">
          <span>Passenger Ride Fares (38 trips)</span>
          <span className="font-semibold text-slate-800">£{ridesIncome.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Parcel Deliveries (24 jobs)</span>
          <span className="font-semibold text-slate-800">£{deliveryIncome.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Customer Tips (100% to you)</span>
          <span className="font-semibold text-green-700">+£{tipsTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Peak Hour Performance Bonus</span>
          <span className="font-semibold text-green-700">+£{bonusTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Platform Service Fee (15%)</span>
          <span>-£{Math.abs(platformFee).toFixed(2)}</span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-[#17231B]">
          <span>Net Take-Home Earnings</span>
          <span className="text-[#16A34A]">£{weeklyTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payout Withdrawal Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#17231B]">Instant Bank Payout</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestWithdrawal} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Amount in GBP (£10 min, max £{riderBalance.toFixed(2)})
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 px-3 py-2 bg-slate-50">
                  <span className="text-sm font-bold text-slate-700 mr-1">£</span>
                  <input
                    type="number"
                    step="0.01"
                    min="10"
                    max={riderBalance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full text-sm font-extrabold text-[#17231B] outline-hidden bg-transparent"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-[11px] text-green-800">
                Transfers within 15 seconds to Barclays Business •••• 8109 via Faster Payments.
              </div>

              {payoutStatus && (
                <p className={`text-xs font-bold ${payoutStatus.error ? 'text-red-600' : 'text-green-700'}`}>
                  {payoutStatus.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
              >
                Confirm Payout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
