// Splits a lesson body into sections ("## Title {#id}" — the id is optional
// but should be set for sections that course plans link to, so links survive
// edits) and blocks ([[figure:x]] / [[animation:x]] lines).

export type Segment = { kind: "md"; text: string } | { kind: "figure"; id: string } | { kind: "animation"; slug: string };
export type Section = { id: string; title: string; segments: Segment[] };

export function parseBody(body: string): Section[] {
  const sections: Section[] = [];
  let cur: Section | null = null;
  let buf: string[] = [];
  const flush = () => { if (cur && buf.join("").trim()) cur.segments.push({ kind: "md", text: buf.join("\n") }); buf = []; };
  for (const line of body.split("\n")) {
    const h = /^## (.+?)(?:\s*\{#([\w-]+)\})?\s*$/.exec(line);
    const d = /^\[\[(figure|animation):([\w-]+)\]\]$/.exec(line.trim());
    if (h) { flush(); cur = { id: h[2] ?? `s${sections.length + 1}`, title: h[1].trim(), segments: [] }; sections.push(cur); }
    else if (d && cur) { flush(); cur.segments.push(d[1] === "figure" ? { kind: "figure", id: d[2] } : { kind: "animation", slug: d[2] }); }
    else buf.push(line);
  }
  flush();
  return sections;
}
