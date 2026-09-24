// lottie-web ships typings only for its default (svg) entry; the canvas-only
// build exposes the same API.
declare module "lottie-web/build/player/lottie_canvas" {
  import type { LottiePlayer } from "lottie-web";
  const lottie: LottiePlayer;
  export default lottie;
}
