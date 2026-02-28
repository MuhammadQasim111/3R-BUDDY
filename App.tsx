
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Scanner from './components/Scanner';
import ResultView from './components/ResultView';
import LoadingOverlay from './components/LoadingOverlay';
import HistorySection from './components/HistorySection';
import Factoid from './components/Factoid';
import { AppState, HistoryItem } from './types';
import { analyzeItem, findNearbyCenters } from './geminiService';
import { fetchWolframData } from './wolframService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle'
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = sessionStorage.getItem('3rbuddy_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('3rbuddy_history', JSON.stringify(history));
  }, [history]);

  const handleImageSelected = async (base64: string, previewUrl: string) => {
    setState({ status: 'loading', previewUrl });
    try {
      // 0. Get Geolocation
      let lat = 0, lng = 0, locationStr = "my area";
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        locationStr = `${lat}, ${lng}`;
      } catch (geoError) {
        console.warn("Geolocation failed", geoError);
      }

      // 1. Analyze with GreenPT (Gemini)
      const result = await analyzeItem(base64);
      
      const now = new Date();
      const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dayOfWeek = now.toLocaleDateString([], { weekday: 'long' });
      const fullTimeStr = `${localTime} on a ${dayOfWeek}`;

      // 2. Enrich with Wolfram Alpha data
      try {
        const wolframData = await fetchWolframData(result.item, fullTimeStr, locationStr);
        result.wolfram = wolframData;
      } catch (wError) {
        console.warn("Wolfram enrichment failed", wError);
      }

      // 3. Find Nearby Centers
      try {
        if (lat !== 0 && lng !== 0) {
          const centers = await findNearbyCenters(result.item, lat, lng, fullTimeStr);
          result.nearbyCenters = centers;
        }
      } catch (cError) {
        console.warn("Finding centers failed", cError);
      }

      setState({ status: 'success', result, previewUrl });

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        result,
        previewUrl
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 3));
      
    } catch (error) {
      console.error(error);
      setState({ 
        status: 'error', 
        error: 'Oops! Something went wrong while analyzing the item. Please try again.',
        previewUrl 
      });
    }
  };

  const handleReset = () => {
    setState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow px-0 md:px-4 overflow-y-auto">
        {state.status === 'idle' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Scanner onImageSelected={handleImageSelected} />
            <HistorySection history={history} />
            <Factoid />
          </div>
        )}

        {state.status === 'loading' && (
          <div className="mt-20">
            <LoadingOverlay />
          </div>
        )}

        {state.status === 'success' && state.result && (
          <ResultView 
            result={state.result} 
            previewUrl={state.previewUrl} 
            onReset={handleReset} 
          />
        )}

        {state.status === 'error' && (
          <div className="mt-12 mx-4 text-center p-8 bg-white rounded-3xl shadow-sm border border-red-100">
            <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analysis Failed</h3>
            <p className="text-gray-500 mb-6">{state.error}</p>
            <button
              onClick={handleReset}
              className="py-3 px-8 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:bg-red-700 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer className="p-6 text-center text-gray-400 text-xs mt-auto">
        &copy; {new Date().getFullYear()} 3R Buddy. Empowering sustainable living.
      </footer>
    </div>
  );
};

export default App;
