import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  try {
    await client.execute(`ALTER TABLE "Subtopic" ADD COLUMN "hidden" INTEGER NOT NULL DEFAULT 0`);
    console.log("✅ Added 'hidden' column to Subtopic table");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("duplicate column")) {
      console.log("ℹ️  Column 'hidden' already exists");
    } else {
      throw err;
    }
  }
}

main().catch(console.error);
