import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/server";
import ArticlesManager from "@/components/ArticlesManager";

export default async function AdminArticlesPage() {
  if (!(await isAdmin())) redirect("/he/auth/login");
  return <ArticlesManager />;
}
