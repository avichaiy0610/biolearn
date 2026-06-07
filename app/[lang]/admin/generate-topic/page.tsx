export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/server";
import GenerateTopicClient from "@/components/GenerateTopicClient";

export default async function GenerateTopicPage() {
  if (!(await isAdmin())) redirect("/he/auth/login");
  return <GenerateTopicClient />;
}
