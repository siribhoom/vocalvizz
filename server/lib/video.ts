import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export async function createVideo(imagePath: string, audioPath: string, text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Clean up paths: ensure they are absolute
    const absImagePath = path.join(process.cwd(), imagePath.startsWith('/') ? imagePath.slice(1) : imagePath);
    const absAudioPath = path.join(process.cwd(), audioPath.startsWith('/') ? audioPath.slice(1) : audioPath);
    
    const outputFilename = `video-${randomUUID()}.mp4`;
    const outputPath = path.join(UPLOADS_DIR, outputFilename);
    const publicUrl = `/uploads/${outputFilename}`;

    // FFmpeg command to loop image over audio length
    ffmpeg()
      .input(absImagePath)
      .loop() // Loop the image
      .input(absAudioPath)
      // .addOption('-shortest') // Finish when shortest input ends (audio)
      // .audioCodec('aac')
      // .videoCodec('libx264')
      // .size('1280x720')
      // Simple subtitle filter (optional, might be complex with ffmpeg directly without srt file)
      // For prototype, just image + audio is enough as per "Simple video: Parent image as background"
      .outputOptions([
        '-c:v libx264',
        '-tune stillimage',
        '-c:a aac',
        '-b:a 192k',
        '-pix_fmt yuv420p',
        '-shortest'
      ])
      .save(outputPath)
      .on('end', () => {
        console.log('Video generation finished:', publicUrl);
        resolve(publicUrl);
      })
      .on('error', (err: any) => {
        console.error('FFmpeg error:', err);
        reject(err);
      });
  });
}
