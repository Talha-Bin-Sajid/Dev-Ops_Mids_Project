import React, { useState } from 'react';
import { Clock, Heart, Target, Zap } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  lives: number;
  score: number;
  timeRemaining: number;
  consecutiveCorrect: number;
  onAnswer: (selectedAnswer: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  lives,
  score,
  timeRemaining,
  consecutiveCorrect,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [extraLifeEarned, setExtraLifeEarned] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === question.answer;
    if (isCorrect && (consecutiveCorrect + 1) % 5 === 0) {
      setExtraLifeEarned(true);
    }
    
    setTimeout(() => {
      onAnswer(answer);
      setSelectedAnswer('');
      setShowFeedback(false);
      setExtraLifeEarned(false);
    }, 1500);
  };

  const getTimeColor = () => {
    if (timeRemaining <= 5) return 'text-red-400';
    if (timeRemaining <= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getOptionClass = (option: string) => {
    let baseClass = 'w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ';
    
    if (!showFeedback) {
      baseClass += 'border-gray-600 bg-gray-800 hover:border-green-400 hover:bg-gray-700 cursor-pointer';
    } else {
      if (option === question.answer) {
        baseClass += 'border-green-400 bg-green-900 text-green-300';
      } else if (option === selectedAnswer) {
        baseClass += 'border-red-400 bg-red-900 text-red-300';
      } else {
        baseClass += 'border-gray-600 bg-gray-800 text-gray-400';
      }
    }
    
    return baseClass;
  };

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-red-400">
            <Heart className="fill-current" size={20} />
            <span className="font-bold">{lives}</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-400">
            <Target size={20} />
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-400">
            <Zap size={20} />
            <span className="font-bold">{questionNumber}/{totalQuestions}</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <span className="font-bold">Streak: {consecutiveCorrect}</span>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 ${getTimeColor()} font-bold text-xl`}>
          <Clock size={24} />
          <span>{timeRemaining}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-green-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
        <div className="text-yellow-400 text-sm mb-2">
          [{question.category}] QUERY #{questionNumber}
        </div>
        <h2 className="text-xl font-bold text-green-400 mb-6">
          $ {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={getOptionClass(option)}
              disabled={showFeedback}
            >
              <span className="text-gray-400 mr-3">[{String.fromCharCode(65 + index)}]</span>
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-4 p-4 rounded-lg border-l-4 animate-pulse">
            {selectedAnswer === question.answer ? (
              <div className="border-green-400 bg-green-900 text-green-300">
                ✓ CORRECT! System integrity maintained.
              </div>
            ) : (
              <div className="border-red-400 bg-red-900 text-red-300">
                ✗ INCORRECT! Life support compromised. 
                Correct answer: {question.answer}
              </div>
            )}
            {extraLifeEarned && (
              <div className="mt-2 text-green-400 font-bold animate-bounce">
                +1 LIFE! (5 consecutive correct answers)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};