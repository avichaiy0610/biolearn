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
// "'3") and "5'→3'" scrambles. Wrap such runs in Unicode isolates (LRI … PDI).
const LRI = String.fromCharCode(0x2066), PDI = String.fromCharCode(0x2069);
export function isolatePrimes(he: string): string {
  return he.replace(/\u2066?(\d'(?:\s*[→←]\s*\d')?)\u2069?/g, `${LRI}$1${PDI}`);
}
