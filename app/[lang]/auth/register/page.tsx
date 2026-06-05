import { hasLocale, getDictionary, type Locale } from "@/lib/dictionaries";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import AuthForm from "@/components/AuthForm";

export default async function RegisterPage({ params }: PageProps<"/[lang]/auth/register">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await getUser().catch(() => null);
  if (user) redirect(`/${lang}`);

  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <AuthForm mode="register" lang={lang as Locale} dict={dict} />
    </div>
  );
}
