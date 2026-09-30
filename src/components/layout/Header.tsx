import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  onToggleMobileMenu?: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 2,
  onToggleMobileMenu,
  activeTab,
  setActiveTab,
}) => {
  const { currentUser, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'BISE Sindh Prep';
      case 'study-material':
        return 'Study Material & Textbooks';
      case 'ai-assistant':
        return 'AI Academic Copilot';
      case 'quizzes-and-mcqs':
        return 'Topic Quizzes & Past MCQs';
      case 'mock-exam':
        return 'Board Examination Simulator';
      case 'progress-and-analytics':
        return 'Results & Analytical Progress';
      case 'settings':
        return 'Settings & Preferences';
      default:
        return 'BISE Sindh Prep';
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white border-b border-[#c3c6d7]/30 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left zone: mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-[#434655] hover:bg-[#eff4ff] hover:text-[#0b1c30]"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#434655]">
          <span className="text-[#0b1c30] font-semibold">Academic Space</span>
          <span className="text-[#737686]">/</span>
          <span className="text-[#2563eb] truncate max-w-[140px] sm:max-w-xs">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right zone: search, notifications, profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="relative flex items-center h-9 pl-8 pr-3 bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#c3c6d7]/50 rounded-lg text-xs text-[#737686] hover:text-[#0b1c30] transition-colors w-36 sm:w-56 text-left cursor-pointer group"
          title="Search syllabus, notes, topics (Ctrl + K)"
        >
          <span className="material-symbols-outlined absolute left-2 text-[18px] text-[#737686] group-hover:text-[#2563eb]">
            search
          </span>
          <span className="truncate">Search topics, notes...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-white border border-[#c3c6d7] px-1.5 py-0.5 rounded text-[#737686]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-[#434655] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg transition-colors"
          title="Academic Notifications"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563eb] rounded-full ring-2 ring-white"></span>
          )}
        </button>

        <div className="h-6 w-px bg-[#c3c6d7]/40 hidden sm:block"></div>

        {/* Student Profile dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 pl-1 pr-1 sm:pr-2 py-1 rounded-lg hover:bg-[#eff4ff] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[#c3c6d7]/40">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentUser?.fullName.charAt(0) || 'K'}</span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#0b1c30] leading-tight">
                {currentUser?.fullName || 'Khansa Tariq'}
              </span>
              <span className="text-[11px] text-[#434655] leading-tight">
                Class {currentUser?.targetClass === '10th' ? '10' : '9'} •{' '}
                {currentUser?.studyGroup === 'computer_science' ? 'CS' : 'Bio'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-[16px] hidden sm:inline-block">
              expand_more
            </span>
          </button>

          {profileDropdownOpen && (
            <div
              className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg border border-[#c3c6d7]/50 py-2 z-50 text-xs"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#c3c6d7]/30">
                <p className="font-semibold text-[#0b1c30]">{currentUser?.fullName}</p>
                <p className="text-[#737686] truncate text-[11px]">{currentUser?.email}</p>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="w-full px-3 py-2 text-left hover:bg-[#eff4ff] flex items-center gap-2 text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#737686]">
                  manage_accounts
                </span>
                <span>Profile & Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('progress-and-analytics')}
                className="w-full px-3 py-2 text-left hover:bg-[#eff4ff] flex items-center gap-2 text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#737686]">
                  analytics
                </span>
                <span>My Exam Analytics</span>
              </button>
              <div className="border-t border-[#c3c6d7]/30 my-1"></div>
              <button
                onClick={logout}
                className="w-full px-3 py-2 text-left hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
