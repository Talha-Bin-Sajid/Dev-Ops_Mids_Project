export interface GameState {
  currentQuestionIndex: number;
  lives: number;
  score: number;
  questionsAnswered: number;
  isGameOver: boolean;
  timeRemaining: number;
}

export interface GameStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  finalScore: number;
  performance: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  category: string;
  difficulty: string;
}