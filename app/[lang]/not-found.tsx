import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center" dir="rtl">
      <div className="text-6xl mb-4" aria-hidden>🧫</div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">הדף לא נמצא</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        ייתכן שהקישור שגוי או שהדף הועבר. אפשר לחזור לדף הבית או לחפש נושא.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link href="/he" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          לדף הבית
        </Link>
        <Link href="/he/topics" className="border border-zinc-300 dark:border-zinc-600 hover:border-emerald-400 text-zinc-700 dark:text-zinc-300 font-medium px-6 py-3 rounded-xl transition-colors">
          לכל הנושאים
        </Link>
      </div>
      <p className="mt-10 text-sm text-zinc-400" dir="ltr">
        Page not found — <Link href="/en" className="underline hover:text-emerald-600">go to the English home page</Link>
      </p>
    </div>
  );
}
