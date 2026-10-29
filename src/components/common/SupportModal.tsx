import React, { useState } from 'react';
import { X, Headphones, Send, ChevronDown, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SupportModalProps {
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  const { supportTickets, submitSupportTicket } = useApp();
  const [activeTab, setActiveTab] = useState<'faqs' | 'ticket' | 'history'>('faqs');
  const [category, setCategory] = useState('Ride Experience');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const faqs = [
    {
      q: 'Are motorcycle helmets always provided?',
      a: 'Yes! Every RideNHop partner carries a certified ECE 22.06 / BS 6658 motorcycle helmet with clean disposable hairnets for each passenger ride.',
    },
    {
      q: 'What is the maximum parcel weight for couriers?',
      a: 'RideNHop couriers operate street motorcycles and can safely carry up to 10kg packages in weather-sealed top boxes or specialized courier backpacks.',
    },
    {
      q: 'How does cancellation work?',
      a: 'Passengers can cancel free of charge before a rider arrives. Drivers can cancel if a passenger does not arrive within 5 minutes of arrival.',
    },
    {
      q: 'How do rider payouts work?',
      a: 'Rider earnings are credited immediately upon trip completion and can be withdrawn via Faster Payments directly to your UK bank account 24/7.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    const ticketId = submitSupportTicket(category, subject, message);
    setCreatedTicketId(ticketId);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E3EAE3] shadow-2xl p-4 sm:p-5 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#17231B]">RideNHop Support</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('faqs');
              setCreatedTicketId(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'faqs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'ticket' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            New Ticket
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Tickets ({supportTickets.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'faqs' && (
          <div className="space-y-2 text-xs">
            {faqs.map((faq, i) => (
              <details key={i} className="p-3 bg-[#F7FAF7] rounded-2xl border border-[#E3EAE3] group">
                <summary className="font-bold text-[#17231B] cursor-pointer list-none flex justify-between items-center">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-2 text-[11px] text-[#68746B] leading-relaxed border-t border-slate-200/60 pt-2">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        )}

        {activeTab === 'ticket' && (
          <div>
            {createdTicketId ? (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <h4 className="font-bold text-sm text-green-900">Ticket Submitted</h4>
                <p className="text-xs text-green-800">
                  Ticket Reference: <strong>{createdTicketId}</strong>. Our Manchester support team will review within 15 minutes.
                </p>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-xs hover:bg-green-700"
                >
                  View My Tickets
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#17231B] block mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Ride Experience">Ride Experience</option>
                    <option value="Parcel Delivery Issue">Parcel Delivery Issue</option>
                    <option value="Payment or Fare Dispute">Payment or Fare Dispute</option>
                    <option value="Safety or Driver Behaviour">Safety or Driver Behaviour</option>
                    <option value="Vehicle Documents">Vehicle Documents</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#17231B] block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of query..."
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#17231B] block mb-1">Message Details</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain what happened..."
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-2 text-xs">
            {supportTickets.map((t) => (
              <div key={t.id} className="p-3 bg-white rounded-2xl border border-[#E3EAE3] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[10px] text-slate-500">{t.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      t.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h4 className="font-bold text-[#17231B]">{t.subject}</h4>
                <p className="text-[11px] text-slate-500">{t.message}</p>
                <span className="text-[9px] text-slate-400 block pt-1">{t.date} · {t.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
