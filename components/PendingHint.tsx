"use client";

import { useLinkStatus } from "next/link";

// Instant feedback inside a <Link> while its page loads: a thin bar along the
// bottom edge of the (relatively positioned) link. Must be a descendant of the Link.
export default function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-brand transition-opacity ${pending ? "opacity-100 animate-pulse" : "opacity-0"}`}
    />
  );
}
