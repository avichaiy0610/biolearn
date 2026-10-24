// Decodes the HTML entities PubMed/Reactome embed in plain-text fields
// (e.g. "&#xa0;", "&#x2009;", "&amp;") so they never leak into the UI.
const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return NAMED[code.toLowerCase()] ?? m;
  });
}

// In RTL text a prime after a digit renders on the wrong side ("3'" shows as
// "'3") and "5'→3'" scrambles; a trailing charge sign jumps too ("Na⁺" shows as
// "⁺Na", "Ca²⁺" as "⁺Ca²"). Wrap such runs in Unicode isolates (LRI … PDI).
// Idempotent: an existing isolate around a run is replaced, not doubled.
const LRI = String.fromCharCode(0x2066), PDI = String.fromCharCode(0x2069);
const PRIME = /\u2066?(\d['′](?:\s*[→←]\s*\d['′])?)\u2069?/g;
const ION = /\u2066?([A-Za-z][A-Za-z0-9₀-₉²³]*[⁺⁻](?:\/[A-Za-z][A-Za-z0-9₀-₉²³]*[⁺⁻])*)\u2069?/g;
// "←" is the forward arrow of Hebrew text ("A ← B" = A leads to B). Between two Latin terms the bidi
// algorithm folds it into one LTR run ("cAMP ← PKA" then reads PKA → cAMP), so it is pinned RTL with a
// right-to-left mark on each side. "→" is left alone: in Hebrew text it marks LTR formulas ("N₂ → NH₃").
// Arrows inside an isolate (e.g. "5'←3'") are untouched.
const RLM = String.fromCharCode(0x200f);
const ARROW = /‏?←‏?/g;
function pinArrows(s: string): string {
  return s.split(/(⁦[^⁩]*⁩)/).map((part, i) => (i % 2 ? part : part.replace(ARROW, `${RLM}←${RLM}`))).join("");
}
export function isolatePrimes(he: string): string {
  return pinArrows(he.replace(PRIME, `${LRI}$1${PDI}`).replace(ION, `${LRI}$1${PDI}`));
}
