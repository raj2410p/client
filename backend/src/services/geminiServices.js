import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

export async function analyzeJournalText(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Analyze the following journal entry and return ONLY valid JSON.

Format:
{
  "emotion": "single lowercase emotion word",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "summary": "short one sentence summary"
}

Journal:
${text}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const output = response.text?.trim();

  if (!output) {
    throw new Error("Empty response from Gemini");
  }

  let parsed;
  try {
    parsed = JSON.parse(output);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  return {
    emotion: parsed.emotion || "neutral",
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    summary: parsed.summary || ""
  };
}