import React, { useState } from 'react';
import { Terminal } from './components/Terminal';
import WelcomeScreen from './components/WelcomeScreen'; // Changed to default import
import { QuizGame } from './components/QuizGame';
import { useQuestions } from './hooks/useQuestions';
import { AlertTriangle } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');
  const { questions, loading, error } = useQuestions();

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleBackToMenu = () => {
    setGameState('welcome');
  };

  return (
    <Terminal>
      {loading && (
        <div className="text-center text-green-400 space-y-4">
          <div className="text-4xl animate-pulse">⚡</div>
          <div>Loading DevOps survival protocols...</div>
          <div className="text-sm text-gray-400">Initializing quiz database...</div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 space-y-4">
          <AlertTriangle size={48} className="mx-auto" />
          <div className="text-xl font-bold">SYSTEM ERROR</div>
          <div>Failed to load quiz database: {error}</div>
          <div className="text-sm text-gray-400">
            Please check your connection and refresh the page.
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {gameState === 'welcome' && (
            <WelcomeScreen onStartGame={handleStartGame} />
          )}

          {gameState === 'playing' && (
            <QuizGame 
              questions={questions} 
              onBackToMenu={handleBackToMenu}
            />
          )}
        </>
      )}
    </Terminal>
  );
}

export default App;