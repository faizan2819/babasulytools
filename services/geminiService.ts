
import { GoogleGenAI } from "@google/genai";
import { ProcessingOptions } from "../types";

export const humanizeContent = async (text: string, options: ProcessingOptions): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemInstruction = `
    You are a world-class senior editor and creative writer specializing in "humanizing" AI-generated content.
    Your goal is to transform the provided text into something that sounds completely natural, engaging, and indistinguishable from authentic human writing.
    
    CORE OBJECTIVES:
    1. Eliminate "AI-isms": Remove common AI crutches like "delve into", "testament to", "unlock", "revolutionize", "comprehensive guide", and robotic transitional phrases like "In conclusion" or "Furthermore".
    2. Vary Sentence Rhythm: Humans use a mix of short, punchy statements and longer, flowy explanations. Avoid the monotone sentence length typical of standard LLMs.
    3. Use Natural Transitions: Bridge ideas with conversational links (e.g., "Think of it this way," "Now here's the interesting part," "But that’s only half the story").
    4. Tone Matching: Strictly adhere to a ${options.tone} tone. 
    5. Readability Matching: Ensure the complexity fits the ${options.readability} level.
    6. Maintain Integrity: Do not change the factual meaning or core message.
    7. Perplexity and Burstiness: Increase linguistic variety to lower AI detection scores. Use idiomatic expressions and colloquialisms where appropriate for the tone.
    8. Emotional Resonance: Add subtle layers of empathy or personality.
    
    OUTPUT FORMAT:
    Return ONLY the humanized text. No intros, no outros, no commentary. Just the refined content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
        topP: 0.95,
        topK: 40,
      },
    });

    return response.text || "I processed the text but the result was empty. Please try a different input.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Our humanization engine is currently overwhelmed. Please try again in a moment.");
  }
};
