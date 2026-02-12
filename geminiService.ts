
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject, Explanation } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (subject: Subject, count: number = 3): Promise<Question[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} high-quality O-Level practice questions for ${subject}. 
    Each question should include a detailed O-Level style explanation and an easy-to-remember analogy.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            analogy: { type: Type.STRING }
          },
          required: ["id", "subject", "topic", "question", "options", "correctAnswer", "explanation", "analogy"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse questions", e);
    return [];
  }
};

export const explainConcept = async (subject: Subject, topic: string): Promise<Explanation> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain the O-Level concept: "${topic}" in "${subject}". 
    Use the persona of a friendly, certified O-Level instructor. 
    Focus on an easy-to-remember analogy.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          concept: { type: Type.STRING },
          analogy: { type: Type.STRING },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          practiceHint: { type: Type.STRING }
        },
        required: ["topic", "concept", "analogy", "keyPoints", "practiceHint"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse explanation", e);
    throw new Error("Explanation failed");
  }
};
