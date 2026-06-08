import { isAdmin } from "@/lib/supabase/server";

export async function GET() {
  return Response.json({ isAdmin: await isAdmin() });
}
