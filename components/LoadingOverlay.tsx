
import React, { useState, useEffect } from 'react';

const LoadingOverlay: React.FC = () => {
  const messages = [
    "Processing with Gemini 3...",
    "Scanning visual features...",
    "Analyzing material composition...",
    "Calculating environmental impact...",
    "Almost there! Saving the planet..."
  ];
  
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-500">
      <div className="relative mb-10 group">
        <div className="w-28 h-28 border-[10px] border-emerald-50 border-t-emerald-600 rounded-full animate-spin shadow-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl animate-bounce drop-shadow-md">🌍</span>
        </div>
        <div className="absolute -inset-4 border border-emerald-100 rounded-full animate-pulse opacity-50"></div>
      </div>
      
      <div className="text-center space-y-3">
        <p className="text-2xl font-black text-emerald-900 tracking-tight transition-all duration-300">
          {messages[msgIndex]}
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-600/60 text-sm font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
          AI Engine Active
        </div>
      </div>
      
      <div className="mt-12 w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${((msgIndex + 1) / messages.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
