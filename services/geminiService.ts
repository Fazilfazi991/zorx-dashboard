import { GoogleGenAI, Type } from "@google/genai";
import { AIStrategyResponse, AIContentResponse, Priority, Team } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_ID = 'gemini-3-pro-preview';

export const generateClientStrategy = async (clientName: string, industry: string): Promise<AIStrategyResponse | null> => {
  try {
    const prompt = `
      You are a senior digital marketing strategist at Zorx Agency.
      Generate 3-5 high-impact actionable tasks for a client named "${clientName}" in the "${industry}" industry.
      Assign each task to one of these teams: Marketing, Content, Creative, Development.
      Focus on actionable items like SEO, PPC, Content Creation, Design, or Web Updates.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
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

export const generateMarketingContent = async (
  clientName: string, 
  industry: string, 
  platform: string, 
  topic: string,
  tone: string
): Promise<AIContentResponse | null> => {
  try {
    const prompt = `
      You are a world-class copywriter for a digital agency.
      Write 3 distinct variations of marketing copy for a client named "${clientName}" (${industry}).
      Platform: ${platform}
      Topic: ${topic}
      Tone: ${tone}
      
      For each variation, provide a catchy headline (or hook), the main body text, and relevant hashtags.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING, description: "The hook or subject line" },
                  body: { type: Type.STRING, description: "The main content of the post/ad" },
                  hashtags: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  }
                },
                required: ['headline', 'body', 'hashtags']
              }
            }
          },
          required: ['variations']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIContentResponse;
    }
    return null;

  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};