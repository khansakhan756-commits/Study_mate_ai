import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab, Subject } from '../../types';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  subjects: Subject[];
  onSelectChapterToRead: (subjectId: string, chapterId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onSelectChapterToRead,
}) => {
  const { currentUser } = useAuth();

  const studentName = currentUser?.fullName?.split(' ')[0] || 'Khansa';
  const classLabel = currentUser?.targetClass === '10th' ? 'Class 10' : 'Class 9';
  const groupLabel =
    currentUser?.studyGroup === 'computer_science' ? 'Computer Science Group' : 'Biology Group';

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Context & Salutation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-[#004ac6] font-semibold tracking-wider uppercase mb-1">
            Student Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0b1c30] tracking-tight">
            Welcome back, {studentName}
          </h1>
          <p className="text-sm text-[#565e74] mt-1">Academic Year 2024–2025</p>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eff4ff] shadow-xs border border-[#c3c6d7]/30">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
            <span className="text-xs font-semibold text-[#004ac6]">
              {classLabel} • {groupLabel} • BISE Sindh
            </span>
          </div>
        </div>
      </div>

      {/* 1. Continue Learning Spotlight Card */}
      <div className="bg-white rounded-xl p-6 sm:p-7 shadow-xs border border-[#c3c6d7]/30 relative overflow-hidden transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-[#dbe1ff] text-[#003ea8] text-[11px] uppercase tracking-wider font-bold">
                Resume Studying
              </span>
              <span className="text-xs text-[#565e74]">Last accessed 2 hours ago</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight truncate">
              Physics — Chapter 2: Kinematics
            </h2>
            <p className="text-xs sm:text-sm text-[#434655] mt-1">
              Section 2.4: Equations of Motion under Uniform Acceleration
            </p>
            <div className="mt-4 max-w-xl">
              <div className="flex items-center justify-between text-xs text-[#434655] mb-1.5 font-medium">
                <span>Chapter Progress</span>
                <span className="font-semibold text-[#0b1c30]">72% Completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#2563eb] transition-all duration-500"
                  style={{ width: '72%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-center shrink-0">
            <button
              onClick={() => onSelectChapterToRead('phy-9', 'phy-9-ch2')}
              className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#004ac6] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Continue Reading</span>
            </button>
            <button
              onClick={() => setActiveTab('quizzes-and-mcqs')}
              className="inline-flex items-center justify-center gap-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] border border-[#c3c6d7]/40 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
              <span>Practice Chapter MCQs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Access Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#0b1c30]">Quick Access</h3>
          <span className="text-xs text-[#565e74]">Board Standard Study Modules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Study Material */}
          <div
            onClick={() => setActiveTab('study-material')}
            className="group bg-white hover:bg-[#f8f9ff] rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eff4ff] group-hover:bg-[#dbe1ff] flex items-center justify-center text-[#2563eb] transition-colors mb-3">
                <span className="material-symbols-outlined text-[22px]">menu_book</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors">
                Study Material
              </h4>
              <p className="text-xs text-[#434655] mt-1">Textbooks and verified chapter notes</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-[#004ac6] font-semibold">
              <span>Explore Notes</span>
              <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 2: AI Assistant */}
          <div
            onClick={() => setActiveTab('ai-assistant')}
            className="group bg-white hover:bg-[#f8f9ff] rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eff4ff] group-hover:bg-[#dbe1ff] flex items-center justify-center text-[#2563eb] transition-colors mb-3">
                <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors">
                AI Assistant
              </h4>
              <p className="text-xs text-[#434655] mt-1">Ask doubts and get syllabus-aligned explanations</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-[#004ac6] font-semibold">
              <span>Open AI Chat</span>
              <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 3: Quizzes & MCQs */}
          <div
            onClick={() => setActiveTab('quizzes-and-mcqs')}
            className="group bg-white hover:bg-[#f8f9ff] rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eff4ff] group-hover:bg-[#dbe1ff] flex items-center justify-center text-[#2563eb] transition-colors mb-3">
                <span className="material-symbols-outlined text-[22px]">quiz</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors">
                Quizzes & MCQs
              </h4>
              <p className="text-xs text-[#434655] mt-1">Practice topic-wise past paper questions</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-[#004ac6] font-semibold">
              <span>Start Practice</span>
              <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Card 4: Mock Exam */}
          <div
            onClick={() => setActiveTab('mock-exam')}
            className="group bg-white hover:bg-[#f8f9ff] rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 transition-all duration-150 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#eff4ff] group-hover:bg-[#dbe1ff] flex items-center justify-center text-[#2563eb] transition-colors mb-3">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#004ac6] transition-colors">
                Mock Exam
              </h4>
              <p className="text-xs text-[#434655] mt-1">Timed 50-MCQ board examination simulator</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-[#004ac6] font-semibold">
              <span>Launch Exam</span>
              <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Summary Metrics / Progress Card */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#c3c6d7]/20">
          <h3 className="text-base font-bold text-[#0b1c30]">Curriculum Preparation Progress</h3>
          <span className="text-xs text-[#434655] font-medium">{classLabel} Academic Target</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric 1: Overall Progress */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#eff4ff]">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="stroke-[#dce9ff]"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="20"
                  strokeWidth="4.5"
                ></circle>
                <circle
                  className="stroke-[#2563eb]"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="20"
                  strokeDasharray="125.6"
                  strokeDashoffset="40.19"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                ></circle>
              </svg>
              <span className="absolute text-xs font-bold text-[#0b1c30]">68%</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#565e74]">Overall Progress</span>
              <span className="text-base font-bold text-[#0b1c30]">68% Syllabus</span>
              <span className="text-[11px] text-[#004ac6] font-semibold mt-0.5">
                On track for board exams
              </span>
            </div>
          </div>

          {/* Metric 2: Completed Chapters */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#eff4ff]">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[26px]">task_alt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#565e74]">Completed Chapters</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-[#0b1c30]">24</span>
                <span className="text-xs text-[#565e74]">/ 36 chapters</span>
              </div>
              <span className="text-[11px] text-[#565e74] mt-0.5">12 remaining chapters</span>
            </div>
          </div>

          {/* Metric 3: Average Quiz Score */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#eff4ff]">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#004ac6]">
              <span className="material-symbols-outlined text-[26px]">trending_up</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#565e74]">Average Quiz Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-[#0b1c30]">82%</span>
                <span className="text-xs text-[#565e74]">accuracy</span>
              </div>
              <span className="text-[11px] text-[#004ac6] font-semibold mt-0.5">
                Top 15% in cohort
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity & Sync Feed */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#c3c6d7]/30">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#c3c6d7]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#565e74] text-[20px]">history</span>
            <h3 className="text-base font-bold text-[#0b1c30]">Recent Activity</h3>
          </div>
          <span className="text-xs text-[#565e74]">Last 48 Hours</span>
        </div>

        <div className="space-y-3">
          {/* Event 1 */}
          <div className="flex items-start justify-between p-3 rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors border border-[#c3c6d7]/20">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#2563eb] mt-1.5 shrink-0"></span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                  Physics • Chapter 2 reading session bookmarked
                </span>
                <span className="text-[11px] text-[#565e74]">
                  Section: Uniform acceleration and kinematics equations
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#565e74] whitespace-nowrap pl-2">2 hours ago</span>
          </div>

          {/* Event 2 */}
          <div className="flex items-start justify-between p-3 rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] transition-colors border border-[#c3c6d7]/20">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#2563eb] mt-1.5 shrink-0"></span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                    Chemistry • Chapter 1 Quiz completed
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#e5eeff] text-[10px] text-[#004ac6] font-bold">
                    Score: 9/10
                  </span>
                </div>
                <span className="text-[11px] text-[#565e74]">
                  Fundamentals of Chemistry: Atomic mass and mole concept
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#565e74] whitespace-nowrap pl-2">Yesterday</span>
          </div>
        </div>

        {/* Minimal State Slot Notice */}
        <div className="mt-4 pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between text-[#434655] text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#737686]">sync</span>
            <span>Upcoming test reminders and teacher notes will sync here.</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('progress-and-analytics')}
            className="text-[#004ac6] hover:underline font-semibold"
          >
            View Full Log
          </button>
        </div>
      </div>
    </div>
  );
};
