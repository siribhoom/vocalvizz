import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
  } catch (err) {
    console.warn("[AI Studio] Database connection error — falling back to mock:", err);
    pool = null;
    db = null;
  }
} else {
  console.warn("[AI Studio] DATABASE_URL not set — database mock active");
}

export { pool, db };
