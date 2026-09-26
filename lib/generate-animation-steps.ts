import { groq, QUALITY_MODEL } from "@/lib/groq";
import { COMPOSITE_DOC } from "@/content/process-scenes/composites";

const MEIOSIS_KEYWORDS = /\bmeiosis\b|\bmeios[ei]s\b|מיוזה/i;

export function isMeiosisProcess(nameEn: string, nameHe: string): boolean {
  return MEIOSIS_KEYWORDS.test(nameEn) || MEIOSIS_KEYWORDS.test(nameHe);
}

// v2 scene format (lib/svg-scene.ts) + composites (content/process-scenes/composites.ts).
// Output is a DRAFT: it is normalised by lib/animation-draft.ts, checked against the
// animation standard (CLAUDE.md) and polished before anything is published.
const FORMAT_SPEC = `
═══════════════════════════════════════════
SCENE FORMAT (v2) — canvas viewBox 0 0 400 300 (x 0=left..400, y 0=top..300)
═══════════════════════════════════════════
PRIMITIVES (one JSON object each, all need a unique "id"):
  circle {cx,cy,r} · ellipse {cx,cy,rx,ry} · rect {x,y,width,height,rx} · path {d} · line {x1,y1,x2,y2}
  style: "color" (fill; a path WITHOUT color is a stroke line), "stroke", "strokeWidth", "dash":"4 3", "fillOpacity", "opacity"
  arrows: add "arrow":true to a line/path to draw an arrowhead at its end (direction of movement / flow).
LABELS — every key structure gets one, in BOTH languages, pointing at it with a leader line:
  {"id":"l_rib","type":"text","x":300,"y":60,"label":"80S ribosome","labelHe":"ריבוזום 80S","to":[250,130],"anchor":"start"}
  - "to":[x,y] = the point on the structure the leader line touches. Place the label in empty space near the edge.
  - Keep labels SHORT (≤ 18 characters). If longer, also give "short" and "shortHe" (used on phones).
  - "anchor":"start" = text extends to the right of x; "end" = to the left; default centred.
  - 5'/3' end tags, codons and formulas: {"type":"text","label":"5'","labelHe":"5'","ltr":true,...}
  - Labels are drawn at ≥16.5 px: at most ~6 labels per step, never overlapping each other or the drawing.
${COMPOSITE_DOC}
BIOLOGY RULES:
  - Draw REAL structures (composites, membranes as bilayers, proteins as shaped paths) — never a bare circle standing for an organelle.
  - Correct stage order and causal movement per Campbell Biology / Alberts; each step shows ONE event that causes the next.
  - Polarity where it exists: 5'/3' ends on every nucleic-acid strand, direction of synthesis/flow with arrows.
  - Reuse the SAME id (and composite shape) across steps so things move smoothly; move actors to show progress.
  - Titles and descriptions: accurate textbook terminology in Hebrew and English; each description says what changed and why.
`;

const OUTPUT_SPEC = `Return ONLY valid JSON (no markdown), legend FIRST:
{"legend":[{"color":"#059669","he":"mRNA","en":"mRNA","swatch":"line"}],
 "steps":[{"titleHe":"...","titleEn":"...","descHe":"...","descEn":"...","elements":[ ... ],"highlight":[]}]}
legend: 3-6 items explaining every colour/symbol used (swatch: line | dash | dot | ring | arrow).
highlight: ids to emphasise in this step ([] = whole scene at full strength).`;

// Robustly extract steps even from a TRUNCATED JSON response (the 70B model can
// exceed max_tokens on rich animations, leaving the JSON unterminated). We
// bracket-match each complete object inside the "steps" array and drop any
// incomplete trailing one, so a cut-off response still yields usable steps.
function parseStepsLoose(raw: string): object[] {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    const s = p.steps ?? p.animation?.steps ?? p.animationSteps ?? p.data?.steps;
    if (Array.isArray(s)) return s;
  } catch {
    /* fall through to salvage */
  }

  const keyIdx = raw.indexOf('"steps"');
  const arrStart = raw.indexOf("[", keyIdx >= 0 ? keyIdx : 0);
  if (arrStart < 0) return [];

  const objs: object[] = [];
  let depth = 0, objStart = -1, inStr = false, esc = false;
  for (let i = arrStart + 1; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") { if (depth === 0) objStart = i; depth++; }
    else if (ch === "}") {
      depth--;
      if (depth === 0 && objStart >= 0) {
        try { objs.push(JSON.parse(raw.slice(objStart, i + 1))); } catch { /* skip bad chunk */ }
        objStart = -1;
      }
    } else if (ch === "]" && depth === 0) break;
  }
  return objs;
}

function parseLegendLoose(raw: string): unknown[] {
  try {
    const p = JSON.parse(raw);
    if (Array.isArray(p.legend)) return p.legend;
  } catch {
    /* fall through */
  }
  const m = raw.match(/"legend"\s*:\s*(\[[^\]]*\])/);
  try { return m ? JSON.parse(m[1]) : []; } catch { return []; }
}

/* ─── Per-process teaching scripts (the meiosis approach, generalised) ───────
   The 70B model builds FAR better animations from an explicit step-by-step
   script than from a general shape library. Add one entry per important process.
   A focused script is also smaller than the full library, freeing tokens for a
   richer (higher max_tokens) output while staying under Groq's 12k TPM cap. */
type ProcessScript = { id: string; match: RegExp; stepCount: string; maxTokens: number; body: string };

const PROCESS_SCRIPTS: ProcessScript[] = [
  {
    id: "ubiquitin-proteasome",
    match: /ubiquitin|proteasom|אוביקוו?יטין|פרוטא[אז]ום|פירוק חלבונ/i,
    stepCount: "7",
    maxTokens: 8000,
    body: `UBIQUITIN–PROTEASOME SYSTEM — 7 steps. Colours: substrate protein #7c3aed (a folded 10-point path, strokeWidth 6), ubiquitin #fde047/#a16207 (circle r12 + text "Ub"), E1 #bae6fd, E2 #bbf7d0, E3 #fed7aa (use "enzyme" composites), ATP badge.
STEP 1 "Target protein & ubiquitin": folded substrate with a red degron dot; four free Ub; labels "Target protein"/"חלבון מטרה", "Degron"/"דגרון", "Ubiquitin (76 aa)".
STEP 2 "E1 activates Ub (ATP)": E1 enzyme; ub1 bonded to it (thioester); badge "ATP → AMP + PPᵢ".
STEP 3 "E2 and E3 tag the substrate": E2 carries Ub; E3 binds the substrate's degron; ub1 now on a lysine ("K") of the substrate.
STEP 4 "Poly-ubiquitin chain (K48)": chain of 4 Ub linked Lys48 → Gly76 on the substrate.
STEP 5 "The 26S proteasome recognises the tag": proteasome composite at x=272,y=46; substrate + chain docked at its 19S cap; labels "19S"/"20S".
STEP 6 "Unfold, thread in, recycle Ub": substrate becomes an extended line threading down the channel; Ub chain released to the left (DUBs); ATP badge near the cap.
STEP 7 "Peptides released": short peptide segments leave the bottom; free Ub reused.`,
  },
];

function findProcessScript(nameEn: string, nameHe: string): ProcessScript | null {
  return PROCESS_SCRIPTS.find((s) => s.match.test(nameEn) || s.match.test(nameHe)) ?? null;
}

function buildScriptedPrompt(
  nameEn: string,
  nameHe: string,
  contentEn: string,
  feedbackBlock: string,
  script: ProcessScript
): string {
  return `You are drawing a BIOLOGICALLY ACCURATE step-by-step animation for a Hebrew/English university biology site.
${feedbackBlock}
Process: "${nameEn}" (${nameHe})
Biology context: ${contentEn.slice(0, 500)}
${FORMAT_SPEC}
${script.body}

Use exactly ${script.stepCount} steps, in order.
${OUTPUT_SPEC}`;
}

export async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string,
  feedback?: string
): Promise<{ steps: object[]; legend: unknown[] }> {
  const isMeiosis = isMeiosisProcess(nameEn, nameHe);
  const script = isMeiosis ? null : findProcessScript(nameEn, nameHe);
  const stepCount = isMeiosis ? "8-10" : script ? script.stepCount : "5-6";

  const feedbackBlock = feedback?.trim()
    ? `\n═══════════════════════════════════════════\nIMPROVEMENT INSTRUCTIONS FROM ADMIN:\n═══════════════════════════════════════════\n${feedback.trim()}\nPlease address every point above in the new animation.\n`
    : "";

  const meiosisExtra = isMeiosis ? `
MEIOSIS — 8-10 steps: interphase → prophase I (synapsis, bivalents) → crossing over (chiasma; swap coloured tips) → metaphase I (bivalents on the plate) → anaphase I (HOMOLOGS separate, sisters stay joined) → telophase I (2 cells, n) → metaphase II → anaphase II (sisters separate) → 4 genetically different haploid cells.
Use "chromosome" composites (replicated) and "chromatid" composites (after separation); maternal #e11d48, paternal #2563eb; spindle microtubules as lines from centrosomes to centromeres; "cell" composites for the cell outline.
` : "";

  const generalPrompt = `You are drawing a BIOLOGICALLY ACCURATE step-by-step animation for a Hebrew/English university biology site.
${feedbackBlock}
Process to animate: "${nameEn}" (${nameHe})
Biology content: ${contentEn.slice(0, 900)}
${meiosisExtra}
${FORMAT_SPEC}
STRUCTURE OF THE ANIMATION:
  - Use exactly ${stepCount} steps: an establishing step (the full labelled scene), then one clear event per step, the outcome last.
  - Each step: at least 5 drawn shapes (composites count as their parts), labels with leader lines on the key structures.
  - Between steps, physically move the actors (reuse ids) so the process visibly advances.
${OUTPUT_SPEC}`;

  // A matched process script (meiosis-style) gives far better results and is
  // smaller, so it can afford a bigger output budget; otherwise use the library.
  const prompt = script
    ? buildScriptedPrompt(nameEn, nameHe, contentEn, feedbackBlock, script)
    : generalPrompt;
  const maxTokens = isMeiosis ? 5500 : script ? script.maxTokens : 6000;

  let completion;
  try {
    completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a biology visualization expert. Use real biological structures (composites), bilingual labels with leader lines and a legend. Return only valid JSON with no markdown.",
        },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      // Groq free tier caps TOTAL tokens/minute (prompt + output) at 12000. Keep
      // prompt(~4-5k) + max_tokens under that or the request is rejected (413).
      // The salvage parser recovers usable steps if the output is cut short.
      max_tokens: maxTokens,
    });
  } catch (err) {
    // Surface real API failures (rate limit, bad key, model error) to the caller.
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generate-animation-steps] Groq API error:", msg);
    throw new Error(`AI service error: ${msg}`);
  }

  const choice = completion.choices[0];
  const responseText = choice?.message?.content ?? "";
  const steps = parseStepsLoose(responseText);
  if (steps.length === 0) {
    console.error(
      "[generate-animation-steps] no steps parsed. finish_reason:",
      choice?.finish_reason,
      "output_len:",
      responseText.length
    );
  }
  return { steps, legend: parseLegendLoose(responseText) };
}
