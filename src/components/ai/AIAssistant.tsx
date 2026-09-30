import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChatSession, ChatMessage } from '../../types';
import { apiService } from '../../services/apiService';

interface AIAssistantProps {
  initialPrompt?: string;
  onStartQuizWithTopic?: (topic: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  initialPrompt,
  onStartQuizWithTopic,
}) => {
  const { currentUser } = useAuth();
  const currentClass = currentUser?.targetClass || '9th';
  const currentGroup = currentUser?.studyGroup || 'biology';

  const [sessions, setSessions] = useState<ChatSession[]>(() => apiService.getChatSessions());
  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || 'chat-1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ||
    sessions[0] || {
      id: 'default',
      title: 'New Study Session',
      createdAt: 'Today',
      icon: 'chat_bubble',
      messages: [],
    };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages, isTyping]);

  // Handle incoming initialPrompt if navigated from Study Material or Results
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
    };

    // Append user message immediately
    const updatedMessages = [...activeSession.messages, userMessage];
    const updatedSession = { ...activeSession, messages: updatedMessages };
    const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));

    setSessions(updatedSessions);
    apiService.saveChatSessions(updatedSessions);
    setInputText('');
    setAttachedImageName(null);
    setIsTyping(true);

    try {
      const response = await apiService.askAIAssistant(text, currentClass, currentGroup);
      const withAssistant = [...updatedMessages, response];
      const finalizedSession = {
        ...activeSession,
        title:
          activeSession.messages.length === 0
            ? text.slice(0, 30) + '...'
            : activeSession.title,
        messages: withAssistant,
      };

      const finalSessions = sessions.map((s) =>
        s.id === activeSession.id ? finalizedSession : s
      );
      setSessions(finalSessions);
      apiService.saveChatSessions(finalSessions);
    } catch {
      // Graceful fallback
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Unable to query the syllabus service at this moment. Please try again.',
        citation: 'BISE Sindh Curriculum Assistant',
      };
      const withError = [...updatedMessages, errorMsg];
      const finalizedSession = { ...activeSession, messages: withError };
      const finalSessions = sessions.map((s) =>
        s.id === activeSession.id ? finalizedSession : s
      );
      setSessions(finalSessions);
      apiService.saveChatSessions(finalSessions);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: 'chat-' + Date.now(),
      title: 'New Study Topic',
      createdAt: 'Just now',
      icon: 'chat_bubble',
      messages: [],
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
    apiService.saveChatSessions(updated);
  };

  const clearCurrentSession = () => {
    const cleared = { ...activeSession, messages: [] };
    const updated = sessions.map((s) => (s.id === activeSession.id ? cleared : s));
    setSessions(updated);
    apiService.saveChatSessions(updated);
  };

  const copyToClipboard = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopySuccessId(msgId);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  const toggleMessageBookmark = (msgId: string) => {
    const updatedMessages = activeSession.messages.map((m) =>
      m.id === msgId ? { ...m, isBookmarked: !m.isBookmarked } : m
    );
    const updatedSession = { ...activeSession, messages: updatedMessages };
    const updatedSessions = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    setSessions(updatedSessions);
    apiService.saveChatSessions(updatedSessions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedImageName(e.target.files[0].name);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-6.5rem)]">
      <div className="flex flex-row flex-1 w-full bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 overflow-hidden">
        {/* Left Chat Session Sub-sidebar */}
        <aside className="w-64 sm:w-72 bg-white border-r border-[#c3c6d7]/30 flex flex-col justify-between p-4 select-none shrink-0 hidden md:flex">
          <div className="flex flex-col gap-4">
            {/* New Chat Trigger */}
            <button
              onClick={createNewChat}
              className="w-full bg-[#eff4ff] text-[#004ac6] hover:bg-[#dce9ff] transition-colors py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 group shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-90">
                add
              </span>
              <span>New Chat</span>
            </button>

            {/* Sessions Category */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-[11px] text-[#737686] uppercase tracking-wider font-semibold">
                  Recent Chats
                </span>
                <span className="text-[10px] text-[#565e74] bg-[#e5eeff] px-1.5 py-0.5 rounded font-bold">
                  {sessions.length}
                </span>
              </div>
              <div className="space-y-1">
                {sessions.map((s) => {
                  const isActive = s.id === activeSession.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all group ${
                        isActive
                          ? 'bg-[#eff4ff] text-[#004ac6] font-semibold border border-[#2563eb]/30'
                          : 'text-[#434655] hover:bg-[#f8f9ff] hover:text-[#0b1c30]'
                      }`}
                      type="button"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] shrink-0 ${
                          isActive ? 'text-[#004ac6]' : 'text-[#737686]'
                        }`}
                      >
                        {s.icon || 'chat_bubble'}
                      </span>
                      <span className="truncate flex-1">{s.title}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pinned Syllabi Filters */}
            <div className="mt-2 bg-[#eff4ff]/60 p-3 rounded-lg border border-[#c3c6d7]/30">
              <span className="text-[11px] text-[#565e74] uppercase tracking-wider block mb-1 font-semibold">
                Active Syllabus Scope
              </span>
              <div className="flex items-center gap-1.5 text-[#0b1c30] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
                  verified
                </span>
                <span>BISE Sindh Curriculum 2024</span>
              </div>
            </div>
          </div>

          {/* Syllabus Compliance Footer Badge */}
          <div className="pt-4">
            <div className="flex items-start gap-2 p-3 bg-[#eff4ff] rounded-lg border border-[#c3c6d7]/30">
              <span className="material-symbols-outlined text-[16px] text-[#004ac6] shrink-0 mt-0.5">
                menu_book
              </span>
              <p className="text-[11px] text-[#565e74] leading-snug">
                Grounded strictly in <strong className="text-[#0b1c30]">BISE Sindh</strong> official
                textbooks and matriculation question patterns.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Chat Workspace Canvas */}
        <main className="flex-1 bg-[#f8f9ff] flex flex-col justify-between overflow-hidden">
          {/* Top Assistant Header Bar */}
          <header className="h-14 px-4 sm:px-6 bg-white flex items-center justify-between border-b border-[#c3c6d7]/30 shadow-xs z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2563eb] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <h1 className="font-bold text-sm sm:text-base text-[#0b1c30] tracking-tight">
                  StudyMate Academic Copilot
                </h1>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0"></span>
                Class {currentClass === '10th' ? '10' : '9'} •{' '}
                {currentGroup === 'computer_science' ? 'CS Group' : 'Biology Group'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReferencesModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[#434655] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg text-xs font-semibold transition-colors"
                title="View Source Textbook"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                <span className="hidden sm:inline">Textbook References</span>
              </button>
              <div className="w-px h-4 bg-[#c3c6d7]/40 mx-1"></div>
              <button
                onClick={clearCurrentSession}
                className="p-1.5 text-[#434655] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
                title="Clear current session"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
              </button>
            </div>
          </header>

          {/* Center Dynamic Conversation Viewport */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-start max-w-4xl w-full mx-auto space-y-6">
            {/* Welcome banner when no messages or at start */}
            {activeSession.messages.length === 0 && (
              <div className="text-center pt-8 pb-4 animate-in fade-in duration-200">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#dce9ff] text-[#004ac6] mb-3">
                  <span className="material-symbols-outlined text-[28px]">school</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
                  How can I help you study today?
                </h2>
                <p className="text-xs sm:text-sm text-[#434655] mt-1.5 max-w-lg mx-auto leading-relaxed">
                  Ask questions directly from your BISE Sindh textbooks, numerical derivations, or past
                  5-year Karachi & Hyderabad board exam papers.
                </p>
              </div>
            )}

            {/* Conversation Messages */}
            <div className="space-y-4 w-full">
              {activeSession.messages.map((msg) => {
                if (msg.sender === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end gap-2.5 items-start">
                      <div className="bg-[#2563eb] text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs max-w-lg">
                        <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {currentUser?.fullName.charAt(0) || 'K'}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#004ac6] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">neurology</span>
                      </div>
                      <div className="bg-white rounded-xl p-5 shadow-xs border border-[#c3c6d7]/30 flex-1 max-w-2xl space-y-3">
                        {/* Textbook Citations Stamp */}
                        {msg.citation && (
                          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg w-fit text-[#004ac6] text-xs font-semibold">
                            <span className="material-symbols-outlined text-[16px]">menu_book</span>
                            <span>{msg.citation}</span>
                          </div>
                        )}

                        {/* Answer Exposition Body */}
                        <div className="space-y-2 text-[#0b1c30] text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          <p>{msg.text}</p>

                          {/* Formula and Unit cards if present */}
                          {(msg.formula || msg.siUnit) && (
                            <div className="bg-[#eff4ff] p-3 rounded-lg space-y-1.5 text-xs border border-[#c3c6d7]/20 my-2">
                              {msg.formula && (
                                <div className="flex items-baseline gap-2">
                                  <span className="font-bold text-[#004ac6] min-w-[5rem]">
                                    Formula:
                                  </span>
                                  <span className="font-mono bg-white px-2 py-0.5 rounded text-[#0b1c30] font-semibold border border-[#c3c6d7]/30">
                                    {msg.formula}
                                  </span>
                                </div>
                              )}
                              {msg.siUnit && (
                                <div className="flex items-baseline gap-2">
                                  <span className="font-bold text-[#004ac6] min-w-[5rem]">
                                    SI Unit:
                                  </span>
                                  <span className="text-[#0b1c30]">{msg.siUnit}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {msg.examTip && (
                            <p className="text-xs text-[#565e74] bg-[#fff8e1] p-2 rounded border border-[#ffe082]/60">
                              💡 <span className="font-semibold text-[#856404]">{msg.examTip}</span>
                            </p>
                          )}
                        </div>

                        {/* Micro Interactivity Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#c3c6d7]/20">
                          <button
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-medium transition-colors"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {copySuccessId === msg.id ? 'done' : 'content_copy'}
                            </span>
                            <span>{copySuccessId === msg.id ? 'Copied' : 'Copy Answer'}</span>
                          </button>

                          <button
                            onClick={() => toggleMessageBookmark(msg.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                              msg.isBookmarked
                                ? 'bg-[#dbe1ff] text-[#004ac6] font-semibold'
                                : 'bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30]'
                            }`}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {msg.isBookmarked ? 'bookmark' : 'bookmark_add'}
                            </span>
                            <span>{msg.isBookmarked ? 'Bookmarked' : 'Bookmark for Revision'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (onStartQuizWithTopic) {
                                onStartQuizWithTopic(msg.formula || 'Kinematics');
                              } else {
                                handleSendMessage('Generate 3 BISE Sindh practice MCQs on this concept.');
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2563eb] text-white hover:bg-[#004ac6] text-xs font-semibold transition-colors shadow-xs"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[15px]">quiz</span>
                            <span>Generate 3 Practice MCQs</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2.5 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-[#004ac6] text-white flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-[18px]">neurology</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-xs border border-[#c3c6d7]/30 text-xs text-[#565e74] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-[#2563eb] animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-[#2563eb] animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></span>
                    <span className="ml-1">Grounding answer with Sindh Textbook Board curriculum...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Starter Prompt Chips (shown when chat is short) */}
            {activeSession.messages.length <= 2 && (
              <div className="pt-2">
                <span className="text-[11px] text-[#737686] uppercase tracking-wider block mb-2 px-1 font-semibold">
                  Quick Syllabus Inquiries
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleSendMessage('Explain Kinematics equations simply')}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#eff4ff] border border-[#c3c6d7]/30 transition-all text-left shadow-xs group"
                    type="button"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2563eb] shrink-0 group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                    </div>
                    <span className="text-xs font-semibold text-[#0b1c30] line-clamp-1">
                      Explain Kinematics equations simply
                    </span>
                  </button>

                  <button
                    onClick={() => handleSendMessage('Summarize Chapter 2 Key Concepts')}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#eff4ff] border border-[#c3c6d7]/30 transition-all text-left shadow-xs group"
                    type="button"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2563eb] shrink-0 group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">summarize</span>
                    </div>
                    <span className="text-xs font-semibold text-[#0b1c30] line-clamp-1">
                      Summarize Chapter 2 Key Concepts
                    </span>
                  </button>

                  <button
                    onClick={() => handleSendMessage('Generate 5 Sindh Board MCQs for Chapter 2')}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#eff4ff] border border-[#c3c6d7]/30 transition-all text-left shadow-xs group"
                    type="button"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#2563eb] shrink-0 group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">track_changes</span>
                    </div>
                    <span className="text-xs font-semibold text-[#0b1c30] line-clamp-1">
                      Generate 5 Sindh Board MCQs
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Dock (Pinned to Bottom Canvas) */}
          <footer className="p-4 sm:p-6 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff]/95 to-transparent shrink-0">
            <div className="max-w-3xl mx-auto w-full">
              {attachedImageName && (
                <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-[#dbe1ff] rounded-lg text-xs text-[#004ac6] w-fit">
                  <span className="material-symbols-outlined text-[16px]">attachment</span>
                  <span className="font-medium truncate max-w-xs">{attachedImageName}</span>
                  <button
                    onClick={() => setAttachedImageName(null)}
                    className="hover:text-[#ba1a1a] ml-1 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md border border-[#c3c6d7]/40 p-3 flex flex-col gap-2 focus-within:ring-2 focus-within:ring-[#2563eb]/20">
                {/* Textarea */}
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about your studies, textbooks, or formulas..."
                  className="w-full bg-transparent resize-none p-1 text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#737686] focus:outline-none"
                  rows={2}
                />

                {/* Bottom utility actions & send */}
                <div className="flex items-center justify-between pt-1 border-t border-[#c3c6d7]/20">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 px-2.5 py-1 text-[#434655] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg text-xs font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">attachment</span>
                      <span className="hidden sm:inline">Attach Diagram</span>
                    </button>
                    <div className="h-4 w-px bg-[#c3c6d7]/50 hidden sm:block"></div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-[#eff4ff] text-[#004ac6] rounded-md text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">verified_user</span>
                      <span>Syllabus Mode: Class {currentClass === '10th' ? '10' : '9'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isTyping}
                      aria-label="Send message"
                      className="bg-[#2563eb] hover:bg-[#004ac6] text-white w-9 h-9 rounded-lg flex items-center justify-center transition-transform active:scale-95 shadow-xs disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-2 text-center">
                <span className="text-[11px] text-[#565e74]">
                  Press Enter to send • Verified against Sindh Board curriculum guidelines
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Textbook References Modal */}
      {showReferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-[#c3c6d7]/50 max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/30 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563eb] text-[22px]">
                  auto_stories
                </span>
                <h3 className="text-base font-bold text-[#0b1c30]">STBB Official Curriculum Sources</h3>
              </div>
              <button
                onClick={() => setShowReferencesModal(false)}
                className="text-[#737686] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#434655]">
              <p>
                StudyMate AI grounding is locked to the official publications of the{' '}
                <strong>Sindh Textbook Board (STBB), Jamshoro</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1.5 bg-[#eff4ff] p-3 rounded-xl border border-[#c3c6d7]/30">
                <li>Physics SSC Part I (Class 9) - Jamshoro Curriculum Edition</li>
                <li>Chemistry SSC Part I (Class 9) - STBB 2024 Revised Edition</li>
                <li>Biology SSC Part I (Class 9) - Jamshoro Academic Release</li>
                <li>Computer Science SSC Part I (Class 9) - Department of Education Sindh</li>
                <li>General Mathematics & Compulsory Modules (English, Islamiat)</li>
              </ul>
              <p className="text-[11px] text-[#737686]">
                Answers strictly mirror Section A (MCQs), Section B (Short Answers), and Section C
                (Long Descriptives) marking schemes.
              </p>
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={() => setShowReferencesModal(false)}
                className="px-4 py-2 bg-[#2563eb] text-white text-xs font-semibold rounded-lg"
              >
                Close Reference Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
