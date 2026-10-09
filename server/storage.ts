import { projects, type Project, type InsertProject } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project>;
}

export class DatabaseStorage implements IStorage {
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.createdAt);
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project> = new Map();
  private currentId = 1;

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = {
      id,
      imageUrl: insertProject.imageUrl,
      audioUrl: insertProject.audioUrl,
      contentType: insertProject.contentType,
      topic: insertProject.topic,
      generatedText: null,
      status: "pending",
      videoUrl: null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => ((b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
    );
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error(`Project ${id} not found`);
    }
    const updated: Project = { ...existing, ...updates };
    this.projects.set(id, updated);
    return updated;
  }
}

export const storage: IStorage = db ? new DatabaseStorage() : new MemStorage();
