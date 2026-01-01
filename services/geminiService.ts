import { GoogleGenAI, Type } from "@google/genai";
import { AIStrategyResponse, Priority, Team } from '../types';

// Ensure API Key exists
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateClientStrategy = async (clientName: string, industry: string): Promise<AIStrategyResponse | null> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  try {
    const modelId = 'gemini-3-flash-preview';
    const prompt = `
      You are a senior digital marketing strategist at Zorx Agency.
      Generate 3-5 high-impact actionable tasks for a client named "${clientName}" in the "${industry}" industry.
      Assign each task to one of these teams: Marketing, Content, Creative, Development.
      Focus on actionable items like SEO, PPC, Content Creation, Design, or Web Updates.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL] },
                  team: { type: Type.STRING, enum: [Team.MARKETING, Team.CONTENT, Team.CREATIVE, Team.DEV] }
                },
                required: ['title', 'description', 'priority', 'team']
              }
            }
          },
          required: ['tasks']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIStrategyResponse;
    }
    return null;

  } catch (error) {
    console.error("Error generating strategy:", error);
    return null;
  }
};
