import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
  process.exit(1);
});

export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  await client.query("SELECT 1");
  client.release();
  console.log("\u2705 PostgreSQL connected");
}
