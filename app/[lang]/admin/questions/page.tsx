import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/server";
import QuestionsManager from "@/components/QuestionsManager";

export default async function AdminQuestionsPage() {
  if (!(await isAdmin())) redirect("/he/auth/login");
  return <QuestionsManager />;
}
