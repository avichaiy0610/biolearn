import { groq, QUALITY_MODEL } from "@/lib/groq";

const MEIOSIS_KEYWORDS = /\bmeiosis\b|\bmeios[ei]s\b|מיוזה/i;

export function isMeiosisProcess(nameEn: string, nameHe: string): boolean {
  return MEIOSIS_KEYWORDS.test(nameEn) || MEIOSIS_KEYWORDS.test(nameHe);
}

export async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string,
  feedback?: string
): Promise<object[]> {
  const isMeiosis = isMeiosisProcess(nameEn, nameHe);
  const stepCount = isMeiosis ? "12-14" : "7-9";

  const feedbackBlock = feedback?.trim()
    ? `\n═══════════════════════════════════════════\nIMPROVEMENT INSTRUCTIONS FROM ADMIN:\n═══════════════════════════════════════════\n${feedback.trim()}\nPlease address every point above in the new animation.\n`
    : "";

  const meiosisExtra = isMeiosis ? `
═══════════════════════════════════════════
MEIOSIS — MANDATORY 12-STEP SEQUENCE:
═══════════════════════════════════════════
You MUST generate ALL 12 stages below in order. Each must be visually distinct:
 1. Interphase       — cell with chromatin (diffuse), large nucleus
 2. Prophase I (Leptotene/Zygotene) — chromosomes condense; homologs begin to recognise each other
 3. Prophase I (Pachytene/Synapsis) — homologous pairs fully synapsed side-by-side → BIVALENTS (4 chromatids each pair, drawn as 4 closely packed thin ellipses)
 4. Prophase I (Diplotene/Diakinesis) — crossing-over: X-shaped chiasmata visible; show overlapping X between one pair
 5. Metaphase I      — bivalents align at metaphase plate; spindle fibres from both poles
 6. Anaphase I       — homologous PAIRS (not chromatids) move to opposite poles; cell elongates
 7. Telophase I / Cytokinesis I — two haploid cells form; each has n chromosomes still as 2 chromatids
 8. Prophase II      — BOTH daughter cells shown; chromosomes recondense
 9. Metaphase II     — in both cells chromosomes align at metaphase plate
10. Anaphase II      — sister chromatids separate to opposite poles in BOTH cells
11. Telophase II / Cytokinesis II — four haploid cells forming
12. Final result     — four distinct haploid daughter cells, label "Haploid (n)"

KEY RULES FOR MEIOSIS:
- Two homolog colours: green (#16a34a/#4ade80) = homolog A, red (#dc2626/#f87171) = homolog B
- Steps 1-7 (Meiosis I): homologs stay PAIRED. Move pairs together.
- Steps 8-12 (Meiosis II): sister chromatids separate.
- Chromosomes: _b suffix (rx=4-5, ry=18-22), _c suffix centromere (rx=8, ry=4)
- Step 4: add a line crossing between chromatids in color="#f59e0b"
- Steps 7+: draw TWO side-by-side cells (cell_l + cell_r)
- Step 12: draw FOUR small cells, two rows of two
` : "";

  const prompt = `You are creating a VISUALLY RICH, BIOLOGICALLY ACCURATE animation for a biology education platform.
${feedbackBlock}
Process to animate: "${nameEn}" (${nameHe})
Biology content: ${contentEn.slice(0, 800)}
${meiosisExtra}
═══════════════════════════════════════════
VISUAL DESIGN RULES — MANDATORY:
═══════════════════════════════════════════
1. LAYER shapes: outer membrane → cytoplasm → nucleus → contents
2. CELLS = large circle (color="#fdf4e3", stroke="#c9a55a", strokeWidth=2.5) + nucleus ellipse (color="#e8d4a0", stroke="#b89040", strokeWidth=1.5)
3. CHROMOSOMES = two elements: body ellipse (rx=5, ry=20, id suffix _b) + centromere ellipse (rx=9, ry=5, id suffix _c, color="#9f1239")
   When chromosomes MOVE, move BOTH elements by the same delta.
4. PROTEINS/ENZYMES = medium circles (r=18-25) with vivid colors
5. Elements MUST travel 50-150 pixels between steps
6. Use ${stepCount} steps. Each step must be clearly different from the previous.
7. Include text labels for every key structure

CANVAS: viewBox 0 0 400 300

Return ONLY valid JSON:
{"steps":[
  {"titleHe":"שם שלב","titleEn":"Step Name","descHe":"תיאור...","descEn":"Description...","elements":[
    {"id":"cell","type":"circle","cx":200,"cy":150,"r":85,"color":"#fdf4e3","stroke":"#c9a55a","strokeWidth":2.5,"opacity":1}
  ],"highlight":["cell"]}
]}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology visualization expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: isMeiosis ? 14000 : 8000,
    });
    const responseText = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(responseText);
    const steps = parsed.steps ?? parsed.animation?.steps ?? parsed.animationSteps ?? parsed.data?.steps ?? [];
    return Array.isArray(steps) ? steps : [];
  } catch (err) {
    console.error("[generate-animation-steps] failed:", err);
    return [];
  }
}
