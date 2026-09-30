import React from 'react';
import { NotificationItem } from '../../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-4 sm:right-16 top-16 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#c3c6d7]/50 p-4 z-50 animate-in fade-in duration-100">
        <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/30">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[#0b1c30]">Notifications</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#dbe1ff] text-[#004ac6] font-semibold">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </div>
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] text-[#2563eb] hover:underline font-medium"
          >
            Mark all read
          </button>
        </div>

        <div className="divide-y divide-[#c3c6d7]/20 max-h-72 overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`py-3 flex items-start gap-3 ${!item.isRead ? 'bg-[#f8f9ff]' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'exam'
                    ? 'bg-[#dbe1ff] text-[#2563eb]'
                    : item.type === 'academic'
                    ? 'bg-[#c4e7ff] text-[#005b7c]'
                    : 'bg-[#dae2fd] text-[#565e74]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.type === 'exam' ? 'grade' : item.type === 'academic' ? 'menu_book' : 'info'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0b1c30] leading-snug">{item.title}</p>
                <p className="text-[11px] text-[#434655] mt-0.5 leading-normal">{item.description}</p>
                <span className="text-[10px] text-[#737686] mt-1 block">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
