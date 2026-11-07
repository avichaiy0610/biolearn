"use client";
/* Interactive instrument figures built with the Anatomy kit (Claude, 2026-11-07; source in Project One/visual-lab/anatomy-pilot/).
   Each one is a standalone page under public/figures/anatomy/, shown here in a same-origin iframe that grows to its content. */
import { useEffect, useRef, useState } from "react";

export default function AnatomyEmbed({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(560);
  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;
    const fit = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      setHeight(Math.ceil(doc.documentElement.scrollHeight));
      observer?.disconnect();
      observer = new ResizeObserver(() => setHeight(Math.ceil(doc.documentElement.scrollHeight)));
      observer.observe(doc.body);
    };
    frame.addEventListener("load", fit);
    fit();
    return () => { frame.removeEventListener("load", fit); observer?.disconnect(); };
  }, []);
  return <iframe ref={ref} src={src} title={title} loading="lazy" className="block w-full border-0" style={{ height }} />;
}
