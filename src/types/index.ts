export type TargetClass = '9th' | '10th';
export type StudyGroup = 'biology' | 'computer_science';
export type UserRole = 'student' | 'admin';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  targetClass: TargetClass;
  studyGroup: StudyGroup;
  registrationNumber?: string;
  avatarUrl?: string;
  joinedDate: string;
}

export interface TopicItem {
  id: string;
  number: string; // e.g. "2.1"
  title: string;
  completed: boolean;
  pageNumber: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  topicsCount: number;
  mcqsCount: number;
  masteryPercentage: number;
  isBookmarked: boolean;
  topics: TopicItem[];
  contentSummary?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  iconName: string;
  color: string;
  classLevel: TargetClass;
  groupRequired?: StudyGroup; // undefined if compulsory for all
  category: 'elective' | 'compulsory';
  boardName: string;
  chaptersCount: number;
  completedPercentage: number;
  currentChapterId?: string;
  chapters: Chapter[];
}

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  number: number;
  subjectId: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionTitle?: string;
  questionText: string;
  hint?: string;
  options: MCQOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  citation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  subjectId: string;
  chapterId: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  date: string;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
}

export interface MockExamState {
  examId: string;
  title: string;
  subjectName: string;
  classLevel: TargetClass;
  totalMarks: number;
  durationMinutes: number;
  questions: Question[];
}

export interface ExamResultSummary {
  id: string;
  examTitle: string;
  date: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  incorrectCount: number;
  timeSpentSeconds: number;
  boardGrade: string;
  diagnosticInsight: string;
  flaggedQuestions: {
    question: Question;
    userAnswer: 'A' | 'B' | 'C' | 'D';
    isCorrect: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citation?: string;
  formula?: string;
  siUnit?: string;
  examTip?: string;
  isBookmarked?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  icon: string;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: 'academic' | 'exam' | 'system';
}

export type ActiveTab =
  | 'dashboard'
  | 'study-material'
  | 'ai-assistant'
  | 'quizzes-and-mcqs'
  | 'mock-exam'
  | 'progress-and-analytics'
  | 'settings';
