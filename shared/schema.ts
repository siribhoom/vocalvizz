import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  audioUrl: text("audio_url").notNull(), // Parent's voice sample (unused in MVP if using gTTS, but stored)
  contentType: text("content_type").notNull(), // 'story', 'rhyme', etc.
  topic: text("topic").notNull(),
  generatedText: text("generated_text"), // The story/rhyme text
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true, 
  generatedText: true, 
  status: true, 
  videoUrl: true, 
  createdAt: true 
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
