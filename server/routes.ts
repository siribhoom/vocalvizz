import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { storage } from "./storage";
import { generateStory } from "./lib/openai";
import { generateSpeech } from "./lib/tts";
import { createVideo } from "./lib/video";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploads statically
  app.use("/uploads", express.static(UPLOADS_DIR));

  app.post(
    "/api/projects",
    upload.fields([{ name: "image" }, { name: "audio" }]),
    async (req: any, res) => {
      try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const imageFile = files?.["image"]?.[0];
        const audioFile = files?.["audio"]?.[0]; // User provided audio (simulation)

        if (!imageFile || !audioFile) {
          return res.status(400).json({ message: "Missing image or audio file" });
        }

        const { contentType, topic } = req.body;

        const project = await storage.createProject({
          imageUrl: `/uploads/${imageFile.filename}`,
          audioUrl: `/uploads/${audioFile.filename}`,
          contentType,
          topic,
        });

        // Trigger background processing
        // In a real app, use a queue. Here, we just fire and forget (or async await if fast enough)
        // For video generation, it's slow, so we'll do it asynchronously.
        processProject(project.id, contentType, topic, project.imageUrl);

        res.status(201).json(project);
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });
  
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  return httpServer;
}

// Background Processor
async function processProject(projectId: number, contentType: string, topic: string, imageUrl: string) {
  try {
    await storage.updateProject(projectId, { status: "processing" });

    // 1. Generate Content (Story/Text)
    const text = await generateStory(contentType, topic);
    await storage.updateProject(projectId, { generatedText: text });

    // 2. Generate Speech (TTS) - Ignoring uploaded audio for now as per "simulate parent voice" request logic which often implies using TTS *or* the uploaded voice. 
    // The prompt said: "Use gTTS... (simulate parent voice if cloning not possible)".
    // Since we don't have cloning in gTTS, we just use standard TTS reading the GENERATED story.
    // The uploaded audio is kept as "Parent Voice" record but not used for TTS in this simple prototype.
    const audioPath = await generateSpeech(text);

    // 3. Generate Video
    // Use the generated TTS audio + User's Image
    const videoUrl = await createVideo(imageUrl, audioPath, text);

    await storage.updateProject(projectId, {
      status: "completed",
      videoUrl: videoUrl,
    });
  } catch (error) {
    console.error(`Processing failed for project ${projectId}:`, error);
    await storage.updateProject(projectId, { status: "failed" });
  }
}
