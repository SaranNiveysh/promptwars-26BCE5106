import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
}

function cleanJSONString(raw: string): string {
  let cleaned = raw.trim();
  // Remove markdown code blocks if any (```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return cleaned.trim();
}

export async function callGeminiJSON<T>(
  systemInstruction: string,
  userPrompt: string
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment variables.');
  }

  const model = getGeminiModelName();
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini model.');
    }

    const cleaned = cleanJSONString(text);
    const parsed = JSON.parse(cleaned) as T;
    return parsed;
  } catch (error: any) {
    console.error(`[Gemini API Error with model ${model}]:`, error?.message || error);
    throw error;
  }
}
