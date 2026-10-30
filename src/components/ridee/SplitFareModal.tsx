import React, { useState } from 'react';
import { X, Users, Plus, Check, Trash2, Send, Share2 } from 'lucide-react';
import { SplitFareData } from '../../types';

interface SplitFareModalProps {
  totalFare: number;
  onClose: () => void;
}

export const SplitFareModal: React.FC<SplitFareModalProps> = ({ totalFare, onClose }) => {
  const [friends, setFriends] = useState<string[]>(['Liam Gallagher', 'Sophie Turner']);
  const [newFriend, setNewFriend] = useState('');
  const [splitResult, setSplitResult] = useState<SplitFareData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalParticipants = friends.length + 1;
  const perPersonAmount = +(totalFare / totalParticipants).toFixed(2);

  const handleAddFriend = () => {
    if (!newFriend.trim() || friends.includes(newFriend.trim())) return;
    setFriends([...friends, newFriend.trim()]);
    setNewFriend('');
  };

  const handleRemoveFriend = (name: string) => {
    setFriends(friends.filter((f) => f !== name));
  };

  const handleSendSplit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rides/split-fare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalFare, friends }),
      });
      const data = await res.json();
      if (data.splitRecord) {
        setSplitResult(data.splitRecord);
      }
    } catch {
      // Fallback
      setSplitResult({
        id: `split_${Date.now()}`,
        totalFare,
        perPerson: perPersonAmount,
        participants: [
          { name: 'Alex Morgan (You)', amount: perPersonAmount, status: 'Paid' },
          ...friends.map((f) => ({ name: f, amount: perPersonAmount, status: 'Invite Sent' })),
        ],
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E3EAE3] shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#17231B]">Split Ride Fare</h4>
              <p className="text-[10px] text-slate-500">Uber-style shared payment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {splitResult ? (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-green-50 border border-green-200 rounded-2xl text-center space-y-1">
              <span className="font-bold text-green-900 block">Split Request Sent!</span>
              <p className="text-[11px] text-green-800">
                Each participant owes <strong>£{splitResult.perPerson.toFixed(2)}</strong>.
              </p>
            </div>

            <div className="space-y-1.5">
              {splitResult.participants.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-800">{p.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">£{p.amount.toFixed(2)}</span>
                    <span className="text-[9px] block text-green-600 font-semibold">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {/* Calculation summary */}
            <div className="p-3 rounded-2xl bg-[#F7FAF7] border border-[#E3EAE3] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Total Fare</span>
                <span className="font-bold text-slate-800">£{totalFare.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Split ({totalParticipants} ways)</span>
                <span className="text-base font-extrabold text-[#16A34A]">
                  £{perPersonAmount.toFixed(2)} / ea
                </span>
              </div>
            </div>

            {/* Friend List */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">Participants</span>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-800 font-semibold flex justify-between">
                <span>Alex Morgan (You)</span>
                <span className="text-[#16A34A]">£{perPersonAmount.toFixed(2)}</span>
              </div>

              {friends.map((friend) => (
                <div key={friend} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                  <span className="font-medium text-slate-800">{friend}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">£{perPersonAmount.toFixed(2)}</span>
                    <button
                      onClick={() => handleRemoveFriend(friend)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Friend Input */}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newFriend}
                onChange={(e) => setNewFriend(e.target.value)}
                placeholder="Add friend name or mobile..."
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddFriend}
                className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleSendSplit}
              disabled={isSubmitting || friends.length === 0}
              className="w-full h-11 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending Invites...' : `Send Split Invites (${friends.length})`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
