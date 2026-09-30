import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ExamResultSummary, ActiveTab } from '../../types';
import { apiService } from '../../services/apiService';

interface ProgressAndResultsProps {
  latestResult?: ExamResultSummary;
  setActiveTab: (tab: ActiveTab) => void;
  onNavigateToStudyTopic: (subjectId: string, chapterId: string) => void;
  onNavigateToQuizTopic: (subjectId: string, chapterId: string) => void;
  onAskAIAboutQuestion: (questionText: string) => void;
}

export const ProgressAndResults: React.FC<ProgressAndResultsProps> = ({
  latestResult,
  setActiveTab,
  onNavigateToStudyTopic,
  onNavigateToQuizTopic,
  onAskAIAboutQuestion,
}) => {
  const { currentUser } = useAuth();
  const currentClass = currentUser?.targetClass || '9th';
  const currentGroup = currentUser?.studyGroup || 'biology';

  const [activeSubjectFilter, setActiveSubjectFilter] = useState('physics');
  const [reviewPanelOpen, setReviewPanelOpen] = useState(true);

  const result = latestResult || apiService.getLatestExamResult();

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header & Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#c3c6d7]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dbe1ff] text-[#00174b] uppercase tracking-wider">
              Session 2024–2025
            </span>
            <span className="text-xs text-[#737686]">
              BISE Sindh Matric (Class {currentClass === '10th' ? 'X' : 'IX'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
            Results & Academic Progress
          </h1>
          <p className="text-xs sm:text-sm text-[#434655] mt-1">
            Diagnostic summary from recent mock examinations and syllabus mastery.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="relative">
            <select
              value={activeSubjectFilter}
              onChange={(e) => setActiveSubjectFilter(e.target.value)}
              className="appearance-none bg-white text-[#0b1c30] text-xs sm:text-sm font-semibold pl-3 pr-8 py-2 rounded-lg border border-[#c3c6d7]/60 shadow-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Subjects</option>
              <option value="physics">Physics (SSC-I)</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="mathematics">Mathematics</option>
            </select>
            <span className="material-symbols-outlined text-[#737686] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#004ac6] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Board Report PDF</span>
          </button>
        </div>
      </div>

      {/* 1. Top Exam Diagnostic Result Card */}
      <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#c3c6d7]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2563eb]">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <span className="text-[11px] text-[#004ac6] uppercase font-bold tracking-wide block">
                Official Mock Assessment
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0b1c30]">{result.examTitle}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#434655] self-start sm:self-auto bg-[#eff4ff] px-3 py-1 rounded-md">
            <span className="material-symbols-outlined text-[16px] text-[#737686]">
              calendar_today
            </span>
            <span>Conducted on {result.date}</span>
          </div>
        </div>

        {/* 4-Column Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Total Score */}
          <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col justify-between">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-semibold">
              Total Score
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#004ac6]">{result.scorePercentage}%</span>
              <span className="text-xs text-[#565e74] font-medium">/ 100</span>
            </div>
            <p className="text-xs text-[#434655] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
              <span>
                {result.correctCount} / {result.totalQuestions} Correct
              </span>
            </p>
          </div>

          {/* Metric 2: Accuracy Rate */}
          <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col justify-between">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-semibold">
              Accuracy Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0b1c30]">{result.scorePercentage}%</span>
              <span className="text-[11px] text-[#737686] font-semibold">Standard</span>
            </div>
            <p className="text-xs text-[#ba1a1a] mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
              <span>{result.incorrectCount} Incorrect / Review Required</span>
            </p>
          </div>

          {/* Metric 3: Pacing & Duration */}
          <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col justify-between">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-semibold">
              Pacing & Duration
            </span>
            <div className="mt-2 flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-bold text-[#0b1c30]">
                {Math.floor(result.timeSpentSeconds / 60)}
                <span className="text-base font-medium text-[#737686]">m</span>{' '}
                {result.timeSpentSeconds % 60}
                <span className="text-base font-medium text-[#737686]">s</span>
              </span>
            </div>
            <p className="text-xs text-[#005b7c] mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              <span>Saved 21m 40s (Target: 60m)</span>
            </p>
          </div>

          {/* Metric 4: Board Standing */}
          <div className="p-4 rounded-xl bg-[#eff4ff] flex flex-col justify-between">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-semibold">
              Board Standing
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#004ac6]">{result.boardGrade}</span>
            </div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#dae2fd] text-[#131b2e] font-semibold">
                On Track for Distinction
              </span>
            </div>
          </div>
        </div>

        {/* Evaluation Diagnostic Banner */}
        <div className="p-3.5 bg-[#eff4ff] rounded-xl flex items-start sm:items-center gap-3 border border-[#c3c6d7]/30">
          <span className="material-symbols-outlined text-[#2563eb] text-[20px] shrink-0">info</span>
          <p className="text-xs sm:text-sm text-[#0b1c30] leading-snug">
            <span className="font-bold text-[#004ac6]">Diagnostic Insight:</span>{' '}
            {result.diagnosticInsight}
          </p>
        </div>
      </div>

      {/* 2. Review Flagged / Incorrect Questions Panel (Collapsible) */}
      <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 overflow-hidden">
        {/* Toggle Header */}
        <div
          onClick={() => setReviewPanelOpen(!reviewPanelOpen)}
          className="px-6 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#f8f9ff] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ba1a1a]"></span>
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#0b1c30]">
              Questions Requiring Review
            </h3>
            <span className="text-xs bg-[#ffdad6] text-[#93000a] px-2.5 py-0.5 rounded-full font-bold">
              {result.flaggedQuestions.length} Flagged Item
            </span>
          </div>

          <button
            type="button"
            className="text-[#434655] p-1 rounded-md"
            aria-label="Toggle Question Review Panel"
          >
            <span className="material-symbols-outlined text-[20px]">
              {reviewPanelOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* Question Details Area */}
        {reviewPanelOpen && (
          <div className="px-6 pb-6 pt-1 space-y-4">
            {result.flaggedQuestions.map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#eff4ff] space-y-3 border border-[#c3c6d7]/30">
                {/* Meta Strip */}
                <div className="flex items-center justify-between text-xs text-[#565e74]">
                  <span className="font-bold text-[#0b1c30] uppercase tracking-wider">
                    Question {item.question.number} of {result.totalQuestions}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#005b7c] font-medium">
                    <span className="material-symbols-outlined text-[15px]">menu_book</span>
                    {item.question.citation}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-sm sm:text-base font-bold text-[#0b1c30] leading-relaxed">
                  {item.question.questionText}
                </p>

                {/* Response Grid Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Student Answer */}
                  <div className="p-3.5 rounded-lg bg-white border border-[#c3c6d7]/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#737686]">Your Submitted Answer</span>
                      <span className="text-sm font-bold text-[#0b1c30] mt-0.5">
                        {item.userAnswer} — Force
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">cancel</span>
                      Incorrect
                    </span>
                  </div>

                  {/* Board Key */}
                  <div className="p-3.5 rounded-lg bg-white border border-[#c3c6d7]/40 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#737686]">Board Key Answer</span>
                      <span className="text-sm font-bold text-[#0b1c30] mt-0.5">
                        {item.question.correctOption} — Density
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#dce9ff] text-[#004ac6] px-2.5 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Correct Key
                    </span>
                  </div>
                </div>

                {/* Curriculum note & Ask AI trigger */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-[#565e74] leading-relaxed">
                    <strong className="text-[#0b1c30]">Curriculum note:</strong> In the current
                    revision cycle, base and derived unit allocations align strictly with Table 1.1
                    benchmarks.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      onAskAIAboutQuestion(
                        `Why is "${item.question.options.find((o) => o.id === item.question.correctOption)?.text}" the derived physical quantity according to Sindh Textbook Board instead of "${item.question.options.find((o) => o.id === item.userAnswer)?.text}"?`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#004ac6] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[17px]">smart_toy</span>
                    <span>Ask AI To Explain This Question</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Overall Curriculum Progress (Syllabus Mastery by Subject) */}
      <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#c3c6d7]/20">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">
              Syllabus Mastery by Subject
            </h3>
            <p className="text-xs text-[#565e74] mt-0.5">
              Academic Track: Class {currentClass === '10th' ? '10' : '9'} •{' '}
              {currentGroup === 'computer_science' ? 'Computer Science Group' : 'Biology Group'}
            </p>
          </div>
          <span className="text-xs font-bold text-[#004ac6]">73.6% Aggregate Preparation</span>
        </div>

        {/* Progress Bars Grid (Clean 2-Column Responsive Matrix) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* Physics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0b1c30]">Physics</span>
              <span className="text-[#565e74]">
                <strong className="text-[#0b1c30]">78%</strong> completed · 9 Chapters
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#dce9ff] overflow-hidden">
              <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Chemistry */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0b1c30]">Chemistry</span>
              <span className="text-[#565e74]">
                <strong className="text-[#0b1c30]">60%</strong> completed · 8 Chapters
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#dce9ff] overflow-hidden">
              <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Biology or CS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0b1c30]">
                {currentGroup === 'computer_science' ? 'Computer Science' : 'Biology'}
              </span>
              <span className="text-[#565e74]">
                <strong className="text-[#0b1c30]">72%</strong> completed ·{' '}
                {currentGroup === 'computer_science' ? '7 Chapters' : '9 Chapters'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#dce9ff] overflow-hidden">
              <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          {/* Mathematics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0b1c30]">Mathematics</span>
              <span className="text-[#565e74]">
                <strong className="text-[#0b1c30]">55%</strong> completed · 12 Chapters
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#dce9ff] overflow-hidden">
              <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '55%' }}></div>
            </div>
          </div>

          {/* English */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0b1c30]">English Normal</span>
              <span className="text-[#565e74]">
                <strong className="text-[#0b1c30]">85%</strong> completed · 10 Units
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#dce9ff] overflow-hidden">
              <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Islamiat / Pak Studies */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0b1c30]">
                {currentClass === '10th' ? 'Pakistan Studies' : 'Islamiat Compulsory'}
              </span>
              <span className="text-[#565e74]">
                <strong className="text-[#0b1c30]">92%</strong> completed · Core Syllabus
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#dce9ff] overflow-hidden">
              <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Targeted Topics for Next Revision */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">
              Targeted Topics for Next Revision
            </h3>
            <p className="text-xs text-[#565e74] mt-0.5">
              High-priority concepts identified based on recent MCQ diagnostic accuracy
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('quizzes-and-mcqs')}
            className="text-[#004ac6] hover:underline text-xs font-semibold inline-flex items-center gap-1"
          >
            <span>View Full Analysis</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Topic Card 1: Physics */}
          <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] bg-[#dbe1ff] text-[#00174b] px-2.5 py-0.5 rounded-full font-bold">
                  Physics
                </span>
                <span className="text-[11px] text-[#ba1a1a] font-bold bg-[#ffdad6] px-2 py-0.5 rounded">
                  52% Accuracy
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30] leading-snug">
                  Kinematics — Graphical Analysis of Motion
                </h4>
                <p className="text-xs text-[#565e74] mt-1.5 line-clamp-2">
                  Speed-time graphs, distance evaluation, and uniform acceleration slope
                  calculations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-5 mt-auto">
              <button
                type="button"
                onClick={() => onNavigateToStudyTopic('phy-9', 'phy-9-ch2')}
                className="flex-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] py-2 rounded-lg text-xs font-semibold transition-colors text-center"
              >
                Study Topic
              </button>
              <button
                type="button"
                onClick={() => onNavigateToQuizTopic('phy-9', 'phy-9-ch2')}
                className="flex-1 bg-[#2563eb] hover:bg-[#004ac6] text-white py-2 rounded-lg text-xs font-semibold transition-colors text-center shadow-xs"
              >
                Practice MCQs
              </button>
            </div>
          </div>

          {/* Topic Card 2: Chemistry */}
          <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] bg-[#dce9ff] text-[#004ac6] px-2.5 py-0.5 rounded-full font-bold">
                  Chemistry
                </span>
                <span className="text-[11px] text-[#ba1a1a] font-bold bg-[#ffdad6] px-2 py-0.5 rounded">
                  58% Accuracy
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30] leading-snug">
                  Valency & Radical Compounds
                </h4>
                <p className="text-xs text-[#565e74] mt-1.5 line-clamp-2">
                  Rules of empirical formulas, cross-valency notation, and common polyatomic ions.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-5 mt-auto">
              <button
                type="button"
                onClick={() => onNavigateToStudyTopic('chem-9', 'chem-9-ch1')}
                className="flex-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] py-2 rounded-lg text-xs font-semibold transition-colors text-center"
              >
                Study Topic
              </button>
              <button
                type="button"
                onClick={() => onNavigateToQuizTopic('chem-9', 'chem-9-ch1')}
                className="flex-1 bg-[#2563eb] hover:bg-[#004ac6] text-white py-2 rounded-lg text-xs font-semibold transition-colors text-center shadow-xs"
              >
                Practice MCQs
              </button>
            </div>
          </div>

          {/* Topic Card 3: Biology or CS */}
          <div className="bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] bg-[#dae2fd] text-[#131b2e] px-2.5 py-0.5 rounded-full font-bold">
                  {currentGroup === 'computer_science' ? 'Computer Science' : 'Biology'}
                </span>
                <span className="text-[11px] text-[#434655] font-bold bg-[#dce9ff] px-2 py-0.5 rounded">
                  62% Accuracy
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30] leading-snug">
                  {currentGroup === 'computer_science'
                    ? 'Operating System File Architecture'
                    : 'Cell Organelles: Mitochondria & Plastids'}
                </h4>
                <p className="text-xs text-[#565e74] mt-1.5 line-clamp-2">
                  {currentGroup === 'computer_science'
                    ? 'File systems in Linux vs Windows, path notation, and permission matrices.'
                    : 'Double-membrane functions, ATP synthesis mechanisms, and chloroplast internal structure.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-5 mt-auto">
              <button
                type="button"
                onClick={() =>
                  onNavigateToStudyTopic(
                    currentGroup === 'computer_science' ? 'cs-9' : 'bio-9',
                    currentGroup === 'computer_science' ? 'cs-9-ch2' : 'bio-9-ch4'
                  )
                }
                className="flex-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] py-2 rounded-lg text-xs font-semibold transition-colors text-center"
              >
                Study Topic
              </button>
              <button
                type="button"
                onClick={() =>
                  onNavigateToQuizTopic(
                    currentGroup === 'computer_science' ? 'cs-9' : 'bio-9',
                    currentGroup === 'computer_science' ? 'cs-9-ch2' : 'bio-9-ch4'
                  )
                }
                className="flex-1 bg-[#2563eb] hover:bg-[#004ac6] text-white py-2 rounded-lg text-xs font-semibold transition-colors text-center shadow-xs"
              >
                Practice MCQs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
