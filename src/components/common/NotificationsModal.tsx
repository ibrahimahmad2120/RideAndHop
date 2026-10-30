import React from 'react';
import { X, Bell, CheckCheck, Tag, Bike, ShieldCheck, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return <Bike className="w-4 h-4 text-green-600" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-purple-600" />;
      case 'earnings':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'safety':
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E3EAE3] shadow-2xl p-4 sm:p-5 flex flex-col space-y-4 max-h-[85vh]">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#16A34A]" />
            <h3 className="font-bold text-sm text-[#17231B]">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] font-semibold text-[#16A34A] hover:underline"
            >
              Mark read
            </button>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  !notif.isRead
                    ? 'bg-green-50/50 border-green-200'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#17231B]">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-[#68746B] mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
