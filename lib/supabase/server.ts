// Auth helpers — backed by NextAuth v5 (no Supabase dependency)
import { auth } from "@/auth";

export async function getUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function isAdmin() {
  const user = await getUser();
  if (!user?.email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());
  return adminEmails.includes(user.email);
}
