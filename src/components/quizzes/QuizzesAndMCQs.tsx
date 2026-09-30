import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Subject, Question, ActiveTab } from '../../types';
import { PHYSICS_MOCK_QUESTIONS } from '../../services/curriculumData';

interface QuizzesAndMCQsProps {
  subjects: Subject[];
  initialSubjectId?: string;
  initialChapterId?: string;
  setActiveTab: (tab: ActiveTab) => void;
  onNavigateToMockExam: () => void;
}

export const QuizzesAndMCQs: React.FC<QuizzesAndMCQsProps> = ({
  subjects,
  initialSubjectId,
  initialChapterId,
  onNavigateToMockExam,
}) => {
  const { currentUser } = useAuth();
  const currentClass = currentUser?.targetClass || '9th';

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || 'phy-9'
  );
  const [filterMode, setFilterMode] = useState('all');

  // Active quiz session runner state
  const [activeQuizChapter, setActiveQuizChapter] = useState<{
    subjectName: string;
    chapterNumber: number;
    chapterTitle: string;
    questions: Question[];
  } | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const activeSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Start interactive quiz for a chapter
  const handleStartChapterQuiz = (chNumber: number, chTitle: string) => {
    // Pick questions relevant to chapter or board set
    const chapterQuestions = PHYSICS_MOCK_QUESTIONS.slice(0, 5); // 5 focused questions for practice
    setActiveQuizChapter({
      subjectName: activeSubject.name,
      chapterNumber: chNumber,
      chapterTitle: chTitle,
      questions: chapterQuestions,
    });
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optId,
    }));
  };

  const handleClearAnswer = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestionIndex];
      return copy;
    });
  };

  const currentQ = activeQuizChapter?.questions[currentQuestionIndex];

  // Calculate score if completed
  const calculateResults = () => {
    if (!activeQuizChapter) return { correct: 0, total: 0, percent: 0 };
    let correct = 0;
    activeQuizChapter.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOption) {
        correct++;
      }
    });
    const total = activeQuizChapter.questions.length;
    const percent = Math.round((correct / total) * 100);
    return { correct, total, percent };
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#c3c6d7]/30">
        <div>
          <div className="flex items-center gap-1.5 text-[#004ac6] text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Board Exam Preparation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
            Practice & Examination Center
          </h1>
        </div>

        {/* Mode Toggle: Quizzes vs Mock Simulator */}
        <div className="inline-flex p-1 bg-[#dce9ff] rounded-xl self-start md:self-auto shadow-xs">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white text-[#004ac6] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span>Topic Quizzes & MCQs</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToMockExam}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm text-[#434655] hover:text-[#0b1c30] flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span>Full Mock Exam Simulator</span>
          </button>
        </div>
      </div>

      {/* If Quiz is in Progress */}
      {activeQuizChapter ? (
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#c3c6d7]/30 max-w-4xl mx-auto w-full">
          {!isCompleted ? (
            /* Active Question Card */
            <div>
              {/* Question header info */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#c3c6d7]/20">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-xs text-[#004ac6] font-bold">
                    {activeQuizChapter.subjectName} • Ch {activeQuizChapter.chapterNumber}
                  </span>
                  <span className="text-xs text-[#565e74] truncate">
                    {activeQuizChapter.chapterTitle}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#0b1c30]">
                    Question {currentQuestionIndex + 1} of {activeQuizChapter.questions.length}
                  </span>
                  <button
                    onClick={() => setActiveQuizChapter(null)}
                    className="text-xs text-[#737686] hover:text-[#ba1a1a] px-2 py-1 rounded bg-[#f8f9ff]"
                  >
                    Exit Quiz
                  </button>
                </div>
              </div>

              {/* Question Body */}
              {currentQ && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#2563eb] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {currentQuestionIndex + 1}
                    </span>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-[#0b1c30] leading-relaxed">
                        {currentQ.questionText}
                      </p>
                      {currentQ.hint && (
                        <p className="text-xs text-[#565e74] mt-2 bg-[#eff4ff] p-2 rounded-lg border border-[#c3c6d7]/20 inline-block">
                          💡 Hint: {currentQ.hint}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5 max-w-2xl pl-0 sm:pl-11">
                    {currentQ.options.map((opt) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(opt.id)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#eff4ff] border-[#2563eb] ring-2 ring-[#2563eb]'
                              : 'bg-white border-[#c3c6d7]/40 hover:bg-[#f8f9ff]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isSelected ? 'bg-[#2563eb] text-white' : 'bg-[#e5eeff] text-[#434655]'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-[#0b1c30]">
                              {opt.text}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#2563eb] text-white'
                                : 'border border-[#c3c6d7]'
                            }`}
                          >
                            {isSelected && (
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation controls */}
                  <div className="pt-6 border-t border-[#c3c6d7]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                        className="px-4 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-semibold disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAnswer}
                        className="px-3 py-2 text-xs text-[#737686] hover:text-[#ba1a1a]"
                      >
                        Clear Selection
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentQuestionIndex < activeQuizChapter.questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                          className="px-5 py-2 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                        >
                          <span>Save & Next</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsCompleted(true)}
                          className="px-5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                        >
                          <span>Complete & Submit Quiz</span>
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Score & Review View */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#dbe1ff] text-[#004ac6] mb-3">
                  <span className="material-symbols-outlined text-[32px]">task_alt</span>
                </div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">Quiz Completed!</h2>
                <p className="text-xs text-[#565e74] mt-1">
                  {activeQuizChapter.subjectName} • Chapter {activeQuizChapter.chapterNumber}:{' '}
                  {activeQuizChapter.chapterTitle}
                </p>
              </div>

              {/* Metrics */}
              {(() => {
                const res = calculateResults();
                return (
                  <div className="grid grid-cols-3 gap-3 p-4 bg-[#eff4ff] rounded-xl text-center">
                    <div>
                      <span className="text-[11px] text-[#565e74]">Score Percentage</span>
                      <div className="text-2xl font-bold text-[#004ac6]">{res.percent}%</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#565e74]">Correct Answers</span>
                      <div className="text-2xl font-bold text-[#059669]">
                        {res.correct} / {res.total}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#565e74]">Status</span>
                      <div className="text-sm font-bold text-[#0b1c30] mt-1">
                        {res.percent >= 80 ? 'Mastered' : 'Needs Practice'}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Answer Review list */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#0b1c30]">Question Review & Official Keys</h3>
                {activeQuizChapter.questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctOption;
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-[#c3c6d7]/30 bg-[#f8f9ff] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0b1c30]">Question {idx + 1}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            isCorrect
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                        {q.questionText}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="bg-white p-2 rounded border border-[#c3c6d7]/30">
                          <span className="text-[10px] text-[#737686] block">Your Answer:</span>
                          <span className="font-semibold">{userAns ? `${userAns}` : 'Unanswered'}</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#c3c6d7]/30">
                          <span className="text-[10px] text-[#737686] block">Correct Board Key:</span>
                          <span className="font-semibold text-[#059669]">{q.correctOption}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#565e74] bg-[#eff4ff] p-2 rounded">
                        <strong>Explanation:</strong> {q.explanation} ({q.citation})
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c3c6d7]/20">
                <button
                  type="button"
                  onClick={() =>
                    handleStartChapterQuiz(
                      activeQuizChapter.chapterNumber,
                      activeQuizChapter.chapterTitle
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold hover:bg-[#dce9ff]"
                >
                  Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuizChapter(null)}
                  className="px-5 py-2 rounded-lg bg-[#2563eb] text-white text-xs font-semibold hover:bg-[#004ac6]"
                >
                  Back to All Chapters
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Normal Quizzes Directory View */
        <div className="space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#004ac6] shrink-0">
                <span className="material-symbols-outlined text-[24px]">checklist</span>
              </div>
              <div>
                <div className="text-xs text-[#737686]">Total Topics Tested</div>
                <div className="text-xl font-bold text-[#0b1c30]">18 / 24 Units</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#565e74] shrink-0">
                <span className="material-symbols-outlined text-[24px]">trending_up</span>
              </div>
              <div>
                <div className="text-xs text-[#737686]">Average Accuracy</div>
                <div className="text-xl font-bold text-[#0b1c30]">84.2%</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#c4e7ff] flex items-center justify-center text-[#005b7c] shrink-0">
                <span className="material-symbols-outlined text-[24px]">history_edu</span>
              </div>
              <div>
                <div className="text-xs text-[#737686]">MCQs Practiced</div>
                <div className="text-xl font-bold text-[#0b1c30]">620 Solved</div>
              </div>
            </div>
          </div>

          {/* Chapter Quiz Directory */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#c3c6d7]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d7]/20">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0b1c30]">
                  {activeSubject.name} Chapter Quizzes
                </h2>
                <p className="text-xs text-[#434655]">
                  Class {currentClass === '10th' ? '10' : '9'} Matriculation Board Curriculum • BISE
                  Sindh
                </p>
              </div>

              {/* Subject selector + filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="bg-[#eff4ff] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0b1c30] outline-none border border-[#c3c6d7]/40"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="bg-[#eff4ff] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0b1c30] outline-none border border-[#c3c6d7]/40"
                >
                  <option value="all">All Chapters</option>
                  <option value="completed">Attempted Only</option>
                </select>
              </div>
            </div>

            {/* Chapter rows */}
            <div className="divide-y divide-[#c3c6d7]/20 mt-2">
              {activeSubject.chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#f8f9ff] px-3 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center font-bold text-sm text-[#004ac6] shrink-0">
                      0{ch.number}
                    </span>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-[#0b1c30]">{ch.title}</h3>
                      <p className="text-xs text-[#737686] mt-0.5">
                        {ch.topics.map((t) => t.title).slice(0, 3).join(', ')} • {ch.mcqsCount} MCQs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-start md:self-auto">
                    <div className="text-right">
                      <span className="text-[11px] text-[#737686] block">Best Score</span>
                      <div className="text-sm font-bold text-[#004ac6]">
                        {ch.masteryPercentage > 0 ? `${ch.masteryPercentage}%` : 'Unattempted'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartChapterQuiz(ch.number, ch.title)}
                      className="px-4 py-2 rounded-lg bg-[#2563eb] text-white hover:bg-[#004ac6] text-xs font-semibold transition-colors shadow-xs"
                    >
                      {ch.masteryPercentage > 0 ? 'Retake Quiz' : 'Start Practice'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
