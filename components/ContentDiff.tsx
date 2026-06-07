"use client";

type DiffPart = { type: "same" | "removed" | "added"; text: string };

function diffWords(oldText: string, newText: string): DiffPart[] {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  // Simple LCS-based word diff
  const m = oldWords.length;
  const n = newWords.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  const parts: DiffPart[] = [];
  let i = m, j = n;
  const stack: DiffPart[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      stack.push({ type: "same", text: oldWords[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", text: newWords[j - 1] });
      j--;
    } else {
      stack.push({ type: "removed", text: oldWords[i - 1] });
      i--;
    }
  }

  return stack.reverse();
}

function mergeParts(parts: DiffPart[]): DiffPart[] {
  const merged: DiffPart[] = [];
  for (const part of parts) {
    const last = merged[merged.length - 1];
    if (last && last.type === part.type) {
      last.text += part.text;
    } else {
      merged.push({ ...part });
    }
  }
  return merged;
}

export default function ContentDiff({ oldText, newText, label }: {
  oldText: string;
  newText: string;
  label?: string;
}) {
  if (oldText === newText) {
    return (
      <div className="text-xs text-zinc-400 italic p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        {label && <span className="font-medium not-italic text-zinc-500 block mb-1">{label}</span>}
        ללא שינויים
      </div>
    );
  }

  const rawParts = diffWords(oldText, newText);
  const parts = mergeParts(rawParts);

  const hasChanges = parts.some((p) => p.type !== "same");
  if (!hasChanges) return null;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden text-sm">
      {label && (
        <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-500">
          {label}
        </div>
      )}
      <div className="p-3 leading-relaxed text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 whitespace-pre-wrap break-words">
        {parts.map((part, i) => {
          if (part.type === "same") return <span key={i}>{part.text}</span>;
          if (part.type === "removed") return (
            <span key={i} className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 line-through rounded px-0.5">
              {part.text}
            </span>
          );
          return (
            <span key={i} className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded px-0.5">
              {part.text}
            </span>
          );
        })}
      </div>
      <div className="flex gap-4 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-200 dark:bg-red-900 inline-block" />
          נמחק
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-900 inline-block" />
          נוסף
        </span>
      </div>
    </div>
  );
}
