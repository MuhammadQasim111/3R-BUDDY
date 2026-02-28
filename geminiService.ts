
import { GoogleGenAI, Type } from "@google/genai";
import { EcoScanResult, DisposalCategory, NearbyCenter } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '' });

export const findNearbyCenters = async (item: string, lat: number, lng: number, localTime?: string): Promise<NearbyCenter[]> => {
  try {
    const timeContext = localTime ? ` It is currently ${localTime}.` : '';
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 3 nearby recycling or disposal centers for ${item} near my location.${timeContext} Check if they are open now.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const centers: NearbyCenter[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const text = response.text || '';
    
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.maps) {
          const name = chunk.maps.title || 'Recycling Center';
          // Try to find status in text for this center
          let status = undefined;
          if (text.toLowerCase().includes(name.toLowerCase())) {
            const lowerText = text.toLowerCase();
            const centerIdx = lowerText.indexOf(name.toLowerCase());
            const context = lowerText.substring(centerIdx, centerIdx + 200);
            if (context.includes('open') && !context.includes('closed')) status = 'Open Now';
            else if (context.includes('closed')) status = 'Closed';
          }

          centers.push({
            name: name,
            address: 'Nearby',
            mapsUrl: chunk.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`,
            status: status
          });
        }
      }
    }

    // If no chunks found, try to parse from text as fallback
    if (centers.length === 0 && text) {
      // Simple regex to find potential names and addresses if grounding failed
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.includes('http')) {
          const match = line.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            let status = undefined;
            if (line.toLowerCase().includes('open')) status = 'Open Now';
            else if (line.toLowerCase().includes('closed')) status = 'Closed';

            centers.push({
              name: match[1],
              address: 'Nearby',
              mapsUrl: match[2],
              status: status
            });
          }
        }
      }
    }

    return centers.slice(0, 3);
  } catch (error) {
    console.error("Error finding nearby centers:", error);
    return [];
  }
};

export const analyzeItem = async (base64Image: string): Promise<EcoScanResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
      ],
    },
    config: {
      // Use systemInstruction for better token efficiency and faster processing
      systemInstruction: "You are GreenPT, a world-class environmental expert and eco-disposal specialist. " +
        "Identify objects and categorize them as Recyclable, Compostable, or Landfill. " +
        "Calculate confidence based on image clarity (70-84% if blurry/dim) and rarity (95%+ for common items). " +
        "Provide a material breakdown, 2-3 visual observations, and a 2-sentence impact reason. " +
        "Output strictly valid JSON. Be precise, scientific, and helpful.",
      // Set thinkingBudget to 0 for minimal latency (low/minimal thinking level)
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: [DisposalCategory.RECYCLABLE, DisposalCategory.COMPOSTABLE, DisposalCategory.LANDFILL],
          },
          reason: { type: Type.STRING },
          confidence: { type: Type.INTEGER },
          observations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Concise visual features detected (e.g., 'Plastic texture detected')"
          },
          materials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                part: { type: Type.STRING },
                material: { type: Type.STRING }
              },
              required: ["part", "material"]
            }
          }
        },
        required: ["item", "category", "reason", "confidence", "materials", "observations"],
      },
    },
  });

  const resultStr = response.text;
  if (!resultStr) {
    throw new Error("No response from AI");
  }

  return JSON.parse(resultStr) as EcoScanResult;
};
