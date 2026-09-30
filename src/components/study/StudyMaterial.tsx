import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Subject, Chapter, TargetClass, StudyGroup, ActiveTab } from '../../types';
import { apiService } from '../../services/apiService';

interface StudyMaterialProps {
  subjects: Subject[];
  selectedSubjectId?: string;
  selectedChapterId?: string;
  onOpenAIAssistant: (initialPrompt?: string) => void;
  onStartQuiz: (subjectId: string, chapterId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const StudyMaterial: React.FC<StudyMaterialProps> = ({
  subjects,
  selectedSubjectId,
  selectedChapterId,
  onOpenAIAssistant,
  onStartQuiz,
}) => {
  const { currentUser, updateClassAndGroup } = useAuth();

  const currentClass = currentUser?.targetClass || '9th';
  const currentGroup = currentUser?.studyGroup || 'biology';

  // Category filter: all | elective | compulsory
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'elective' | 'compulsory'>('all');

  // Filtered subjects
  const visibleSubjects = subjects.filter((s) => {
    if (categoryFilter === 'all') return true;
    return s.category === categoryFilter;
  });

  // Active Subject selection
  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    selectedSubjectId || visibleSubjects[0]?.id || 'phy-9'
  );

  const activeSubject =
    subjects.find((s) => s.id === activeSubjectId) || visibleSubjects[0] || subjects[0];

  // Active Chapter selection
  const [activeChapterId, setActiveChapterId] = useState<string>(
    selectedChapterId || activeSubject?.currentChapterId || activeSubject?.chapters[0]?.id || 'phy-9-ch2'
  );

  const activeChapter =
    activeSubject?.chapters.find((c) => c.id === activeChapterId) || activeSubject?.chapters[0];

  // Active topic inside chapter
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(2); // 2.3 Scalars and Vectors
  const [viewMode, setViewMode] = useState<'reader' | 'notes'>('reader');
  const [bookmarks, setBookmarks] = useState<string[]>(() => apiService.getBookmarks());
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const isCurrentChapterBookmarked = bookmarks.includes(activeChapter?.id || '');

  const toggleBookmark = (chapterId: string) => {
    const isNow = apiService.toggleBookmark(chapterId);
    setBookmarks(apiService.getBookmarks());
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header & Syllabus Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#c3c6d7]/30">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Study Material
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dce9ff] text-[#004ac6]">
              STBB Jamshoro Curriculum
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#737686] mt-1">
            Official textbook reader, structured topical summaries, and syllabus review
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Switcher */}
          <div className="relative inline-flex items-center">
            <select
              value={currentClass}
              onChange={(e) => updateClassAndGroup(e.target.value as TargetClass, currentGroup)}
              className="appearance-none bg-white text-[#0b1c30] text-xs sm:text-sm font-semibold pl-3 pr-8 py-2 rounded-lg border border-[#c3c6d7]/60 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer"
            >
              <option value="9th">Class 9th</option>
              <option value="10th">Class 10th (Matric)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 text-[#737686] pointer-events-none text-[18px]">
              keyboard_arrow_down
            </span>
          </div>

          {/* Group Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dae2fd] text-[#131b2e] text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
              {currentGroup === 'biology' ? 'biotech' : 'terminal'}
            </span>
            <span>
              {currentGroup === 'biology' ? 'Science (Bio Group)' : 'Science (CS Group)'}
            </span>
          </div>

          {/* Category Tabs */}
          <div className="inline-flex p-1 rounded-lg bg-[#e5eeff]">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-white text-[#004ac6] shadow-xs'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              All Subjects
            </button>
            <button
              onClick={() => setCategoryFilter('elective')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                categoryFilter === 'elective'
                  ? 'bg-white text-[#004ac6] shadow-xs'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              Science Electives
            </button>
            <button
              onClick={() => setCategoryFilter('compulsory')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                categoryFilter === 'compulsory'
                  ? 'bg-white text-[#004ac6] shadow-xs'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              Compulsory
            </button>
          </div>
        </div>
      </div>

      {/* Subject Cards Horizontal Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {visibleSubjects.map((sub) => {
          const isSelected = sub.id === activeSubjectId;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubjectId(sub.id);
                if (sub.chapters.length > 0) {
                  setActiveChapterId(sub.chapters[0].id);
                  setActiveTopicIndex(0);
                }
              }}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#2563eb] ring-2 ring-[#2563eb] shadow-sm'
                  : 'bg-white border-[#c3c6d7]/40 hover:bg-[#f8f9ff] hover:border-[#c3c6d7]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? '#dbe1ff' : '#eff4ff',
                    color: sub.color,
                  }}
                >
                  <span className="material-symbols-outlined text-[19px]">{sub.iconName}</span>
                </div>
                {isSelected ? (
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                ) : (
                  <span className="text-[10px] text-[#737686] font-medium">Ch {sub.chapters[0]?.number || 1}</span>
                )}
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#0b1c30] truncate">{sub.name}</span>
              <span className="text-[11px] text-[#737686] mt-0.5 truncate">
                {sub.chaptersCount} Chapters • {sub.boardName}
              </span>
              <div className="w-full bg-[#dce9ff] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${sub.completedPercentage}%`,
                    backgroundColor: isSelected ? '#2563eb' : '#737686',
                  }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Study Material Workspace (Split layout: Chapters list on left + Textbook reader on right) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column: Chapters and Topics Sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          {/* Chapter selector container */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#c3c6d7]/30">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#c3c6d7]/20">
              <div>
                <h2 className="font-bold text-sm text-[#0b1c30]">{activeSubject.name} — Chapters</h2>
                <span className="text-[11px] text-[#737686]">{activeSubject.boardName}</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#dce9ff] text-[#004ac6]">
                Class {activeSubject.classLevel === '9th' ? 'IX' : 'X'}
              </span>
            </div>

            <div className="space-y-2.5">
              {activeSubject.chapters.map((ch) => {
                const isSelected = ch.id === activeChapterId;
                const bookmarked = bookmarks.includes(ch.id);
                return (
                  <div
                    key={ch.id}
                    className={`p-3 rounded-lg transition-colors border ${
                      isSelected
                        ? 'bg-[#eff4ff] border-[#2563eb] ring-1 ring-[#2563eb]'
                        : 'bg-[#f8f9ff] border-[#c3c6d7]/30 hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => {
                          setActiveChapterId(ch.id);
                          setActiveTopicIndex(0);
                        }}
                        className="text-left font-semibold text-xs sm:text-sm text-[#0b1c30] hover:text-[#004ac6] flex-1 leading-snug"
                      >
                        Ch {ch.number}: {ch.title}
                      </button>
                      <button
                        onClick={() => toggleBookmark(ch.id)}
                        className={`p-0.5 rounded hover:bg-white text-[16px] transition-colors ${
                          bookmarked ? 'text-[#2563eb]' : 'text-[#737686]'
                        }`}
                        title="Bookmark Chapter"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {bookmarked ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-1 border-t border-[#c3c6d7]/20 text-xs">
                      <button
                        onClick={() => {
                          setActiveChapterId(ch.id);
                          setViewMode('reader');
                        }}
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          isSelected && viewMode === 'reader'
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-white text-[#434655] hover:bg-[#dce9ff]'
                        }`}
                      >
                        Read
                      </button>
                      <button
                        onClick={() => {
                          setActiveChapterId(ch.id);
                          setViewMode('notes');
                        }}
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          isSelected && viewMode === 'notes'
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-white text-[#434655] hover:bg-[#dce9ff]'
                        }`}
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => onStartQuiz(activeSubject.id, ch.id)}
                        className="px-2 py-0.5 rounded text-xs font-semibold bg-white text-[#004ac6] hover:bg-[#dce9ff]"
                      >
                        Quiz
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#c3c6d7]/20 flex items-center justify-between text-xs text-[#737686]">
              <span>Overall Chapter Mastery</span>
              <span className="font-bold text-[#0b1c30]">{activeChapter?.masteryPercentage || 50}%</span>
            </div>
          </div>

          {/* Topic Index for currently active chapter */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#c3c6d7]/30">
            <h3 className="font-bold text-xs text-[#0b1c30] uppercase tracking-wider mb-2">
              Topic Index (Ch {activeChapter?.number})
            </h3>
            <ul className="space-y-1 text-xs">
              {activeChapter?.topics.map((top, idx) => {
                const isSelected = activeTopicIndex === idx;
                return (
                  <li
                    key={top.id}
                    onClick={() => setActiveTopicIndex(idx)}
                    className={`flex items-center justify-between py-1.5 px-2 rounded cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#eff4ff] text-[#004ac6] font-semibold'
                        : 'text-[#434655] hover:bg-[#f8f9ff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="truncate">
                      {top.number} {top.title}
                    </span>
                    {isSelected ? (
                      <span className="text-[10px] uppercase font-bold text-[#004ac6] ml-2 shrink-0">
                        Reading
                      </span>
                    ) : top.completed ? (
                      <span className="material-symbols-outlined text-[16px] text-[#004ac6] shrink-0 ml-2">
                        check_circle
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-[#737686] shrink-0 ml-2">
                        radio_button_unchecked
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Column: Textbook Reader Workspace */}
        <div className="flex-1 w-full min-w-0 bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Top Reader Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#c3c6d7]/20">
              <div className="flex items-center gap-1.5 text-xs text-[#737686] truncate">
                <span className="text-[#0b1c30] font-semibold">{activeSubject.name}</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-[#0b1c30]">
                  Chapter {activeChapter?.number}: {activeChapter?.title}
                </span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-semibold text-[#004ac6] truncate">
                  Section {activeChapter?.topics[activeTopicIndex]?.number || '2.3'}:{' '}
                  {activeChapter?.topics[activeTopicIndex]?.title || 'Scalars and Vectors'}
                </span>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => (z === 100 ? 115 : z === 115 ? 130 : 100))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  <span>{zoomLevel}%</span>
                </button>

                <button
                  type="button"
                  onClick={() => activeChapter && toggleBookmark(activeChapter.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isCurrentChapterBookmarked
                      ? 'bg-[#dbe1ff] text-[#004ac6] font-semibold'
                      : 'bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isCurrentChapterBookmarked ? 'bookmark' : 'bookmark_border'}
                  </span>
                  <span>{isCurrentChapterBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onOpenAIAssistant(
                      `Explain ${activeSubject.name} Chapter ${activeChapter?.number} (${activeChapter?.topics[activeTopicIndex]?.title}) according to BISE Sindh Board pattern.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#dbe1ff] text-[#004ac6] hover:bg-[#c4e7ff] text-xs font-bold transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                    auto_awesome
                  </span>
                  <span>Ask AI About This Chapter</span>
                </button>
              </div>
            </div>

            {/* Reading Content Area */}
            {viewMode === 'notes' ? (
              /* Structured Summary Notes View */
              <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded bg-[#dae2fd] text-[#131b2e] font-bold">
                      EXAM SUMMARY NOTES
                    </span>
                    <span className="text-xs text-[#737686]">STBB Syllabus Review</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0b1c30]">
                    Chapter {activeChapter?.number}: {activeChapter?.title} — Key Takeaways
                  </h2>
                </div>

                <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#c3c6d7]/30 space-y-2 text-xs leading-relaxed text-[#0b1c30]">
                  <p className="font-semibold text-sm text-[#004ac6]">
                    High-Yield Sindh Board Concepts for Section-B & Section-C:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-[#434655]">
                    <li>
                      <strong>Definitions:</strong> Rest, Uniform Motion, Velocity, Acceleration, and
                      Scalar vs Vector distinction.
                    </li>
                    <li>
                      <strong>Derivations:</strong> Mathematical proof of the three equations of
                      motion: <code className="bg-white px-1.5 py-0.5 rounded font-mono">vf = vi + at</code>,{' '}
                      <code className="bg-white px-1.5 py-0.5 rounded font-mono">S = vit + ½at²</code>, and{' '}
                      <code className="bg-white px-1.5 py-0.5 rounded font-mono">2aS = vf² - vi²</code>.
                    </li>
                    <li>
                      <strong>Graph Analysis:</strong> The gradient of a distance-time graph yields
                      speed, and the area under a speed-time graph yields total displacement covered.
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onStartQuiz(activeSubject.id, activeChapter?.id || '')}
                    className="px-4 py-2 bg-[#2563eb] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#004ac6] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">quiz</span>
                    <span>Practice Chapter MCQs Now</span>
                  </button>
                  <button
                    onClick={() => setViewMode('reader')}
                    className="px-4 py-2 bg-[#eff4ff] text-[#0b1c30] text-xs font-semibold rounded-lg hover:bg-[#dce9ff]"
                  >
                    Switch to Full Textbook Reader
                  </button>
                </div>
              </div>
            ) : (
              /* Textbook Reader View */
              <div
                className="max-w-3xl space-y-6"
                style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#e5eeff] text-[#565e74] font-bold">
                      SECTION {activeChapter?.topics[activeTopicIndex]?.number || '2.3'}
                    </span>
                    <span className="text-xs text-[#737686]">BISE Sindh Matriculation Reference</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">
                    {activeChapter?.topics[activeTopicIndex]?.number || '2.3'}{' '}
                    {activeChapter?.topics[activeTopicIndex]?.title || 'Scalars and Vectors'}
                  </h2>
                </div>

                <p className="text-base text-[#434655] leading-relaxed">
                  In physics, physical quantities are grouped into two fundamental categories depending
                  on whether they can be fully defined by a numerical value with an appropriate unit,
                  or require directional specification in coordinate space.
                </p>

                {/* Standard Board Definition (BISE) Box */}
                <div className="rounded-r-xl bg-[#eff4ff] p-4 sm:p-5 pl-5 relative overflow-hidden border-l-4 border-[#2563eb]">
                  <div className="flex items-center gap-2 mb-2 text-[#004ac6]">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="text-xs uppercase tracking-wider font-bold">
                      Standard Board Definition (BISE Sindh)
                    </span>
                  </div>
                  <p className="text-sm text-[#0b1c30] leading-relaxed">
                    <span className="font-bold text-[#004ac6]">Scalar Quantity:</span> A physical
                    quantity which is described completely by its magnitude and proper unit.
                  </p>
                  <p className="text-sm text-[#0b1c30] leading-relaxed mt-2.5">
                    <span className="font-bold text-[#004ac6]">Vector Quantity:</span> A physical
                    quantity which is described completely by both magnitude, proper unit, and a
                    specific direction.
                  </p>
                </div>

                {/* Geometric Vector Diagram */}
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-[#0b1c30]">
                    Geometric Representation of Vectors
                  </h3>
                  <p className="text-sm text-[#434655] leading-relaxed">
                    Graphically, a vector is represented by a straight directed line segment. The
                    length of the line shows its magnitude according to an arbitrary scale, and the
                    arrowhead specifies its direction.
                  </p>
                  <div className="p-6 rounded-xl bg-[#eff4ff] flex flex-col items-center justify-center border border-[#c3c6d7]/30">
                    <svg
                      className="w-full max-w-lg text-[#737686]"
                      fill="none"
                      viewBox="0 0 540 180"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                        x1="40"
                        x2="500"
                        y1="140"
                        y2="140"
                      ></line>
                      <line
                        stroke="currentColor"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                        x1="40"
                        x2="40"
                        y1="140"
                        y2="20"
                      ></line>
                      <text className="text-[12px] font-semibold" fill="currentColor" x="505" y="144">
                        X
                      </text>
                      <text className="text-[12px] font-semibold" fill="currentColor" x="36" y="15">
                        Y
                      </text>
                      <text className="text-[12px]" fill="currentColor" x="25" y="158">
                        O (Origin)
                      </text>
                      <path
                        d="M40 140 L 360 50"
                        stroke="#2563eb"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      ></path>
                      <polygon fill="#2563eb" points="360,50 340,53 350,66"></polygon>
                      <path
                        d="M 100 140 A 60 60 0 0 0 94 125"
                        fill="none"
                        stroke="#005b7c"
                        strokeWidth="1.5"
                      ></path>
                      <text className="text-[13px] font-bold" fill="#005b7c" x="110" y="130">
                        θ = 25°
                      </text>
                      <rect fill="#ffffff" height="24" rx="4" width="140" x="180" y="70"></rect>
                      <text className="text-[12px] font-bold" fill="#004ac6" x="190" y="86">
                        Vector A (Magnitude |A|)
                      </text>
                    </svg>
                    <span className="text-xs text-[#737686] mt-2 text-center">
                      Figure 2.6: Coordinate angle representation of a displacement vector in 2D
                      Cartesian plane
                    </span>
                  </div>
                </div>

                {/* Distinction Table (Matric Examination Format) */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base text-[#0b1c30]">
                    Distinction Table (Matric Examination Format)
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-[#c3c6d7]/30">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#eff4ff] text-[#0b1c30]">
                          <th className="py-2.5 px-4 font-bold border-b border-[#c3c6d7]/30">
                            Parameter
                          </th>
                          <th className="py-2.5 px-4 font-bold border-b border-[#c3c6d7]/30">
                            Scalar Quantity
                          </th>
                          <th className="py-2.5 px-4 font-bold border-b border-[#c3c6d7]/30">
                            Vector Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c3c6d7]/20 bg-white">
                        <tr className="hover:bg-[#f8f9ff]">
                          <td className="py-2.5 px-4 font-semibold text-[#0b1c30]">
                            Specification Requirement
                          </td>
                          <td className="py-2.5 px-4 text-[#434655]">Magnitude & suitable unit only</td>
                          <td className="py-2.5 px-4 text-[#434655]">
                            Magnitude, unit, and definite direction
                          </td>
                        </tr>
                        <tr className="hover:bg-[#f8f9ff]">
                          <td className="py-2.5 px-4 font-semibold text-[#0b1c30]">Change Condition</td>
                          <td className="py-2.5 px-4 text-[#434655]">
                            Changes only if numerical value changes
                          </td>
                          <td className="py-2.5 px-4 text-[#434655]">
                            Changes with magnitude, direction, or both
                          </td>
                        </tr>
                        <tr className="hover:bg-[#f8f9ff]">
                          <td className="py-2.5 px-4 font-semibold text-[#0b1c30]">Arithmetic Rules</td>
                          <td className="py-2.5 px-4 text-[#434655]">
                            Follows ordinary algebra (2kg + 3kg = 5kg)
                          </td>
                          <td className="py-2.5 px-4 text-[#434655]">
                            Follows vector algebra (Head-to-Tail rule)
                          </td>
                        </tr>
                        <tr className="hover:bg-[#f8f9ff]">
                          <td className="py-2.5 px-4 font-semibold text-[#0b1c30]">
                            Key Examples (Sindh Board)
                          </td>
                          <td className="py-2.5 px-4 text-[#434655]">
                            Mass, Speed, Distance, Work, Time, Temperature
                          </td>
                          <td className="py-2.5 px-4 text-[#434655]">
                            Displacement, Velocity, Force, Momentum, Torque
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Pagination / Next-Prev Navigation */}
          <div className="mt-8 pt-4 border-t border-[#c3c6d7]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              disabled={activeTopicIndex === 0}
              onClick={() => setActiveTopicIndex((i) => Math.max(0, i - 1))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-semibold transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Previous Topic</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#737686]">
              <span>Topic</span>
              <span className="font-bold text-[#0b1c30]">{activeTopicIndex + 1}</span>
              <span>of {activeChapter?.topics.length || 6}</span>
              <span className="ml-2 px-2 py-0.5 rounded bg-[#e5eeff] text-[#565e74] font-semibold">
                Sec {activeChapter?.topics[activeTopicIndex]?.number || '2.3'}
              </span>
            </div>

            <button
              type="button"
              disabled={!activeChapter || activeTopicIndex >= activeChapter.topics.length - 1}
              onClick={() =>
                setActiveTopicIndex((i) =>
                  activeChapter ? Math.min(activeChapter.topics.length - 1, i + 1) : i
                )
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-40"
            >
              <span>Next Topic</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
