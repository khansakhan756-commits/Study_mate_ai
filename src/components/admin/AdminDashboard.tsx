import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      {/* Top Admin Header */}
      <header className="h-16 px-6 bg-white border-b border-[#c3c6d7]/30 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#565e74] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-[#0b1c30]">
              StudyMate AI • Institutional Administrator Portal
            </h1>
            <span className="text-[11px] text-[#565e74]">
              Sindh Education Department & BISE Matriculation Registry
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#0b1c30]">{currentUser?.fullName}</p>
            <p className="text-[11px] text-[#565e74]">{currentUser?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg border border-[#c3c6d7] text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#c3c6d7]/30">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#004ac6] font-bold">
              Protected Institutional Console
            </span>
            <h2 className="text-2xl font-bold text-[#0b1c30] mt-0.5">
              Sindh Board Academic Oversight
            </h2>
          </div>
          <span className="text-xs bg-[#dbe1ff] text-[#00174b] px-3 py-1 rounded-full font-bold">
            Session Gate: Active
          </span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#c3c6d7]/30 shadow-xs">
            <span className="text-xs text-[#565e74]">Registered Matric Students</span>
            <div className="text-2xl font-bold text-[#0b1c30] mt-2">14,820</div>
            <span className="text-[11px] text-[#059669] font-semibold mt-1 block">
              ● Active Sindh Cohort
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#c3c6d7]/30 shadow-xs">
            <span className="text-xs text-[#565e74]">STBB Curricula Loaded</span>
            <div className="text-2xl font-bold text-[#004ac6] mt-2">Class 9 & 10</div>
            <span className="text-[11px] text-[#565e74] mt-1 block">Bio & CS Groups</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#c3c6d7]/30 shadow-xs">
            <span className="text-xs text-[#565e74]">Model Exam Submissions</span>
            <div className="text-2xl font-bold text-[#0b1c30] mt-2">32,490</div>
            <span className="text-[11px] text-[#004ac6] font-semibold mt-1 block">
              Average Score 78.4%
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#c3c6d7]/30 shadow-xs">
            <span className="text-xs text-[#565e74]">AI Grounding Verification</span>
            <div className="text-2xl font-bold text-[#059669] mt-2">100% Locked</div>
            <span className="text-[11px] text-[#565e74] mt-1 block">STBB Jamshoro Reference</span>
          </div>
        </div>

        {/* Curriculum Validation Table */}
        <div className="bg-white rounded-xl border border-[#c3c6d7]/30 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base text-[#0b1c30]">Curriculum Status & Question Bank</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#eff4ff] text-[#0b1c30]">
                  <th className="py-2.5 px-4 font-bold rounded-l-lg">Course Title</th>
                  <th className="py-2.5 px-4 font-bold">Standard</th>
                  <th className="py-2.5 px-4 font-bold">Group</th>
                  <th className="py-2.5 px-4 font-bold">STBB Status</th>
                  <th className="py-2.5 px-4 font-bold rounded-r-lg">Question Bank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d7]/20">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">Physics (SSC-I)</td>
                  <td className="py-3 px-4 text-[#434655]">Class 9</td>
                  <td className="py-3 px-4 text-[#434655]">Common</td>
                  <td className="py-3 px-4 text-[#059669] font-bold">Verified Jamshoro 2024</td>
                  <td className="py-3 px-4 text-[#0b1c30]">350 MCQs / 40 Model Papers</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">Chemistry (SSC-I)</td>
                  <td className="py-3 px-4 text-[#434655]">Class 9</td>
                  <td className="py-3 px-4 text-[#434655]">Common</td>
                  <td className="py-3 px-4 text-[#059669] font-bold">Verified Jamshoro 2024</td>
                  <td className="py-3 px-4 text-[#0b1c30]">280 MCQs / 35 Model Papers</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">Biology (SSC-I)</td>
                  <td className="py-3 px-4 text-[#434655]">Class 9</td>
                  <td className="py-3 px-4 text-[#004ac6] font-semibold">Biology Group</td>
                  <td className="py-3 px-4 text-[#059669] font-bold">Verified Jamshoro 2024</td>
                  <td className="py-3 px-4 text-[#0b1c30]">310 MCQs / 30 Model Papers</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">Computer Science (SSC-I)</td>
                  <td className="py-3 px-4 text-[#434655]">Class 9</td>
                  <td className="py-3 px-4 text-[#565e74] font-semibold">CS Group</td>
                  <td className="py-3 px-4 text-[#059669] font-bold">Verified Jamshoro 2024</td>
                  <td className="py-3 px-4 text-[#0b1c30]">290 MCQs / 30 Model Papers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
