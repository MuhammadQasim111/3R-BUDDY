
import React from 'react';
import { HistoryItem, DisposalCategory } from '../types';

interface HistorySectionProps {
  history: HistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  if (history.length === 0) return null;

  const getBadgeStyles = (category: DisposalCategory) => {
    switch (category) {
      case DisposalCategory.RECYCLABLE:
        return 'bg-blue-100 text-blue-700';
      case DisposalCategory.COMPOSTABLE:
        return 'bg-green-100 text-green-700';
      case DisposalCategory.LANDFILL:
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-indigo-100 text-indigo-700';
    }
  };

  return (
    <div className="mt-12 mb-12 px-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Your Recent Impact</h3>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Activity</span>
      </div>
      <div className="space-y-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-5 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <img 
              src={item.previewUrl} 
              alt={item.result.item} 
              className="w-16 h-16 object-cover rounded-2xl flex-shrink-0 shadow-sm"
            />
            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-gray-800 truncate capitalize text-lg">{item.result.item}</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mt-1 ${getBadgeStyles(item.result.category)}`}>
                {item.result.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
