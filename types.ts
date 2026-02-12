
export enum Subject {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  MATHEMATICS = 'Mathematics',
  COMPUTER_SCIENCE = 'Computer Science'
}

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of options
  explanation: string;
  analogy: string;
}

export interface Explanation {
  topic: string;
  concept: string;
  analogy: string;
  keyPoints: string[];
  practiceHint: string;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  showResult: boolean;
  userAnswers: (number | null)[];
}

export interface UserStats {
  totalQuestions: number;
  totalCorrect: number;
  examsCompleted: number;
  subjectAttempts: Record<string, number>;
}

export interface UserProfile {
  name: string;
  stats: UserStats;
}
