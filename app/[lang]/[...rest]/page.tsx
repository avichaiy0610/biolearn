import { notFound } from "next/navigation";

// Any unmatched path under /he or /en renders app/[lang]/not-found.tsx
// inside the localized layout (navbar, RTL) instead of Next's default English 404.
export default function CatchAll() {
  notFound();
}
