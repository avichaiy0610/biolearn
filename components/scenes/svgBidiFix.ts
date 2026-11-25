// Safari/WebKit ignores the Unicode isolate marks (U+2066…U+2069) inside SVG <text>.
// Hebrew labels that mix in Latin names then reorder on iPhone/iPad: "(SCL (TAL1",
// "⁺K", "ושותפים Mediator", or a whole line flipped when it starts with CO₂.
// Fix: in every Hebrew SVG label, start with RLM and wrap each Latin run in LRM marks.
// That works in both WebKit and Chromium (checked 25.11 with Playwright, both engines).

const HEBREW = /[֐-׿]/;
const MARKS = /[‎‏⁦-⁩]/g;
// A Latin run: starts with a letter, may hold digits, sub/superscripts and short connectors,
// and may close with ")" so "SCL (TAL1)" stays one piece.
const LATIN_RUN = /[A-Za-z][A-Za-z0-9₀-₉²³⁰-ⁿ']*(?:[ /+→×()·-]*[A-Za-z0-9₀-₉²³⁰-ⁿ')]+)*\)?/g;

function fixNode(node: Text, first: boolean) {
  const raw = node.nodeValue ?? "";
  const clean = raw.replace(MARKS, "");
  let next = clean.replace(LATIN_RUN, (m) => "‎" + m + "‎");
  if (first) next = "‏" + next;
  if (next !== raw) node.nodeValue = next;
}

function fixText(el: Element) {
  if (!HEBREW.test(el.textContent ?? "")) return;
  const walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let first = true;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!(n.nodeValue ?? "").trim()) continue;
    fixNode(n as Text, first);
    first = false;
  }
}

export function fixSvgBidi(root: Element) {
  root.querySelectorAll("svg text").forEach(fixText);
}

/** Keeps every Hebrew SVG label under root Safari-safe, also after React re-renders. */
export function watchSvgBidi(root: Element): () => void {
  let busy = false;
  const run = () => {
    if (busy) return;
    busy = true;
    try {
      fixSvgBidi(root);
    } finally {
      // Let our own writes flush before listening again.
      queueMicrotask(() => {
        observer.takeRecords();
        busy = false;
      });
    }
  };
  const observer = new MutationObserver(run);
  run();
  observer.observe(root, { subtree: true, childList: true, characterData: true });
  return () => observer.disconnect();
}
