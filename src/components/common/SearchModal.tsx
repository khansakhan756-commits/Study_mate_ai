import React, { useState, useEffect } from 'react';
import { Subject, ActiveTab } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onNavigateToTopic: (subjectId: string, chapterId: string, tab?: ActiveTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onNavigateToTopic,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten searchable topics
  const searchResults: {
    subjectName: string;
    subjectId: string;
    chapterNumber: number;
    chapterTitle: string;
    chapterId: string;
    topicTitle: string;
    topicNumber: string;
  }[] = [];

  if (query.trim().length > 1) {
    const q = query.toLowerCase();
    subjects.forEach((sub) => {
      sub.chapters.forEach((ch) => {
        // match chapter
        if (ch.title.toLowerCase().includes(q)) {
          searchResults.push({
            subjectName: sub.name,
            subjectId: sub.id,
            chapterNumber: ch.number,
            chapterTitle: ch.title,
            chapterId: ch.id,
            topicTitle: ch.title,
            topicNumber: `Ch ${ch.number}`,
          });
        }
        // match topics
        ch.topics.forEach((t) => {
          if (t.title.toLowerCase().includes(q)) {
            searchResults.push({
              subjectName: sub.name,
              subjectId: sub.id,
              chapterNumber: ch.number,
              chapterTitle: ch.title,
              chapterId: ch.id,
              topicTitle: t.title,
              topicNumber: t.number,
            });
          }
        });
      });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#c3c6d7]/50 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-[#c3c6d7]/30 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#2563eb] text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, equations, definitions, chapters..."
            className="w-full text-sm text-[#0b1c30] placeholder:text-[#737686] outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="text-xs text-[#737686] hover:text-[#0b1c30] px-2 py-1 bg-[#eff4ff] rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim().length <= 1 ? (
            <div className="p-4 text-center">
              <p className="text-xs text-[#737686] mb-3">Popular Searches in BISE Sindh Syllabus:</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Scalars and Vectors', 'Kinematics Equations', "Newton's Laws", 'Mole Concept', 'Mitochondria'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs px-2.5 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004ac6] rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.slice(0, 8).map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onNavigateToTopic(res.subjectId, res.chapterId, 'study-material');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg hover:bg-[#eff4ff] cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-md bg-[#dce9ff] text-[#2563eb] flex items-center justify-center text-xs font-semibold shrink-0">
                      {res.topicNumber}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-[#0b1c30] group-hover:text-[#2563eb] truncate">
                        {res.topicTitle}
                      </p>
                      <p className="text-[11px] text-[#737686] truncate">
                        {res.subjectName} • Chapter {res.chapterNumber}: {res.chapterTitle}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#737686] text-[16px] group-hover:text-[#2563eb] shrink-0">
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#737686]">
              No syllabus topics matching "{query}". Try checking your spelling or search by chapter name.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
