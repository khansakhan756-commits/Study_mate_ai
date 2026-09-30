import React, { useState } from 'react';
import { ActiveTab, TargetClass, StudyGroup } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen = false,
  setMobileOpen,
}) => {
  const { currentUser, logout, updateClassAndGroup } = useAuth();
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'study-material', label: 'Study Material', icon: 'menu_book' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: 'smart_toy' },
    { id: 'quizzes-and-mcqs', label: 'Quizzes & MCQs', icon: 'quiz' },
    { id: 'mock-exam', label: 'Mock Exam', icon: 'assignment' },
    { id: 'progress-and-analytics', label: 'Progress & Analytics', icon: 'insights' },
  ];

  const currentClassLabel = currentUser?.targetClass === '10th' ? 'Class 10' : 'Class 9';
  const currentGroupLabel =
    currentUser?.studyGroup === 'computer_science' ? 'Computer Science' : 'Biology';

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-[#c3c6d7]/30 z-50 flex flex-col justify-between transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo brand area */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#c3c6d7]/30">
            <button
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[19px]">school</span>
              </div>
              <span className="font-bold text-[17px] tracking-tight text-[#0b1c30]">
                StudyMate AI
              </span>
            </button>
            {setMobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden text-[#737686] hover:text-[#0b1c30] p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Class & Group Selector Card */}
          <div className="px-4 py-3 relative">
            <div
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="flex items-center justify-between px-3 py-2 bg-[#eff4ff] border border-[#c3c6d7]/40 rounded-lg cursor-pointer hover:bg-[#e5eeff] transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0"></span>
                <span className="text-xs text-[#0b1c30] font-semibold truncate">
                  {currentClassLabel} • {currentGroupLabel}
                </span>
              </div>
              <button
                type="button"
                className="text-[#434655] hover:text-[#0b1c30] flex items-center shrink-0 ml-1"
                aria-label="Change academic target"
              >
                <span className="material-symbols-outlined text-[16px]">unfold_more</span>
              </button>
            </div>

            {/* Quick Switch Dropdown */}
            {showClassDropdown && (
              <div className="absolute left-4 right-4 top-14 mt-1 bg-white border border-[#c3c6d7]/50 rounded-xl shadow-lg p-2.5 z-30 space-y-2">
                <div className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider px-1">
                  Change Syllabus Configuration
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      updateClassAndGroup('9th', currentUser?.studyGroup || 'biology');
                      setShowClassDropdown(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentUser?.targetClass === '9th'
                        ? 'bg-[#2563eb] text-white font-semibold'
                        : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                  >
                    Class 9th
                  </button>
                  <button
                    onClick={() => {
                      updateClassAndGroup('10th', currentUser?.studyGroup || 'biology');
                      setShowClassDropdown(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentUser?.targetClass === '10th'
                        ? 'bg-[#2563eb] text-white font-semibold'
                        : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                  >
                    Class 10th
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      updateClassAndGroup(currentUser?.targetClass || '9th', 'biology');
                      setShowClassDropdown(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentUser?.studyGroup === 'biology'
                        ? 'bg-[#005b7c] text-white font-semibold'
                        : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                  >
                    Biology
                  </button>
                  <button
                    onClick={() => {
                      updateClassAndGroup(currentUser?.targetClass || '9th', 'computer_science');
                      setShowClassDropdown(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentUser?.studyGroup === 'computer_science'
                        ? 'bg-[#005b7c] text-white font-semibold'
                        : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                  >
                    Comp. Science
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowClassDropdown(false);
                    handleSelect('settings');
                  }}
                  className="w-full text-center text-[11px] text-[#2563eb] hover:underline pt-1"
                >
                  Manage in Full Settings →
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                      : 'text-[#434655] hover:bg-[#dce9ff]/50 hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#c3c6d7]/30 space-y-1">
          <button
            onClick={() => handleSelect('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'settings'
                ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                : 'text-[#434655] hover:bg-[#dce9ff]/50 hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#93000a] transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
