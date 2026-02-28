
import React, { useState } from 'react';
import { EcoScanResult, DisposalCategory } from '../types';

interface ResultViewProps {
  result: EcoScanResult;
  previewUrl?: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, previewUrl, onReset }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getCategoryStyles = (category: DisposalCategory) => {
    switch (category) {
      case DisposalCategory.RECYCLABLE:
        return {
          bg: 'bg-blue-600',
          light: 'bg-blue-50',
          text: 'text-blue-900',
          accent: 'text-blue-600',
          icon: '♻️'
        };
      case DisposalCategory.COMPOSTABLE:
        return {
          bg: 'bg-green-600',
          light: 'bg-green-50',
          text: 'text-green-900',
          accent: 'text-green-700',
          icon: '🌿'
        };
      case DisposalCategory.LANDFILL:
        return {
          bg: 'bg-gray-800',
          light: 'bg-gray-100',
          text: 'text-gray-900',
          accent: 'text-gray-600',
          icon: '🗑️'
        };
      default:
        return {
          bg: 'bg-indigo-600',
          light: 'bg-indigo-50',
          text: 'text-indigo-900',
          accent: 'text-indigo-600',
          icon: '❓'
        };
    }
  };

  const styles = getCategoryStyles(result.category);
  const isLowConfidence = result.confidence < 85;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-md px-0 sm:px-4">
      <div className="absolute inset-0" onClick={onReset}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-500 ease-out max-h-[95vh] overflow-y-auto border-t sm:border border-gray-100">
        <div className="sm:hidden w-16 h-1.5 bg-gray-200 rounded-full mx-auto my-5 sticky top-0 z-20"></div>

        {/* TOP SECTION: Result Banner & Item Name */}
        <div className={`${styles.bg} pt-12 pb-14 px-8 text-center text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             <div className="text-[140px] font-bold uppercase rotate-12">{result.category}</div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-8xl mb-6 block drop-shadow-2xl animate-bounce-slow">
              {styles.icon}
            </span>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-70 mb-2">Dispose as</h3>
            <p className="text-5xl font-black tracking-tighter mb-4">{result.category}</p>
            
            <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-3xl border border-white/20 shadow-xl">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Detected Item</h4>
               <p className="text-2xl font-extrabold capitalize leading-tight">{result.item}</p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Confidence Pill */}
        <div className="flex justify-center -mt-6 relative z-20">
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg border-2 ${isLowConfidence ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-emerald-100 border-emerald-200 text-emerald-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isLowConfidence ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            AI Confidence: {result.confidence}%
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Low Confidence Disclaimer */}
          {isLowConfidence && (
            <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-200 rounded-3xl animate-in fade-in zoom-in duration-300">
              <div className="bg-amber-100 text-amber-600 p-2.5 rounded-full flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-bold text-amber-900 leading-tight">
                Verify with local labels for best results.
              </p>
            </div>
          )}

          {/* ADVANCED DETAILS TOGGLE */}
          <div className="pt-2">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-4 px-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em]">View Analysis Details</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {showDetails && (
              <div className="mt-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                {/* Visual Analysis */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Visual Observations</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {result.observations.map((obs, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-gray-700 tracking-tight">{obs}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Material Composition</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.materials.map((m, idx) => (
                      <div key={idx} className="bg-gray-100/70 px-4 py-2 rounded-2xl flex flex-col border border-gray-200">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{m.part}</span>
                        <span className="text-sm font-black text-gray-800">{m.material}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Note */}
                <div className={`p-6 ${styles.light} rounded-3xl border-2 ${styles.bg.replace('bg-', 'border-')}/20 shadow-inner`}>
                  <h4 className={`text-[10px] font-black ${styles.accent} uppercase tracking-[0.2em] mb-3`}>GreenPT Expert Analysis</h4>
                  <p className={`${styles.text} text-base leading-relaxed font-bold`}>
                    {result.reason}
                  </p>
                </div>

                {/* Wolfram Alpha Data */}
                {result.wolfram && (Object.values(result.wolfram).some(v => !!v)) && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Scientific Data (Wolfram Alpha)</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {result.wolfram.isOpenNow && (
                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${result.wolfram.isOpenNow.toLowerCase().includes('yes') || result.wolfram.isOpenNow.toLowerCase().includes('open') ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                          <div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-1">Status</span>
                            <p className={`text-sm font-bold ${result.wolfram.isOpenNow.toLowerCase().includes('yes') || result.wolfram.isOpenNow.toLowerCase().includes('open') ? 'text-emerald-900' : 'text-gray-600'}`}>
                              {result.wolfram.isOpenNow.toLowerCase().includes('yes') || result.wolfram.isOpenNow.toLowerCase().includes('open') ? '✅ Open Now' : '🕒 Check Hours'}
                            </p>
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium max-w-[150px] text-right italic">
                            {result.wolfram.isOpenNow}
                          </div>
                        </div>
                      )}
                      {result.wolfram.decompositionTime && (
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-wider block mb-1">Decomposition Time</span>
                          <p className="text-sm font-bold text-indigo-900">{result.wolfram.decompositionTime}</p>
                        </div>
                      )}
                      {result.wolfram.carbonFootprint && (
                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                          <span className="text-[10px] text-rose-400 font-black uppercase tracking-wider block mb-1">Carbon Footprint</span>
                          <p className="text-sm font-bold text-rose-900">{result.wolfram.carbonFootprint}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nearby Centers */}
                {result.nearbyCenters && result.nearbyCenters.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Nearby Disposal Centers</h4>
                    <div className="space-y-3">
                      {result.nearbyCenters.map((center, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <h5 className="font-black text-gray-800 truncate text-lg">{center.name}</h5>
                              <p className="text-xs text-gray-500 truncate">{center.address}</p>
                              {center.status && (
                                <span className={`inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${center.status.toLowerCase().includes('open') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {center.status}
                                </span>
                              )}
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                              Nearby
                            </div>
                          </div>
                          <a 
                            href={center.mapsUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-3 px-4 bg-emerald-600 text-white text-sm font-black rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Navigate to Center
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MAIN ACTION BUTTON */}
          <button
            onClick={onReset}
            className="w-full py-6 px-8 bg-gray-900 text-white text-xl font-black rounded-3xl shadow-2xl hover:bg-gray-800 transition-all active:scale-[0.97] flex items-center justify-center gap-4 group"
          >
            <div className="bg-white/10 p-1.5 rounded-full group-hover:rotate-180 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
            Scan Another Item
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ResultView;
