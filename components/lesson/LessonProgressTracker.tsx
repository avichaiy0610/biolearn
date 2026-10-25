"use client";

import { useEffect } from "react";

// Records reading progress for a logged-in student (the server ignores guests): "open" when the unit page loads,
// "read" once the end of the unit body (the element with `endId`) comes into view. Renders nothing.
export default function LessonProgressTracker({ lessonSlug, endId }: { lessonSlug: string; endId: string }) {
  useEffect(() => {
    const send = (action: "open" | "read") =>
      fetch("/api/lesson-progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonSlug, action }), keepalive: true }).catch(() => {});
    send("open");

    const end = document.getElementById(endId);
    if (!end || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        send("read");
        observer.disconnect();
      }
    });
    observer.observe(end);
    return () => observer.disconnect();
  }, [lessonSlug, endId]);

  return null;
}
