import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL is https:// at runtime (Vercel serverless).
// DATABASE_URL_MIGRATE is the libsql:// variant needed for prisma db push.
const migrateUrl = process.env["DATABASE_URL_MIGRATE"] ?? process.env["DATABASE_URL"] ?? "file:./dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrateUrl,
  },
});
