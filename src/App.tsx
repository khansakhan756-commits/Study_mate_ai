import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActiveTab, NotificationItem, ExamResultSummary } from './types';
import { apiService } from './services/apiService';
import { AuthScreen } from './components/auth/AuthScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SearchModal } from './components/common/SearchModal';
import { NotificationsPopover } from './components/common/NotificationsPopover';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudyMaterial } from './components/study/StudyMaterial';
import { AIAssistant } from './components/ai/AIAssistant';
import { QuizzesAndMCQs } from './components/quizzes/QuizzesAndMCQs';
import { MockExam } from './components/mock/MockExam';
import { ProgressAndResults } from './components/progress/ProgressAndResults';
import { Settings } from './components/settings/Settings';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Physics Mock Exam (SSC-I) Evaluated',
    description: 'Score: 82% (Grade A-1). 1 question flagged for syllabus review.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'exam',
  },
  {
    id: 'n2',
    title: 'New Chemistry Ch 2 Revision Notes Published',
    description: 'STBB Jamshoro approved model questions added to syllabus bank.',
    timestamp: 'Yesterday',
    isRead: false,
    type: 'academic',
  },
  {
    id: 'n3',
    title: 'BISE Sindh Annual Exam Schedule Notice',
    description: 'SSC Part I and Part II annual examination forms registration open.',
    timestamp: '3 days ago',
    isRead: true,
    type: 'system',
  },
];

const MainApp: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Cross-navigation context parameters
  const [selectedSubjectToStudy, setSelectedSubjectToStudy] = useState<string | undefined>();
  const [selectedChapterToStudy, setSelectedChapterToStudy] = useState<string | undefined>();
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState<string | undefined>();
  const [latestExamResult, setLatestExamResult] = useState<ExamResultSummary | undefined>();

  // If not authenticated, render Authentication screen
  if (!isAuthenticated || !currentUser) {
    return <AuthScreen />;
  }

  // If logged in as Admin, render institutional admin portal
  if (currentUser.role === 'admin') {
    return <AdminDashboard />;
  }

  // Current filtered subjects for student
  const studentSubjects = apiService.getSubjects(currentUser.targetClass, currentUser.studyGroup);

  const handleSelectChapterToRead = (subjectId: string, chapterId: string) => {
    setSelectedSubjectToStudy(subjectId);
    setSelectedChapterToStudy(chapterId);
    setActiveTab('study-material');
  };

  const handleOpenAIAssistantWithPrompt = (prompt?: string) => {
    setAiAssistantPrompt(prompt);
    setActiveTab('ai-assistant');
  };

  const handleStartQuizFromTopic = (subjectId: string, chapterId: string) => {
    setSelectedSubjectToStudy(subjectId);
    setSelectedChapterToStudy(chapterId);
    setActiveTab('quizzes-and-mcqs');
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* Persistent Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Layout Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(!notificationsOpen)}
          unreadCount={unreadCount}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Notifications Dropdown Popover */}
        <NotificationsPopover
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllRead}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          subjects={studentSubjects}
          onNavigateToTopic={(subId, chId, tab) => {
            setSelectedSubjectToStudy(subId);
            setSelectedChapterToStudy(chId);
            setActiveTab(tab || 'study-material');
          }}
        />

        {/* Main Routed Content Viewport */}
        <main className="w-full pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              subjects={studentSubjects}
              onSelectChapterToRead={handleSelectChapterToRead}
            />
          )}

          {activeTab === 'study-material' && (
            <StudyMaterial
              subjects={studentSubjects}
              selectedSubjectId={selectedSubjectToStudy}
              selectedChapterId={selectedChapterToStudy}
              onOpenAIAssistant={handleOpenAIAssistantWithPrompt}
              onStartQuiz={handleStartQuizFromTopic}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AIAssistant
              initialPrompt={aiAssistantPrompt}
              onStartQuizWithTopic={() => setActiveTab('quizzes-and-mcqs')}
            />
          )}

          {activeTab === 'quizzes-and-mcqs' && (
            <QuizzesAndMCQs
              subjects={studentSubjects}
              initialSubjectId={selectedSubjectToStudy}
              initialChapterId={selectedChapterToStudy}
              setActiveTab={setActiveTab}
              onNavigateToMockExam={() => setActiveTab('mock-exam')}
            />
          )}

          {activeTab === 'mock-exam' && (
            <MockExam
              setActiveTab={setActiveTab}
              onExamSubmitted={(result) => setLatestExamResult(result)}
            />
          )}

          {activeTab === 'progress-and-analytics' && (
            <ProgressAndResults
              latestResult={latestExamResult}
              setActiveTab={setActiveTab}
              onNavigateToStudyTopic={handleSelectChapterToRead}
              onNavigateToQuizTopic={handleStartQuizFromTopic}
              onAskAIAboutQuestion={handleOpenAIAssistantWithPrompt}
            />
          )}

          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
