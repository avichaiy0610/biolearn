import Link from "next/link";
import { videoPageHref, type ExplainerVideo } from "@/content/explainer-videos";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Plays a narrated explainer video. Captions are burned into the video, so it works muted too.
export default function ExplainerVideoCard({ video, lang = "he", autoPlay = false, onBack, showPageLink = true }: {
  video: ExplainerVideo;
  lang?: string;
  autoPlay?: boolean;
  onBack?: () => void;     // shown inside the process page: return to the animation
  showPageLink?: boolean;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-line bg-surface">
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line px-4 py-2.5">
        <span className="text-xs font-bold text-brand">סרטון הסבר</span>
        <strong className="text-sm">{video.titleHe}</strong>
        <span className="text-xs text-muted" dir="ltr">{mmss(video.seconds)}</span>
        {onBack && (
          <button onClick={onBack} className="ms-auto rounded-lg border border-line px-3 py-1 text-sm hover:border-brand">
            ← חזרה לאנימציה
          </button>
        )}
      </figcaption>
      <video controls autoPlay={autoPlay} preload="metadata" playsInline poster={video.poster} className="block aspect-video w-full bg-black" src={video.src}>
        הדפדפן שלך לא תומך בהצגת וידאו.
      </video>
      <p className="flex flex-wrap gap-x-3 px-4 py-2 text-xs text-muted">
        <span>{video.voiceCreditHe} · עם כתוביות בעברית</span>
        {showPageLink && <Link href={videoPageHref(lang, video.slug)} className="ms-auto font-bold text-brand hover:underline">לעמוד הסרטון ←</Link>}
      </p>
    </figure>
  );
}
