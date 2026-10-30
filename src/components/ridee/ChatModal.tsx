import React, { useState } from 'react';
import { X, Send, Bike, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatModalProps {
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
  const { chatMessages, sendChatMessage, riderProfile } = useApp();
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    "I'm at the main entrance waiting",
    'Wearing black jacket and blue jeans',
    'Do you have a size M helmet?',
    'Please keep package upright in top box',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendChatMessage(text);
    setInputText('');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#E3EAE3] flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={riderProfile.avatar}
              alt={riderProfile.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-2xl object-cover border border-green-500"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-[#17231B]">{riderProfile.name}</h3>
              <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.2 rounded-full">
                Rider
              </span>
            </div>
            <p className="text-[11px] text-[#68746B]">{riderProfile.bikeModel} · {riderProfile.registrationNumber}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Banner */}
      <div className="bg-[#E8F5E9] px-4 py-1.5 flex items-center justify-center gap-1.5 text-[11px] text-[#14532D]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
        <span>In-app phone numbers and messages are masked for your privacy.</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7FAF7]">
        {chatMessages.map((msg) => {
          const isMe = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="text-[10px] font-medium text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-[#16A34A] text-white rounded-br-xs'
                    : 'bg-white text-[#17231B] border border-[#E3EAE3] rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Replies Carousel */}
      <div className="p-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(reply)}
            className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-green-50 hover:text-green-800 text-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-200/80"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-[#E3EAE3] flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputText);
          }}
          placeholder="Message Jordan..."
          className="flex-1 text-xs p-2.5 rounded-2xl border border-slate-200 bg-slate-50 outline-hidden focus:border-[#16A34A]"
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#15803D] transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
