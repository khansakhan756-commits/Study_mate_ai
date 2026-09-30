import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TargetClass, StudyGroup } from '../../types';

export const Settings: React.FC = () => {
  const { currentUser, updateProfile, updateClassAndGroup } = useAuth();

  const [name, setName] = useState(currentUser?.fullName || 'Khansa Tariq');
  const [email, setEmail] = useState(currentUser?.email || 'student@bise-sindh.edu.pk');
  const [selectedClass, setSelectedClass] = useState<TargetClass>(currentUser?.targetClass || '9th');
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup>(currentUser?.studyGroup || 'biology');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [examReminders, setExamReminders] = useState(true);
  const [aiSync, setAiSync] = useState(true);

  // Password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passUpdated, setPassUpdated] = useState(false);

  const hasConfigChanged =
    selectedClass !== currentUser?.targetClass || selectedGroup !== currentUser?.studyGroup;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: name,
      email: email,
    });
    updateClassAndGroup(selectedClass, selectedGroup);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    setPassUpdated(true);
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setPassUpdated(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#c3c6d7]/30">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
          Settings & Academic Configuration
        </h1>
        <p className="text-xs sm:text-sm text-[#434655] mt-1">
          Manage your student profile, examination board standards, and syllabus electives.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-[#dcfce7] border border-[#15803d]/30 rounded-xl text-xs sm:text-sm text-[#15803d] flex items-center gap-2 animate-in fade-in duration-150">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>
            Academic settings updated successfully! All subjects, chapters, quizzes, and mock exams
            are now configured for{' '}
            <strong>
              Class {selectedClass === '10th' ? '10' : '9'} (
              {selectedGroup === 'computer_science' ? 'Computer Science Group' : 'Biology Group'})
            </strong>
            .
          </span>
        </div>
      )}

      {/* 1. Academic Configuration (Class & Study Group) */}
      <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-[#0b1c30]">BISE Sindh Academic Target</h2>
          <p className="text-xs text-[#565e74] mt-0.5">
            Configure your enrolled academic level and examination track.
          </p>
        </div>

        {/* Dynamic Change Notice Callout */}
        <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#c3c6d7]/40 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#004ac6] text-[22px] shrink-0 mt-0.5">
            info
          </span>
          <div className="text-xs text-[#434655] leading-relaxed">
            <strong className="text-[#0b1c30] block mb-0.5">
              Syllabus Cascade Notification
            </strong>
            Changing your <strong>Class (9th / 10th)</strong> or <strong>Study Group (Biology / Computer Science)</strong> will immediately update the textbooks, chapter reading passages, past-paper question banks, topic quizzes, and mock examinations available to you.
          </div>
        </div>

        {/* Target Class Cards */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#0b1c30]">Target Standard</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedClass('9th')}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedClass === '9th'
                  ? 'bg-[#eff4ff] border-[#2563eb] ring-2 ring-[#2563eb]'
                  : 'bg-white border-[#c3c6d7]/40 hover:bg-[#f8f9ff]'
              }`}
            >
              <div>
                <span className="font-bold text-sm text-[#0b1c30] block">Class 9th</span>
                <span className="text-xs text-[#565e74]">Secondary School Certificate (Part I)</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedClass === '9th' ? 'bg-[#2563eb] text-white' : 'border border-[#c3c6d7]'
                }`}
              >
                {selectedClass === '9th' && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedClass('10th')}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedClass === '10th'
                  ? 'bg-[#eff4ff] border-[#2563eb] ring-2 ring-[#2563eb]'
                  : 'bg-white border-[#c3c6d7]/40 hover:bg-[#f8f9ff]'
              }`}
            >
              <div>
                <span className="font-bold text-sm text-[#0b1c30] block">Class 10th (Matric)</span>
                <span className="text-xs text-[#565e74]">Secondary School Certificate (Part II)</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedClass === '10th' ? 'bg-[#2563eb] text-white' : 'border border-[#c3c6d7]'
                }`}
              >
                {selectedClass === '10th' && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Study Group Elective Cards */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#0b1c30]">Study Group & Electives</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedGroup('biology')}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedGroup === 'biology'
                  ? 'bg-[#eff4ff] border-[#2563eb] ring-2 ring-[#2563eb]'
                  : 'bg-white border-[#c3c6d7]/40 hover:bg-[#f8f9ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#dbe1ff] flex items-center justify-center text-[#004ac6]">
                  <span className="material-symbols-outlined text-[20px]">biotech</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0b1c30] block">Science (Biology)</span>
                  <span className="text-[11px] text-[#565e74]">Physics, Chemistry, Biology, Math</span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedGroup === 'biology' ? 'bg-[#2563eb] text-white' : 'border border-[#c3c6d7]'
                }`}
              >
                {selectedGroup === 'biology' && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedGroup('computer_science')}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedGroup === 'computer_science'
                  ? 'bg-[#eff4ff] border-[#2563eb] ring-2 ring-[#2563eb]'
                  : 'bg-white border-[#c3c6d7]/40 hover:bg-[#f8f9ff]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#dae2fd] flex items-center justify-center text-[#565e74]">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0b1c30] block">Computer Science</span>
                  <span className="text-[11px] text-[#565e74]">Physics, Chemistry, CS, Math</span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  selectedGroup === 'computer_science' ? 'bg-[#2563eb] text-white' : 'border border-[#c3c6d7]'
                }`}
              >
                {selectedGroup === 'computer_science' && (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Personal Profile Information */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 space-y-5"
      >
        <div className="pb-3 border-b border-[#c3c6d7]/20">
          <h2 className="text-base font-bold text-[#0b1c30]">Student Identity & Registration</h2>
          <p className="text-xs text-[#565e74] mt-0.5">
            Details linked to your Board of Intermediate and Secondary Education profile.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 border border-[#c3c6d7]/70 rounded-lg text-sm bg-white text-[#0b1c30] outline-none focus:border-[#2563eb]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">Student Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 border border-[#c3c6d7]/70 rounded-lg text-sm bg-white text-[#0b1c30] outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">BISE Registration Number</label>
            <input
              type="text"
              readOnly
              value={currentUser?.registrationNumber || 'BISE-KHI-2024-91204'}
              className="w-full h-10 px-3 border border-[#c3c6d7]/40 rounded-lg text-sm bg-[#f8f9ff] text-[#737686] outline-none cursor-not-allowed"
            />
            <span className="text-[10px] text-[#737686]">Managed by Sindh Board Secretariat</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">Enrolled Institutional Centre</label>
            <input
              type="text"
              readOnly
              value="Karachi Board Secondary Examination Zone 4"
              className="w-full h-10 px-3 border border-[#c3c6d7]/40 rounded-lg text-sm bg-[#f8f9ff] text-[#737686] outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            {hasConfigChanged ? 'Apply Changes & Switch Syllabus' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* 3. Account Security (Password) */}
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 space-y-4"
      >
        <div className="pb-3 border-b border-[#c3c6d7]/20">
          <h2 className="text-base font-bold text-[#0b1c30]">Account Security</h2>
          <p className="text-xs text-[#565e74] mt-0.5">Update password and access keys.</p>
        </div>

        {passUpdated && (
          <div className="p-3 bg-[#dcfce7] text-[#15803d] rounded-lg text-xs font-semibold">
            Password successfully updated!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">Current Password</label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 border border-[#c3c6d7]/70 rounded-lg text-sm bg-white text-[#0b1c30] outline-none focus:border-[#2563eb]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0b1c30]">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full h-10 px-3 border border-[#c3c6d7]/70 rounded-lg text-sm bg-white text-[#0b1c30] outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            disabled={!newPass || !currentPass}
            className="px-5 py-2 bg-[#565e74] hover:bg-[#3f465c] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-40"
          >
            Update Security Password
          </button>
        </div>
      </form>

      {/* 4. Notification Preferences */}
      <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 space-y-4">
        <div className="pb-3 border-b border-[#c3c6d7]/20">
          <h2 className="text-base font-bold text-[#0b1c30]">Notification & AI Preferences</h2>
          <p className="text-xs text-[#565e74] mt-0.5">
            Configure how you receive examination reminders and AI study copilot notes.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-[#0b1c30] block">
                Board Exam Deadlines & Reminders
              </span>
              <span className="text-[11px] text-[#565e74]">
                Receive notices about upcoming model tests and syllabus review deadlines.
              </span>
            </div>
            <input
              type="checkbox"
              checked={examReminders}
              onChange={(e) => setExamReminders(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563eb] accent-[#2563eb]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#c3c6d7]/20">
            <div>
              <span className="text-xs font-semibold text-[#0b1c30] block">
                Strict Curriculum Grounding (STBB)
              </span>
              <span className="text-[11px] text-[#565e74]">
                Keep AI answers strictly anchored in Sindh Textbook Board approved chapters.
              </span>
            </div>
            <input
              type="checkbox"
              checked={aiSync}
              onChange={(e) => setAiSync(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563eb] accent-[#2563eb]"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
