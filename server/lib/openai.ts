import OpenAI from "openai";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });
}

function getDefaultStory(contentType: string, topic: string): string {
  const lowerType = contentType.toLowerCase();
  if (lowerType.includes("rhyme")) {
    return `Twinkle, twinkle little star, shine so bright right where you are! On the journey of ${topic}, full of wonder and of joy. Always remember, near or far, you are loved just as you are!`;
  }
  if (lowerType.includes("comfort") || lowerType.includes("motivat")) {
    return `Always remember how brave, kind, and wonderful you are. Whenever you face ${topic}, know that my heart is with you every step of the way. Take a deep breath, smile, and know you are so deeply loved!`;
  }
  if (lowerType.includes("educat") || lowerType.includes("lesson")) {
    return `Today we learn all about ${topic}! Every big adventure begins with a little spark of curiosity. Keep exploring, keep asking questions, and know that learning makes the world a brighter place!`;
  }
  return `Once upon a time, there was a magical story about ${topic}. Every day was filled with gentle laughter, sweet dreams, and warm hugs. Sleep tight, little dreamer, knowing you are loved beyond words.`;
}

export async function generateStory(contentType: string, topic: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (openai) {
      const prompt = `Write a short, engaging ${contentType.toLowerCase()} for a child about "${topic}". 
Keep it under 100 words. Simple language. Warm and loving tone.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 200,
      });

      const text = response.choices[0]?.message?.content?.trim();
      if (text) return text;
    }
  } catch (error) {
    console.error("Story generation error:", error);
  }

  return getDefaultStory(contentType, topic);
}
