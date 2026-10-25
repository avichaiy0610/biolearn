import type { ExplainerVideo } from "@/content/explainer-videos";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Plays a narrated explainer video. Captions are burned into the video, so it works muted too.
export default function ExplainerVideoCard({ video }: { video: ExplainerVideo }) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-line bg-surface">
      <figcaption className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="text-xs font-bold text-brand">סרטון הסבר</span>
        <strong className="text-sm">{video.titleHe}</strong>
        <span className="ms-auto text-xs text-muted" dir="ltr">{mmss(video.seconds)}</span>
      </figcaption>
      <video controls preload="metadata" playsInline poster={video.poster} className="block aspect-video w-full bg-black" src={video.src}>
        הדפדפן שלך לא תומך בהצגת וידאו.
      </video>
      <p className="px-4 py-2 text-xs text-muted">{video.voiceCreditHe} · עם כתוביות בעברית</p>
    </figure>
  );
}
