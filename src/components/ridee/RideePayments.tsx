import React, { useState } from 'react';
import { Wallet, Plus, CreditCard, Check, ShieldCheck, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RideePayments: React.FC = () => {
  const { walletBalance, topUpWallet, paymentMethods, selectedPaymentMethod, setSelectedPaymentMethod } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(20);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardLast4, setCardLast4] = useState('9912');

  const transactions = [
    { id: 'tx_1', desc: 'Standard Bike Trip NR-8821', date: 'Today, 11:45', amount: -5.20, type: 'ride' },
    { id: 'tx_2', desc: 'Wallet Top-Up (Monzo)', date: 'Yesterday, 14:10', amount: +25.00, type: 'topup' },
    { id: 'tx_3', desc: 'Express Courier PD-4091', date: '23 Oct', amount: -8.90, type: 'delivery' },
  ];

  const handleTopUpConfirm = () => {
    topUpWallet(topUpAmount);
    setShowTopUp(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7FAF7] select-none p-4 pb-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#17231B] tracking-tight">Payments & Wallet</h2>
        <p className="text-xs text-[#68746B]">Manage your payment balance and cards</p>
      </div>

      {/* Wallet Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#14532D] to-[#0A2614] text-white shadow-xl relative overflow-hidden mb-5">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] font-medium text-green-300">NextRide Cash Wallet</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              £{walletBalance.toFixed(2)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-3 border-t border-green-800/60">
          <span className="text-[10px] text-green-200">1-Tap Instant Checkout</span>
          <button
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-green-950 font-bold rounded-xl text-xs hover:bg-green-50 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* Saved Payment Methods */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#17231B]">Saved Payment Methods</span>
          <button
            onClick={() => setShowAddCard(true)}
            className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="space-y-2">
          {paymentMethods.map((pm) => {
            const isSelected = selectedPaymentMethod.id === pm.id;

            return (
              <div
                key={pm.id}
                onClick={() => setSelectedPaymentMethod(pm)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between bg-white ${
                  isSelected ? 'border-[#16A34A] ring-1 ring-[#16A34A]/20 shadow-xs' : 'border-[#E3EAE3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#17231B]">{pm.name}</h4>
                    <p className="text-[11px] text-slate-500">{pm.detail}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#16A34A] bg-[#16A34A]' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        <span className="text-xs font-bold text-[#17231B] block">Recent Wallet Activity</span>
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="p-3 rounded-2xl bg-white border border-[#E3EAE3] flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  tx.amount > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tx.amount > 0 ? (
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-[#17231B]">{tx.desc}</p>
                <span className="text-[10px] text-slate-400">{tx.date}</span>
              </div>
            </div>
            <span
              className={`font-bold ${
                tx.amount > 0 ? 'text-green-600' : 'text-[#17231B]'
              }`}
            >
              {tx.amount > 0 ? `+£${tx.amount.toFixed(2)}` : `-£${Math.abs(tx.amount).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#17231B]">Top Up Wallet</h3>
              <button onClick={() => setShowTopUp(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-3 rounded-2xl font-bold text-xs border transition-all ${
                    topUpAmount === amt
                      ? 'border-[#16A34A] bg-green-50 text-green-800'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  +£{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleTopUpConfirm}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl text-xs shadow-md"
            >
              Confirm +£{topUpAmount}.00 Top-Up
            </button>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#17231B]">Add Demo Card</h3>
              <button onClick={() => setShowAddCard(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Enter demo 4-digit last digits. No real card credentials required.
            </p>
            <input
              type="text"
              maxLength={4}
              value={cardLast4}
              onChange={(e) => setCardLast4(e.target.value)}
              placeholder="e.g. 5521"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-center font-mono font-bold text-sm"
            />
            <button
              onClick={() => {
                setShowAddCard(false);
                alert(`Added demo card ending in •••• ${cardLast4}`);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Save Demo Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
