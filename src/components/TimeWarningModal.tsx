import React, { useEffect } from "react";

export const TimeWarningModal: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-close after 1.5 seconds
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-red-900 border-2 border-red-500 text-red-100 p-6 rounded-lg shadow-lg animate-pulse text-center">
        <div className="text-2xl font-bold mb-2">⚠️ WARNING</div>
        <div>Time is running out!</div>
        <div className="text-sm mt-2">10 seconds remaining</div>
      </div>
    </div>
  );
};
