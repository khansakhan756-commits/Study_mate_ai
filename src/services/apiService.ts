import {
  StudentProfile,
  TargetClass,
  StudyGroup,
  Subject,
  Chapter,
  Question,
  ExamResultSummary,
  ChatMessage,
  ChatSession,
} from '../types';
import {
  ALL_SUBJECTS,
  PHYSICS_MOCK_QUESTIONS,
  DEFAULT_EXAM_RESULT,
  INITIAL_CHAT_SESSIONS,
} from './curriculumData';

const STORAGE_KEY_USER = 'studymate_user';
const STORAGE_KEY_SESSIONS = 'studymate_chat_sessions';
const STORAGE_KEY_RESULTS = 'studymate_exam_results';
const STORAGE_KEY_BOOKMARKS = 'studymate_bookmarks';

// Default Demo User (matching user reference mockup)
export const DEFAULT_STUDENT: StudentProfile = {
  id: 'std-bise-2024-88',
  fullName: 'Khansa Tariq',
  email: 'student@bise-sindh.edu.pk',
  role: 'student',
  targetClass: '9th',
  studyGroup: 'biology',
  registrationNumber: 'BISE-KHI-2024-91204',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  joinedDate: 'August 2024',
};

export const DEFAULT_ADMIN: StudentProfile = {
  id: 'adm-bise-001',
  fullName: 'Dr. Tariq Siddiqui',
  email: 'admin@school.bise.edu.pk',
  role: 'admin',
  targetClass: '9th',
  studyGroup: 'biology',
  joinedDate: 'January 2023',
};

class ApiService {
  // Current user storage
  getCurrentUser(): StudentProfile | null {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_STUDENT;
      }
    }
    return DEFAULT_STUDENT;
  }

  setCurrentUser(user: StudentProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }

  // Filter subjects strictly according to student Class and Group
  getSubjects(targetClass: TargetClass, studyGroup: StudyGroup): Subject[] {
    return ALL_SUBJECTS.filter((sub) => {
      // Must match class
      if (sub.classLevel !== targetClass) return false;
      // If subject has a group requirement (e.g. bio or cs), verify it matches
      if (sub.groupRequired && sub.groupRequired !== studyGroup) return false;
      return true;
    });
  }

  getSubjectById(subjectId: string): Subject | undefined {
    return ALL_SUBJECTS.find((s) => s.id === subjectId);
  }

  // Bookmarks
  getBookmarks(): string[] {
    const data = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    return data ? JSON.parse(data) : ['phy-9-ch2'];
  }

  toggleBookmark(chapterId: string): boolean {
    const current = this.getBookmarks();
    let updated: string[];
    let isBookmarkedNow: boolean;
    if (current.includes(chapterId)) {
      updated = current.filter((id) => id !== chapterId);
      isBookmarkedNow = false;
    } else {
      updated = [...current, chapterId];
      isBookmarkedNow = true;
    }
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
    return isBookmarkedNow;
  }

  // Chat sessions
  getChatSessions(): ChatSession[] {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CHAT_SESSIONS;
      }
    }
    return INITIAL_CHAT_SESSIONS;
  }

  saveChatSessions(sessions: ChatSession[]) {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }

  // Academic AI response generator (BISE Sindh Textbook Grounded)
  async askAIAssistant(
    query: string,
    targetClass: TargetClass,
    studyGroup: StudyGroup
  ): Promise<ChatMessage> {
    const lower = query.toLowerCase();

    // Check query concepts for authentic curriculum answers
    let citation = 'Sindh Textbook Board Jamshoro • Physics Class 9';
    let text = '';
    let formula: string | undefined;
    let siUnit: string | undefined;
    let examTip: string | undefined;

    if (lower.includes('momentum') || lower.includes('p = mv')) {
      citation = 'Sindh Textbook Board Jamshoro • Physics Class 9, Chapter 3 (Page 52)';
      text =
        'Momentum is defined as the quantity of motion contained in a body. It is equal to the product of mass and velocity of a moving object.';
      formula = 'p = m · v';
      siUnit = 'Kilogram metre per second (kg·m/s) or Newton-second (N·s)';
      examTip =
        'In BISE Sindh Section-B short questions, always state both the formula and its SI unit together to receive full 3 marks.';
    } else if (lower.includes('scalar') || lower.includes('vector')) {
      citation = 'Sindh Textbook Board Jamshoro • Physics Class 9, Chapter 2 (Page 35)';
      text =
        'A Scalar Quantity is completely specified by its magnitude and suitable unit only (e.g., mass, distance, speed). A Vector Quantity requires both magnitude, proper unit, and a specified direction in coordinate space (e.g., displacement, velocity, force, momentum).';
      examTip =
        'When drawing vectors, remember the Head-to-Tail rule is mandatory for graphical addition in Sindh board exams.';
    } else if (lower.includes('equation') || lower.includes('motion') || lower.includes('kinematic')) {
      citation = 'Sindh Textbook Board Jamshoro • Physics Class 9, Chapter 2 (Page 46)';
      text =
        'The three standard equations of motion for uniform acceleration are derived from velocity-time graphs:\n1. vf = vi + a·t\n2. S = vi·t + ½a·t²\n3. 2a·S = vf² - vi²';
      formula = 'S = vi·t + ½a·t²';
      siUnit = 'Distance S in metres (m), acceleration a in m/s²';
      examTip =
        'In numerical problems, explicitly write: Given data, Required, Formula, and Calculation with units.';
    } else if (lower.includes('mitosis') || lower.includes('meiosis') || lower.includes('cell')) {
      citation = 'Sindh Textbook Board Jamshoro • Biology Class 9, Chapter 4 (Page 55)';
      text =
        'Mitosis produces two diploid (2n) genetically identical daughter cells for somatic growth and repair. Meiosis produces four haploid (n) daughter cells with crossing-over genetic recombination for gamete formation.';
      examTip =
        'Label all chromosome stages clearly in diagrams for Section-C long descriptive questions.';
    } else if (lower.includes('mcq') || lower.includes('practice') || lower.includes('quiz')) {
      citation = 'BISE Sindh Matriculation Model Examination Bank';
      text =
        'Here are 3 board-aligned practice items based on your current chapter:\n1. Which quantity is a vector: (A) Speed (B) Work (C) Velocity (D) Mass [Ans: C]\n2. SI unit of acceleration: (A) m/s (B) m/s² (C) N·m (D) kg·m [Ans: B]\n3. Slope of distance-time graph represents: (A) Speed (B) Force (C) Power (D) Work [Ans: A]';
      examTip =
        'Review Section A past 5-year papers to achieve 100% MCQ accuracy.';
    } else {
      citation = `Sindh Textbook Board Jamshoro • Matric Syllabus (Class ${targetClass})`;
      text = `According to the BISE Sindh Board curriculum for Class ${targetClass} (${studyGroup === 'biology' ? 'Biology Group' : 'Computer Science Group'}), "${query}" is grounded in the official STBB textbooks. Study standard definitions, SI units, and chapter summary benchmarks for full examination marks.`;
      examTip =
        'Always structure descriptive answers with main heading, standard definition, mathematical expression, and SI unit.';
    }

    // Small delay to simulate realistic response
    await new Promise((res) => setTimeout(res, 500));

    return {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      citation,
      formula,
      siUnit,
      examTip,
      isBookmarked: false,
    };
  }

  // Results
  getLatestExamResult(): ExamResultSummary {
    const saved = localStorage.getItem(STORAGE_KEY_RESULTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_EXAM_RESULT;
      }
    }
    return DEFAULT_EXAM_RESULT;
  }

  saveExamResult(result: ExamResultSummary) {
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(result));
  }
}

export const apiService = new ApiService();
