import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY ?? "",
});

export const FAST_MODEL = "llama-3.1-8b-instant";
export const QUALITY_MODEL = "llama-3.3-70b-versatile";
export const REVIEW_MODEL = "llama-3.1-8b-instant";

export const BIOLOGY_SYSTEM = `You are a biology tutor specializing in undergraduate-level biology.
When explaining biological processes, be clear and concise.
Use simple language a first-year biology student can understand.
Focus on key molecular interactions and why each step matters.
Keep explanations to 3-4 sentences.
Respond in the same language as the question (Hebrew or English).`;
