import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const WelcomeScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  
  const welcomeText = `
╔══════════════════════════════════════╗
║           SCRIPT SURVIVOR            ║
║        DevOps Survival Quiz          ║
╚══════════════════════════════════════╝

Welcome to the ultimate DevOps challenge!

MISSION BRIEFING:
• You start with 3 lives
• Answer DevOps questions correctly to survive
• Wrong answers cost you a life
• 30 seconds per question
• Achieve the highest score possible

CATEGORIES:
- Linux Commands
- DNS & Networking  
- Git & Version Control
- DevOps Tools & Concepts

Are you ready to prove your DevOps skills?`;

  useEffect(() => {
    const timer = setInterval(() => {
      setShowCursor(!showCursor);
    }, 500);
    return () => clearInterval(timer);
  }, [showCursor]);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText(welcomeText.slice(0, index));
      index++;
      if (index > welcomeText.length) {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-6">
      <pre className="text-green-400 text-sm whitespace-pre-wrap text-center mx-auto max-w-md">
        {displayedText}
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          █
        </span>
      </pre>
      
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={onStartGame}
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-3 rounded-lg 
                     transform hover:scale-105 transition-all duration-200 shadow-lg
                     border-2 border-green-400 hover:border-green-300"
        >
          <Terminal className="inline-block mr-2" size={20} />
          INITIALIZE MISSION
        </button>
      </div>
      
      <div className="text-gray-400 text-sm animate-pulse">
        Press button to enter the survival zone...
      </div>
    </div>
  );
};

export default WelcomeScreen; // Changed from named export to default export