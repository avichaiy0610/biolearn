"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Locale } from "@/lib/dictionaries";

type Dict = {
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    submit: string;
    toggle: string;
    toggleToLogin: string;
    error: string;
    success: string;
  };
};

export default function AuthForm({
  mode,
  lang,
  dict,
}: {
  mode: "login" | "register";
  lang: Locale;
  dict: Dict;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLogin = mode === "login";
  const d = dict.auth;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isLogin) {
      const result = await signIn("credentials", {
        email,
        password,
        rememberMe: rememberMe.toString(),
        redirect: false,
      });
      if (result?.error) {
        setError(lang === "he" ? "מייל או סיסמה שגויים" : "Invalid email or password");
        setLoading(false);
      } else {
        router.push(`/${lang}`);
        router.refresh();
      }
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? (lang === "he" ? "שגיאה בהרשמה" : "Registration failed"));
        setLoading(false);
        return;
      }

      // Auto-sign-in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setSuccess(
          lang === "he"
            ? "ההרשמה הצליחה! עכשיו תוכל להתחבר."
            : "Registered successfully! You can now log in."
        );
        setLoading(false);
      } else {
        router.push(`/${lang}`);
        router.refresh();
      }
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
          {isLogin ? d.login : d.register}
        </h1>

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {d.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {d.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {isLogin && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 accent-emerald-600"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {lang === "he" ? "זכור אותי" : "Remember me"}
              </span>
            </label>
          )}

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-60 transition-colors"
          >
            {loading ? "..." : d.submit}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-zinc-500 dark:text-zinc-400">
          <Link
            href={`/${lang}/auth/${isLogin ? "register" : "login"}`}
            className="text-emerald-600 hover:underline"
          >
            {isLogin ? d.toggle : d.toggleToLogin}
          </Link>
        </p>
      </div>

      {/* Why sign in — everything else on the site works without an account */}
      <section className="mt-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 p-5 text-sm">
        <h2 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
          {lang === "he" ? "מה מקבלים עם חשבון?" : "What does an account give you?"}
        </h2>
        <ul className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
          <li>✓ {lang === "he" ? "מעקב התקדמות: אילו תתי-נושאים כבר קראתם בכל נושא" : "Progress tracking: which subtopics you've already read"}</li>
          <li>✓ {lang === "he" ? "שמירת הציון הטוב ביותר בכל בוחן וממוצע ציונים" : "Your best score on every quiz, plus your average"}</li>
          <li>✓ {lang === "he" ? "דף פרופיל עם סיכום הלמידה שלכם" : "A profile page summarizing your learning"}</li>
        </ul>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          {lang === "he"
            ? "כל התכנים, האנימציות והבחנים זמינים גם בלי להירשם. אנחנו שומרים רק מייל וסיסמה מוצפנת."
            : "All content, animations and quizzes work without an account. We store only your email and a hashed password."}
        </p>
      </section>
    </div>
  );
}
