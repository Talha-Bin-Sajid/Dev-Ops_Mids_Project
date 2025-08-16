import React from 'react';

interface TerminalProps {
  children: React.ReactNode;
}

export const Terminal: React.FC<TerminalProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Terminal Header */}
        <div className="bg-gray-800 rounded-t-lg p-2 flex items-center space-x-2 border border-gray-600">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 text-center text-gray-300 text-sm">
            user@devops-terminal:~/script-survivor$
          </div>
        </div>
        
        {/* Terminal Body */}
        <div className="bg-black border-x border-b border-gray-600 rounded-b-lg p-6 min-h-[600px]">
          {children}
        </div>
      </div>
    </div>
  );
};