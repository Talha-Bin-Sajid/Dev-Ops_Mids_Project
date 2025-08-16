import React, { useState, useEffect, useRef } from 'react';
import { QuestionCard } from './QuestionCard';
import { GameOverScreen } from './GameOverScreen';
import { Question, GameState, GameStats } from '../types';
import { TimeWarningModal } from './TimeWarningModal';

interface QuizGameProps {
  questions: Question[];
  onBackToMenu: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ questions, onBackToMenu }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    lives: 3,
    score: 0,
    questionsAnswered: 0,
    isGameOver: false,
    timeRemaining: 30,
  });

  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
    performance: '',
  });
  const [highScore, setHighScore] = useState<number>(0);
  const [showTimeWarning, setShowTimeWarning] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const lastActiveTimeRef = useRef<number>(Date.now());

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('devopsQuizHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, [questions]);

  // Timer logic with continuous running
  useEffect(() => {
    if (gameState.isGameOver) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became inactive - store current time
        lastActiveTimeRef.current = Date.now();
      } else {
        // Tab became active - update last active time
        lastActiveTimeRef.current = Date.now();
      }
    };

    const updateTimer = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastActiveTimeRef.current) / 1000);
      lastActiveTimeRef.current = now;

      if (elapsedSeconds > 0) {
        setGameState(prev => {
          const newTimeRemaining = Math.max(0, prev.timeRemaining - elapsedSeconds);
          
          // Show warning when crossing the 10 second threshold
          if (prev.timeRemaining > 10 && newTimeRemaining <= 10) {
            setShowTimeWarning(true);
            setTimeout(() => setShowTimeWarning(false), 1500);
          }

          if (newTimeRemaining <= 0) {
            // Time expired
            const newState = {
              ...prev,
              lives: prev.lives - 1,
              questionsAnswered: prev.questionsAnswered + 1,
              timeRemaining: 30,
            };

            if (newState.lives <= 0 || newState.currentQuestionIndex >= shuffledQuestions.length - 1) {
              return { ...newState, isGameOver: true };
            } else {
              return { ...newState, currentQuestionIndex: prev.currentQuestionIndex + 1 };
            }
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }
    };

    // Start the timer
    timerRef.current = setInterval(updateTimer, 1000);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameState.isGameOver, shuffledQuestions.length]);

  // Calculate final stats when game ends
  useEffect(() => {
    if (gameState.isGameOver) {
      const wrongAnswers = gameState.questionsAnswered - correctAnswersCount;
      const finalScore = gameState.score;

      // Check and update high score
      if (finalScore > highScore) {
        setHighScore(finalScore);
        setIsNewHighScore(true);
        localStorage.setItem('devopsQuizHighScore', finalScore.toString());
      } else {
        setIsNewHighScore(false);
      }

      setGameStats({
        totalQuestions: gameState.questionsAnswered,
        correctAnswers: correctAnswersCount,
        wrongAnswers,
        finalScore,
        performance: getPerformanceLevel(correctAnswersCount, gameState.questionsAnswered),
      });
    }
  }, [gameState.isGameOver, gameState.score, gameState.questionsAnswered, correctAnswersCount, highScore]);

  const getPerformanceLevel = (correct: number, total: number): string => {
    if (total === 0) return "Training Required";
    const percentage = (correct / total) * 100;
    if (percentage >= 90) return "DevOps Legend";
    if (percentage >= 80) return "DevOps Expert";
    if (percentage >= 70) return "DevOps Pro";
    if (percentage >= 60) return "DevOps Ninja";
    if (percentage >= 50) return "DevOps Survivor";
    return "Training Required";
  };

  const handleAnswer = (selectedAnswer: string) => {
    const currentQuestion = shuffledQuestions[gameState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    setGameState(prevState => {
      const newState = {
        ...prevState,
        lives: isCorrect ? prevState.lives : prevState.lives - 1,
        score: isCorrect
          ? prevState.score + 10 + prevState.timeRemaining
          : prevState.score,
        questionsAnswered: prevState.questionsAnswered + 1,
        timeRemaining: 30,
      };

      if (
        newState.lives <= 0 ||
        newState.currentQuestionIndex >= shuffledQuestions.length - 1
      ) {
        return { ...newState, isGameOver: true };
      } else {
        return { ...newState, currentQuestionIndex: prevState.currentQuestionIndex + 1 };
      }
    });
  };

  const handleRestart = () => {
    setGameState({
      currentQuestionIndex: 0,
      lives: 3,
      score: 0,
      questionsAnswered: 0,
      isGameOver: false,
      timeRemaining: 30,
    });

    setCorrectAnswersCount(0);
    setIsNewHighScore(false);
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  };

  if (shuffledQuestions.length === 0) {
    return (
      <div className="text-center text-green-400">
        <div className="animate-spin text-4xl mb-4">⚡</div>
        <div>Initializing survival protocols...</div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <GameOverScreen
        stats={gameStats}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        onRestart={handleRestart}
        onBackToMenu={onBackToMenu}
      />
    );
  }

  return (
    <>
      {showTimeWarning && <TimeWarningModal />}
      <QuestionCard
        question={shuffledQuestions[gameState.currentQuestionIndex]}
        questionNumber={gameState.currentQuestionIndex + 1}
        totalQuestions={shuffledQuestions.length}
        lives={gameState.lives}
        score={gameState.score}
        timeRemaining={gameState.timeRemaining}
        onAnswer={handleAnswer}
      />
    </>
  );
};