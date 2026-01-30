import gtts from 'node-gtts';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// We'll store audio in 'uploads' directory for simplicity
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function generateSpeech(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filename = `speech-${randomUUID()}.mp3`;
    const filepath = path.join(UPLOADS_DIR, filename);
    
    // Default to English for now
    const tts = gtts('en');
    
    tts.save(filepath, text, () => {
      resolve(`/uploads/${filename}`);
    });
  });
}
