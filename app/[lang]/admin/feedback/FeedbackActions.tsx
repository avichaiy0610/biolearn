"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackActions({
  id, status, lang,
}: { id: string; status: string; lang: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const isHe = lang === "he";

  async function patch(newStatus: string) {
    setBusy(true);
    await fetch(`/api/admin/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!confirm(isHe ? "למחוק הערה זו?" : "Delete this note?")) return;
    setBusy(true);
    await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {status === "open" ? (
        <button
          onClick={() => patch("resolved")}
          disabled={busy}
          className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 disabled:opacity-50 transition-colors"
        >
          {isHe ? "✓ טפלתי" : "✓ Resolve"}
        </button>
      ) : (
        <button
          onClick={() => patch("open")}
          disabled={busy}
          className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
        >
          {isHe ? "פתח מחדש" : "Reopen"}
        </button>
      )}
      <button
        onClick={remove}
        disabled={busy}
        className="text-xs px-2 py-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
        title={isHe ? "מחק" : "Delete"}
      >
        ✕
      </button>
    </div>
  );
}
