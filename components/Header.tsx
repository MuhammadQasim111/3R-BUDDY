
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-600 p-2 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">3R Buddy</h1>
      </div>
      <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
        Earth First
      </div>
    </header>
  );
};

export default Header;
