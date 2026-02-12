
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject, Explanation } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (subject: Subject, count: number = 10, topic?: string): Promise<Question[]> => {
  const topicContext = topic ? `specifically on the topic of "${topic}"` : "covering a broad range of curriculum topics";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} high-quality O-Level examination practice questions for ${subject} ${topicContext}. 
    
    CRITICAL INSTRUCTIONS:
    1. Language: Use formal, precise British English as found in CIE (Cambridge) or SEAB O-Level papers.
    2. Format: These must be Multiple Choice Questions (MCQs) typical of 'Paper 1'.
    3. Content: Include a mix of recall, application, and analysis questions.
    4. Structure: Each question must have a clear 'stem' (the question body) and 4 distinct options (distractors should be plausible common misconceptions).
    5. Analogies: Provide an easy-to-remember analogy to help students memorize the underlying concept.
    6. Explanations: Provide a systematic explanation that corrects the common errors associated with the distractors.
    
    Return the data as a JSON array matching the provided schema.`,
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
              items: { type: Type.STRING },
              description: "Exactly 4 options."
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
