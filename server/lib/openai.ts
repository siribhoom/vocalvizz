import OpenAI from "openai";

// Reuse the configuration from the blueprint
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateStory(contentType: string, topic: string): Promise<string> {
  try {
    const prompt = `Write a short, engaging ${contentType.toLowerCase()} for a child about "${topic}". 
    Keep it under 100 words. Simple language. Warm and loving tone.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.1", // Using the best available model
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 200,
    });

    return response.choices[0]?.message?.content || "I love you very much.";
  } catch (error) {
    console.error("OpenAI generation error:", error);
    return `Here is a ${contentType} about ${topic}. You are loved and cherished.`;
  }
}
