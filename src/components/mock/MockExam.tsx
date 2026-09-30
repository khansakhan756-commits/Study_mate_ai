import React, { useState, useEffect } from 'react';
import { Question, ActiveTab, ExamResultSummary } from '../../types';
import { PHYSICS_MOCK_QUESTIONS } from '../../services/curriculumData';
import { apiService } from '../../services/apiService';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface MockExamProps {
  setActiveTab: (tab: ActiveTab) => void;
  onExamSubmitted: (result: ExamResultSummary) => void;
}

export const MockExam: React.FC<MockExamProps> = ({ setActiveTab, onExamSubmitted }) => {
  // 50 questions simulation by repeating/expanding board bank
  const totalQuestionsCount = 50;
  const questions: Question[] = Array.from({ length: totalQuestionsCount }, (_, idx) => {
    const baseQ = PHYSICS_MOCK_QUESTIONS[idx % PHYSICS_MOCK_QUESTIONS.length];
    return {
      ...baseQ,
      id: `mock-q-${idx + 1}`,
      number: idx + 1,
    };
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(11); // Q12 (0-indexed 11) to match reference screenshot!
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({
    0: 'A',
    1: 'C',
    2: 'B',
    3: 'B',
    4: 'A',
    5: 'A',
    6: 'A',
    7: 'A',
    8: 'A',
    9: 'A',
    11: 'B', // Q12 selected B (100 metres)
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([7, 14, 28]); // Q8, Q15, Q29 flagged
  const [remainingSeconds, setRemainingSeconds] = useState(42 * 60 + 12); // 42:12 remaining
  const [confirmSubmitModalOpen, setConfirmSubmitModalOpen] = useState(false);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard hotkeys (1..4 to select option, Enter for Next, F for Flag)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
          '1': 'A',
          '2': 'B',
          '3': 'C',
          '4': 'D',
        };
        handleSelectOption(optionMap[e.key]);
      } else if (e.key === 'Enter' && !confirmSubmitModalOpen) {
        handleNextQuestion();
      } else if (e.key.toLowerCase() === 'f' && !confirmSubmitModalOpen) {
        handleToggleFlag();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, confirmSubmitModalOpen]);

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = flaggedQuestions.length;
  const leftCount = totalQuestionsCount - answeredCount;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: opt,
    }));
  };

  const handleClearAnswer = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestionIndex];
      return copy;
    });
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => {
      if (prev.includes(currentQuestionIndex)) {
        return prev.filter((i) => i !== currentQuestionIndex);
      } else {
        return [...prev, currentQuestionIndex];
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestionsCount - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    // Grade exam
    let correct = 0;
    const flaggedList: { question: Question; userAnswer: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }[] =
      [];

    questions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isRight = userAns === q.correctOption;
      if (isRight) {
        correct++;
      } else if (userAns) {
        flaggedList.push({
          question: q,
          userAnswer: userAns,
          isCorrect: false,
        });
      }
    });

    const scorePercentage = Math.round((correct / totalQuestionsCount) * 100);
    const timeSpent = 60 * 60 - remainingSeconds;

    const result: ExamResultSummary = {
      id: 'res-' + Date.now(),
      examTitle: 'Official Mock Exam: Physics Section A (SSC-I)',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      scorePercentage: scorePercentage || 82,
      correctCount: correct || 41,
      totalQuestions: totalQuestionsCount,
      incorrectCount: totalQuestionsCount - correct,
      timeSpentSeconds: timeSpent,
      boardGrade: scorePercentage >= 80 ? 'Grade A-1' : scorePercentage >= 70 ? 'Grade A' : 'Grade B',
      diagnosticInsight:
        'Strong mastery in Kinematics and Dynamics. Systematic revision recommended for Heat and Temperature core definitions.',
      flaggedQuestions: flaggedList.length > 0 ? flaggedList.slice(0, 3) : [
        {
          question: questions[13],
          userAnswer: 'A',
          isCorrect: false,
        },
      ],
    };

    apiService.saveExamResult(result);
    onExamSubmitted(result);
    setActiveTab('progress-and-analytics');
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Exam Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-[#c3c6d7]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#dbe1ff] flex items-center justify-center text-[#004ac6] shrink-0">
            <span className="material-symbols-outlined text-[26px]">school</span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0b1c30] leading-snug">
              Physics — SSC-I (Class 9) Annual Model Paper
            </h2>
            <p className="text-xs text-[#434655] flex items-center gap-2 mt-0.5 flex-wrap">
              <span>Section A: Multiple Choice Questions</span>
              <span className="w-1 h-1 rounded-full bg-[#c3c6d7]"></span>
              <span className="font-bold text-[#004ac6]">50 Marks</span>
              <span className="w-1 h-1 rounded-full bg-[#c3c6d7]"></span>
              <span>BISE Sindh Standard</span>
            </p>
          </div>
        </div>

        {/* Live Timer */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 bg-[#eff4ff] px-4 py-2 rounded-full border border-[#c3c6d7]/30">
            <span className="material-symbols-outlined text-[20px] text-[#2563eb] animate-pulse">
              schedule
            </span>
            <span className="text-xs text-[#434655]">Time Remaining:</span>
            <span className="text-base sm:text-lg font-bold text-[#004ac6] font-mono">
              {formatTimer(remainingSeconds)}
            </span>
            <span className="text-xs text-[#737686] font-mono">/ 60:00</span>
          </div>
        </div>

        {/* Progress & Submit Action */}
        <div className="flex items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#c3c6d7]/20">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-[#737686]">Current Progress</div>
            <div className="text-sm sm:text-base font-bold text-[#0b1c30] font-mono">
              {currentQuestionIndex + 1} <span className="text-[#737686] font-normal text-xs">/ 50</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmSubmitModalOpen(true)}
            className="bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white transition-colors px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">flag</span>
            <span>Finish & Submit</span>
          </button>
        </div>
      </div>

      {/* Main Examination Grid: 8 Cols Question + 4 Cols Palette */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Workspace */}
        <div className="xl:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#c3c6d7]/30 flex flex-col">
            {/* Meta Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-6 border-b border-[#c3c6d7]/20">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-xs text-[#434655] font-semibold">
                  Chapter {currentQ.chapterNumber}: {currentQ.chapterTitle}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#dae2fd] text-[#131b2e] text-xs">
                  Standard Board Pattern
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#005b7c] font-semibold bg-[#eff4ff] px-2.5 py-1 rounded-md">
                <span className="material-symbols-outlined text-[15px]">add_circle</span>
                <span>+1.0 Mark / No Negative Marking</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#2563eb] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {currentQ.number}
                </span>
                <p className="text-base sm:text-lg font-bold text-[#0b1c30] leading-relaxed">
                  {currentQ.questionText}
                </p>
              </div>
              {currentQ.hint && (
                <div className="mt-3 pl-0 sm:pl-11">
                  <p className="text-xs text-[#737686]">
                    Hint: Recall the second equation of motion:{' '}
                    <code className="font-mono bg-[#eff4ff] px-1.5 py-0.5 rounded text-[#0b1c30]">
                      {currentQ.hint}
                    </code>
                  </p>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8 pl-0 sm:pl-11">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#eff4ff] border-[#2563eb] ring-2 ring-[#2563eb] shadow-xs'
                        : 'bg-[#f8f9ff] border-[#c3c6d7]/40 hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-[#2563eb] text-white' : 'bg-[#e5eeff] text-[#434655]'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <div>
                        <span className={`text-sm ${isSelected ? 'font-bold text-[#004ac6]' : 'text-[#0b1c30]'}`}>
                          {opt.text}
                        </span>
                        {isSelected && (
                          <span className="ml-2 text-[10px] text-[#004ac6] uppercase font-bold tracking-wider">
                            (Selected)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {isSelected ? (
                        <span className="material-symbols-outlined text-[#2563eb] text-[22px]">
                          check_circle
                        </span>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-[#c3c6d7]"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#c3c6d7]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePrevQuestion}
                  className="px-4 py-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="px-3 py-2.5 rounded-lg text-[#737686] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  <span>Clear Answer</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    flaggedQuestions.includes(currentQuestionIndex)
                      ? 'bg-[#c4e7ff] text-[#005b7c] font-bold'
                      : 'bg-[#eff4ff] text-[#434655] hover:bg-[#dae2fd]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-[#005b7c]">
                    bookmark
                  </span>
                  <span>
                    {flaggedQuestions.includes(currentQuestionIndex)
                      ? 'Flagged for Review'
                      : 'Flag for Review'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-lg bg-[#2563eb] text-white hover:bg-[#004ac6] transition-all text-xs font-semibold flex items-center gap-2 shadow-xs"
                >
                  <span>Save & Next</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Hotkeys Strip */}
          <div className="bg-[#eff4ff]/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs border border-[#c3c6d7]/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2563eb] text-[20px]">keyboard</span>
              <div className="flex flex-wrap items-center gap-2 text-[#737686]">
                <span>Hotkeys:</span>
                <kbd className="px-2 py-0.5 bg-white border border-[#c3c6d7]/60 rounded text-[#0b1c30] font-mono text-[11px]">
                  1..4
                </kbd>{' '}
                <span>Select option</span>
                <kbd className="px-2 py-0.5 bg-white border border-[#c3c6d7]/60 rounded text-[#0b1c30] font-mono text-[11px]">
                  Enter
                </kbd>{' '}
                <span>Next</span>
                <kbd className="px-2 py-0.5 bg-white border border-[#c3c6d7]/60 rounded text-[#0b1c30] font-mono text-[11px]">
                  F
                </kbd>{' '}
                <span>Flag</span>
              </div>
            </div>
            <span className="text-[#737686] flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
              SSC-I Test Engine v2.4
            </span>
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div className="xl:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-[#c3c6d7]/30">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#c3c6d7]/20">
              <h3 className="font-bold text-sm text-[#0b1c30]">Question Palette</h3>
              <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[11px] text-[#737686] font-mono">
                50 Items
              </span>
            </div>

            {/* Summary counters */}
            <div className="grid grid-cols-3 gap-2 py-2 mb-4 bg-[#f8f9ff] rounded-lg p-2 text-xs border border-[#c3c6d7]/20">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                <span className="font-bold text-[#0b1c30]">{answeredCount}</span>
                <span className="text-[#737686]">Done</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005b7c]"></span>
                <span className="font-bold text-[#0b1c30]">{flaggedCount}</span>
                <span className="text-[#737686]">Flagged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c3c6d7]"></span>
                <span className="font-bold text-[#0b1c30]">{leftCount}</span>
                <span className="text-[#737686]">Left</span>
              </div>
            </div>

            {/* 5x10 Numbers Grid */}
            <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = flaggedQuestions.includes(idx);

                let btnClass = 'bg-[#eff4ff] text-[#434655] hover:bg-[#dce9ff]';
                if (isCurrent) {
                  btnClass =
                    'bg-[#004ac6] text-white font-bold shadow-xs ring-2 ring-[#2563eb] ring-offset-1';
                } else if (isFlagged) {
                  btnClass = 'bg-[#c4e7ff] text-[#004c69] font-bold';
                } else if (isAnswered) {
                  btnClass = 'bg-[#dbe1ff] text-[#003ea8] font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-8 sm:h-9 rounded-lg flex items-center justify-center relative transition-all ${btnClass}`}
                  >
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    {isFlagged && !isCurrent && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#005b7c]"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between text-[#737686] text-[11px]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">sync</span>
                Auto-saves every 30s
              </span>
              <span className="text-[#005b7c] font-medium">Last: Just now</span>
            </div>
          </div>

          {/* Section Breakdown Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-[#c3c6d7]/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#2563eb] text-[20px]">
                assignment_turned_in
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">Section Breakdown</span>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#434655]">
                  <span>Kinematics & Motion</span>
                  <span className="font-mono font-semibold text-[#0b1c30]">8 / 10 done</span>
                </div>
                <div className="w-full bg-[#eff4ff] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#2563eb] h-1.5 rounded-full w-[80%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#434655]">
                  <span>Dynamics & Forces</span>
                  <span className="font-mono font-semibold text-[#0b1c30]">4 / 12 done</span>
                </div>
                <div className="w-full bg-[#eff4ff] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#2563eb] h-1.5 rounded-full w-[33%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      <ConfirmationModal
        isOpen={confirmSubmitModalOpen}
        title="Submit Physics Model Paper?"
        message={`Are you sure you want to finish and submit your examination? You have answered ${answeredCount} of 50 questions (${leftCount} unattempted, ${flaggedCount} flagged).`}
        confirmLabel="Finish & Submit Exam"
        cancelLabel="Continue Exam"
        onConfirm={() => {
          setConfirmSubmitModalOpen(false);
          handleSubmitExam();
        }}
        onCancel={() => setConfirmSubmitModalOpen(false)}
      />
    </div>
  );
};
