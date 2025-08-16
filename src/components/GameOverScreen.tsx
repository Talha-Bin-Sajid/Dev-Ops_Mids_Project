import React from 'react';
import { Trophy, RotateCcw, Target, Award, Crown, Home } from 'lucide-react';
import { GameStats } from '../types';

interface GameOverScreenProps {
  stats: GameStats;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ 
  stats, 
  highScore, 
  isNewHighScore,
  onRestart, 
  onBackToMenu 
}) => {
  const totalQuestions = stats.totalQuestions || 0;
  const correctAnswers = stats.correctAnswers || 0;
  const wrongAnswers = stats.wrongAnswers || 0;
  const finalScore = stats.finalScore || 0;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "DevOps Legend! 🚀";
    if (percentage >= 80) return "DevOps Expert! ⚡";
    if (percentage >= 70) return "DevOps Pro! 💪";
    if (percentage >= 60) return "DevOps Ninja! 🥷";
    if (percentage >= 50) return "DevOps Survivor! 🛡️";
    return "Training Required! 📚";
  };

  const getPerformanceColor = () => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="text-center space-y-8">
      <pre className="text-green-400 text-sm">
{`
╔══════════════════════════════════════╗
║            MISSION COMPLETE          ║
╚══════════════════════════════════════╝
`}
      </pre>

      <div className={`${getPerformanceColor()} text-3xl font-bold`}>
        {getPerformanceMessage()}
      </div>

      {/* High Score Celebration */}
      {isNewHighScore && (
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 animate-pulse">
          <div className="text-yellow-300 font-bold flex items-center justify-center">
            <Crown className="mr-2" size={20} />
            NEW HIGH SCORE! 🏆
            <Crown className="ml-2" size={20} />
          </div>
          {highScore > 0 && (
            <div className="text-sm mt-1">You beat your previous record of {highScore - stats.finalScore} points!</div>
          )}
        </div>
      )}

      {/* Stats Panel */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-green-400 mb-4">
          <Trophy className="inline-block mr-2" />
          MISSION STATISTICS
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="bg-gray-700 p-4 rounded border border-gray-600">
            <div className="text-blue-400 flex items-center justify-center">
              <Target className="mr-2" size={20} />
              <span className="font-bold">{finalScore}</span>
            </div>
            <div className="text-gray-400 text-sm">Final Score</div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded border border-gray-600">
            <div className="text-purple-400 flex items-center justify-center">
              <Award className="mr-2" size={20} />
              <span className="font-bold">{percentage}%</span>
            </div>
            <div className="text-gray-400 text-sm">Accuracy</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold">{correctAnswers}</div>
            <div className="text-gray-400">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-xl font-bold">{wrongAnswers}</div>
            <div className="text-gray-400">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-xl font-bold">{highScore}</div>
            <div className="text-gray-400">High Score</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600">
        <div 
          className={`h-4 rounded-full transition-all duration-1000 ${
            percentage >= 80 ? 'bg-green-400' : percentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Motivational Messages */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
        <div className="text-green-400 text-sm">
          {correctAnswers === totalQuestions 
            ? "FLAWLESS VICTORY! You've mastered the art of DevOps! 🎯"
            : correctAnswers >= totalQuestions * 0.8
            ? "EXCELLENT WORK! Your DevOps skills are strong! 💪"
            : correctAnswers >= totalQuestions * 0.6
            ? "GOOD JOB! Keep practicing to become a DevOps master! 📈"
            : "KEEP LEARNING! Every expert was once a beginner! 🚀"
          }
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-2 rounded-lg 
                     transform hover:scale-105 transition-all duration-200 shadow-lg
                     border-2 border-green-400 hover:border-green-300"
        >
          <RotateCcw className="inline-block mr-2" size={18} />
          RESTART
        </button>
        <button
          onClick={onBackToMenu}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-6 py-2 rounded-lg 
                     transform hover:scale-105 transition-all duration-200 shadow-lg
                     border-2 border-gray-400 hover:border-gray-300"
        >
          <Home className="inline-block mr-2" size={18} />
          MAIN MENU
        </button>
      </div>
    </div>
  );
};