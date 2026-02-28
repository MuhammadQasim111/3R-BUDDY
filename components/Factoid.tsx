
import React, { useMemo } from 'react';

const FACTS = [
  "Recycling one aluminum can saves enough energy to run a TV for three hours.",
  "Composting can reduce household waste by up to 30%.",
  "It takes 500 years for a plastic water bottle to fully decompose in a landfill.",
  "Glass is 100% recyclable and can be recycled endlessly without loss in quality.",
  "Recycling paper saves 60% of energy compared to making new paper from trees.",
  "Nearly 1 trillion plastic bags are used worldwide every year.",
  "Over 75% of waste is recyclable, but only about 30% actually gets recycled.",
  "A single recycled glass bottle saves enough energy to light a 100-watt bulb for 4 hours."
];

const Factoid: React.FC = () => {
  const fact = useMemo(() => FACTS[Math.floor(Math.random() * FACTS.length)], []);

  return (
    <div className="mx-4 mt-8 mb-4 p-5 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 text-emerald-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      </div>
      <div className="relative z-10">
        <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Eco-Hack of the Day</h4>
        <p className="text-emerald-900 font-bold leading-snug">
          "Did you know? {fact}"
        </p>
      </div>
    </div>
  );
};

export default Factoid;
