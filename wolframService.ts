import { WolframData } from "./types";

export const fetchWolframData = async (item: string, localTime?: string, location?: string): Promise<WolframData> => {
  try {
    // We'll fetch a few specific facts from Wolfram Alpha
    const queries = [
      { key: 'decompositionTime', q: `how long does it take for ${item} to decompose` },
      { key: 'carbonFootprint', q: `carbon footprint of ${item}` },
      { key: 'recyclingFact', q: `is ${item} recyclable` }
    ];

    if (localTime && location) {
      queries.push({ 
        key: 'isOpenNow', 
        q: `Are recycling centers in ${location} open at ${localTime}?` 
      });
    }

    const results: WolframData = {};

    // Execute queries in parallel
    await Promise.all(queries.map(async (query) => {
      try {
        const response = await fetch(`/api/wolfram?query=${encodeURIComponent(query.q)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            (results as any)[query.key] = data.result;
          }
        }
      } catch (e) {
        console.warn(`Wolfram query failed for ${query.key}:`, e);
      }
    }));

    return results;
  } catch (error) {
    console.error("Wolfram service error:", error);
    return {};
  }
};
