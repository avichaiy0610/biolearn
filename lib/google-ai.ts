import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_AI_KEY ?? ""
);

export const FLASH_MODEL = "gemini-2.0-flash";

export const BIOLOGY_SYSTEM = `You are a biology tutor specializing in undergraduate-level biology.
When explaining biological processes, be clear and concise.
Use simple language a first-year biology student can understand.
Focus on key molecular interactions and why each step matters.
Keep explanations to 3-4 sentences.
Respond in the same language as the question (Hebrew or English).`;

export function getModel(json = false) {
  return genAI.getGenerativeModel({
    model: FLASH_MODEL,
    ...(json
      ? { generationConfig: { responseMimeType: "application/json" } }
      : {}),
  });
}
