import { groq, QUALITY_MODEL } from "@/lib/groq";

const MEIOSIS_KEYWORDS = /\bmeiosis\b|\bmeios[ei]s\b|מיוזה/i;

export function isMeiosisProcess(nameEn: string, nameHe: string): boolean {
  return MEIOSIS_KEYWORDS.test(nameEn) || MEIOSIS_KEYWORDS.test(nameHe);
}

const SHAPE_LIBRARY = `
═══════════════════════════════════════════
BIOLOGICAL SHAPE LIBRARY — use these templates, adapt positions as needed
CANVAS: viewBox 0 0 400 300  (x: 0=left 400=right, y: 0=top 300=bottom)
RENDER NOTE: a "path" WITH a "color" is FILLED (organelle bodies); a "path" WITHOUT
"color" is a STROKE-ONLY line (membranes, cristae, strands). Prefer detailed paths
over plain circles — they render with gradients, shadow and glow automatically.
═══════════════════════════════════════════

▸ CELL (organic lobed membrane — richer than a plain oval):
  {"id":"cell","type":"path","d":"M 92 150 C 90 100 128 66 200 65 C 274 64 312 104 310 155 C 312 208 268 245 200 246 C 130 247 94 206 92 150 Z","color":"#fdf4e3","stroke":"#c9a55a","strokeWidth":2.5}
  {"id":"nucleus","type":"ellipse","cx":200,"cy":150,"rx":48,"ry":38,"color":"#fef9c3","stroke":"#ca8a04","strokeWidth":2}
  {"id":"nuc_envelope","type":"path","d":"M 200 112 C 232 112 248 132 248 150 C 248 170 230 188 200 188","stroke":"#a16207","strokeWidth":1}
  {"id":"nuc_pore1","type":"circle","cx":200,"cy":112,"r":2,"color":"#a16207"}
  {"id":"nuc_pore2","type":"circle","cx":238,"cy":135,"r":2,"color":"#a16207"}
  {"id":"nuc_pore3","type":"circle","cx":236,"cy":170,"r":2,"color":"#a16207"}
  {"id":"nucleolus","type":"circle","cx":200,"cy":148,"r":13,"color":"#fde047","stroke":"#a16207","strokeWidth":1.5}

▸ MEMBRANE / PHOSPHOLIPID BILAYER (band of two head rows; repeat heads across width):
  {"id":"membrane_band","type":"rect","x":40,"y":96,"width":320,"height":18,"rx":3,"color":"#fef3c7","stroke":"#d97706","strokeWidth":1,"opacity":0.6}
  {"id":"membrane_h1","type":"circle","cx":60,"cy":99,"r":3.5,"color":"#f59e0b"}
  {"id":"membrane_h2","type":"circle","cx":78,"cy":99,"r":3.5,"color":"#f59e0b"}
  {"id":"membrane_h3","type":"circle","cx":60,"cy":111,"r":3.5,"color":"#f59e0b"}
  {"id":"membrane_h4","type":"circle","cx":78,"cy":111,"r":3.5,"color":"#f59e0b"}
  (…continue head circles every ~18px to fill the band; top row y=99, bottom row y=111)

▸ MITOCHONDRIA (capsule outer membrane + folded finger cristae):
  {"id":"mito","type":"path","d":"M 250 173 L 290 173 A 22 22 0 0 1 290 217 L 250 217 A 22 22 0 0 1 250 173 Z","color":"#fed7aa","stroke":"#ea580c","strokeWidth":2}
  {"id":"mito_cristae","type":"path","d":"M 250 179 C 264 186 264 204 250 211 M 266 179 C 280 186 280 204 266 211 M 282 179 C 296 186 296 204 282 211","stroke":"#c2410c","strokeWidth":1.5}

▸ CHLOROPLAST (outer envelope + grana thylakoid stacks + stroma lamella):
  {"id":"chloro","type":"ellipse","cx":130,"cy":205,"rx":48,"ry":30,"color":"#bbf7d0","stroke":"#15803d","strokeWidth":2}
  {"id":"chloro_lamella","type":"path","d":"M 96 210 Q 130 216 164 206","stroke":"#15803d","strokeWidth":1.5}
  {"id":"chloro_g1","type":"ellipse","cx":112,"cy":200,"rx":7,"ry":9,"color":"#22c55e","stroke":"#15803d","strokeWidth":1}
  {"id":"chloro_g2","type":"ellipse","cx":132,"cy":210,"rx":7,"ry":9,"color":"#22c55e","stroke":"#15803d","strokeWidth":1}
  {"id":"chloro_g3","type":"ellipse","cx":152,"cy":199,"rx":7,"ry":9,"color":"#22c55e","stroke":"#15803d","strokeWidth":1}

▸ ROUGH ER (folded membrane sheets studded with ribosomes):
  {"id":"er_fold","type":"path","d":"M 255 116 C 292 110 292 132 256 128 C 292 138 292 160 256 154","stroke":"#d97706","strokeWidth":2}
  {"id":"rib_er1","type":"circle","cx":260,"cy":118,"r":2.5,"color":"#92400e"}
  {"id":"rib_er2","type":"circle","cx":286,"cy":123,"r":2.5,"color":"#92400e"}
  {"id":"rib_er3","type":"circle","cx":262,"cy":150,"r":2.5,"color":"#92400e"}

▸ LYSOSOME (vesicle with granular enzymes):
  {"id":"lyso","type":"circle","cx":300,"cy":120,"r":15,"color":"#fbcfe8","stroke":"#be185d","strokeWidth":2}
  {"id":"lyso_d1","type":"circle","cx":295,"cy":116,"r":2.5,"color":"#9d174d"}
  {"id":"lyso_d2","type":"circle","cx":305,"cy":122,"r":2.5,"color":"#9d174d"}
  {"id":"lyso_d3","type":"circle","cx":299,"cy":126,"r":2.5,"color":"#9d174d"}

▸ VACUOLE (large pale fluid-filled sac):
  {"id":"vacuole","type":"ellipse","cx":150,"cy":118,"rx":34,"ry":28,"color":"#e0f2fe","stroke":"#0284c7","strokeWidth":2,"opacity":0.7}

▸ MEMBRANE RECEPTOR (spans membrane; ligand binds on top — signal transduction):
  {"id":"protein_receptor","type":"rect","x":192,"y":90,"width":16,"height":34,"rx":4,"color":"#c4b5fd","stroke":"#7c3aed","strokeWidth":2}
  {"id":"protein_ligand","type":"circle","cx":200,"cy":80,"r":7,"color":"#f0abfc","stroke":"#a21caf","strokeWidth":1.5}

▸ RIBOSOME (large + small subunit):
  {"id":"rib_L","type":"circle","cx":160,"cy":200,"r":10,"color":"#fbbf24","stroke":"#d97706","strokeWidth":1.5}
  {"id":"rib_S","type":"circle","cx":160,"cy":189,"r":7,"color":"#fde68a","stroke":"#d97706","strokeWidth":1.5}

▸ GOLGI APPARATUS (5 stacked arcs):
  {"id":"golgi1","type":"path","d":"M 130 118 Q 200 106 270 118 L 268 126 Q 200 114 132 126 Z","color":"#a7f3d0","stroke":"#059669","strokeWidth":1.5}
  {"id":"golgi2","type":"path","d":"M 128 127 Q 200 115 272 127 L 270 135 Q 200 123 130 135 Z","color":"#6ee7b7","stroke":"#059669","strokeWidth":1.5}
  {"id":"golgi3","type":"path","d":"M 126 136 Q 200 124 274 136 L 272 144 Q 200 132 128 144 Z","color":"#34d399","stroke":"#059669","strokeWidth":1.5}
  {"id":"golgi4","type":"path","d":"M 124 145 Q 200 133 276 145 L 274 153 Q 200 141 126 153 Z","color":"#10b981","stroke":"#059669","strokeWidth":1.5}
  {"id":"golgi5","type":"path","d":"M 122 154 Q 200 142 278 154 L 276 162 Q 200 150 124 162 Z","color":"#059669","stroke":"#047857","strokeWidth":1.5}

▸ ENZYME + ACTIVE SITE:
  {"id":"enzyme","type":"circle","cx":200,"cy":150,"r":26,"color":"#c7d2fe","stroke":"#6366f1","strokeWidth":2}
  {"id":"enzyme_cleft","type":"path","d":"M 188 145 Q 200 158 212 145","stroke":"#4338ca","strokeWidth":3}
  {"id":"substrate","type":"circle","cx":200,"cy":132,"r":10,"color":"#fca5a5","stroke":"#dc2626","strokeWidth":1.5}

▸ DNA DOUBLE HELIX (vertical strand):
  {"id":"dna_s1","type":"path","d":"M 190 90 Q 205 108 190 126 Q 175 144 190 162 Q 205 180 190 198","stroke":"#2563eb","strokeWidth":2.5}
  {"id":"dna_s2","type":"path","d":"M 190 90 Q 175 108 190 126 Q 205 144 190 162 Q 175 180 190 198","stroke":"#dc2626","strokeWidth":2.5}
  {"id":"dna_r1","type":"line","x1":185,"y1":100,"x2":195,"y2":100,"stroke":"#94a3b8","strokeWidth":2}
  {"id":"dna_r2","type":"line","x1":185,"y1":117,"x2":195,"y2":117,"stroke":"#94a3b8","strokeWidth":2}
  {"id":"dna_r3","type":"line","x1":185,"y1":134,"x2":195,"y2":134,"stroke":"#94a3b8","strokeWidth":2}
  {"id":"dna_r4","type":"line","x1":185,"y1":151,"x2":195,"y2":151,"stroke":"#94a3b8","strokeWidth":2}
  {"id":"dna_r5","type":"line","x1":185,"y1":168,"x2":195,"y2":168,"stroke":"#94a3b8","strokeWidth":2}

▸ mRNA (wavy single strand):
  {"id":"mrna","type":"path","d":"M 100 155 Q 130 143 160 155 Q 190 167 220 155 Q 250 143 280 155 Q 310 167 330 155","stroke":"#f59e0b","strokeWidth":3}
  {"id":"mrna_label","type":"text","x":200,"y":175,"label":"mRNA","fontSize":10,"textColor":"#d97706"}

▸ tRNA (cloverleaf simplified):
  {"id":"trna","type":"path","d":"M 240 140 Q 255 128 270 140 Q 255 135 240 140 Z","color":"#d8b4fe","stroke":"#7c3aed","strokeWidth":1.5}
  {"id":"trna_stem","type":"line","x1":255,"y1":140,"x2":255,"y2":162,"stroke":"#7c3aed","strokeWidth":2}
  {"id":"trna_aa","type":"circle","cx":255,"cy":168,"r":7,"color":"#f0abfc","stroke":"#a21caf","strokeWidth":1.5}

▸ ATP MOLECULE:
  {"id":"atp","type":"circle","cx":320,"cy":200,"r":10,"color":"#fef08a","stroke":"#ca8a04","strokeWidth":2}
  {"id":"atp_label","type":"text","x":320,"y":217,"label":"ATP","fontSize":9,"textColor":"#854d0e"}

▸ VESICLE (transport bubble):
  {"id":"vesicle","type":"circle","cx":240,"cy":170,"r":16,"color":"#fce7f3","stroke":"#db2777","strokeWidth":2}

▸ CHROMOSOME PAIR (id suffix _b = body, _c = centromere):
  Green homolog A:
    {"id":"chrA_b","type":"ellipse","cx":185,"cy":150,"rx":5,"ry":20,"color":"#4ade80","stroke":"#16a34a","strokeWidth":1}
    {"id":"chrA_c","type":"ellipse","cx":185,"cy":150,"rx":9,"ry":5,"color":"#9f1239","stroke":"#9f1239","strokeWidth":1}
  Red homolog B:
    {"id":"chrB_b","type":"ellipse","cx":215,"cy":150,"rx":5,"ry":20,"color":"#f87171","stroke":"#dc2626","strokeWidth":1}
    {"id":"chrB_c","type":"ellipse","cx":215,"cy":150,"rx":9,"ry":5,"color":"#9f1239","stroke":"#9f1239","strokeWidth":1}

▸ SPINDLE FIBERS (from poles to centromere):
  {"id":"spindle_l","type":"line","x1":60,"y1":150,"x2":185,"y2":150,"stroke":"#7c3aed","strokeWidth":1.5}
  {"id":"spindle_r","type":"line","x1":340,"y1":150,"x2":215,"y2":150,"stroke":"#7c3aed","strokeWidth":1.5}

▸ RNA POLYMERASE (on DNA):
  {"id":"rnap","type":"ellipse","cx":200,"cy":125,"rx":22,"ry":15,"color":"#bfdbfe","stroke":"#3b82f6","strokeWidth":2}
  {"id":"rnap_label","type":"text","x":200,"y":122,"label":"RNA Pol","fontSize":8,"textColor":"#1d4ed8"}

▸ PROTEIN CHAIN (growing polypeptide):
  {"id":"polypep","type":"path","d":"M 240 160 Q 255 155 270 162 Q 285 169 300 164","stroke":"#a78bfa","strokeWidth":3}

▸ CELL PLATE / DIVIDING WALL:
  {"id":"cell_plate","type":"line","x1":200,"y1":75,"x2":200,"y2":235,"stroke":"#84cc16","strokeWidth":3}

ID PREFIX RULE: keep organelle ids on their canonical prefix (cell, nuc, membrane, mito, chloro, er_, rib, golgi, lyso, vacuole, perox, enzyme, protein, dna, rna, mrna, trna, atp, vesicle, spindle). Only elongated ellipses whose id is none of these become chromosomes.
`;

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

export async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string,
  feedback?: string
): Promise<object[]> {
  const isMeiosis = isMeiosisProcess(nameEn, nameHe);
  const stepCount = isMeiosis ? "10-12" : "8";

  const feedbackBlock = feedback?.trim()
    ? `\n═══════════════════════════════════════════\nIMPROVEMENT INSTRUCTIONS FROM ADMIN:\n═══════════════════════════════════════════\n${feedback.trim()}\nPlease address every point above in the new animation.\n`
    : "";

  const meiosisExtra = isMeiosis ? `
═══════════════════════════════════════════
MEIOSIS — MANDATORY 12-STEP SEQUENCE:
═══════════════════════════════════════════
You MUST generate ALL 12 stages below in order. Each must be visually distinct:
 1. Interphase       — cell with diffuse chromatin, large nucleus, nucleolus, show mitochondria
 2. Prophase I (Leptotene/Zygotene) — chromosomes condense; homologs begin to pair
 3. Prophase I (Pachytene/Synapsis) — homologous pairs fully synapsed → BIVALENTS (4 chromatids, drawn as 4 closely packed ellipses)
 4. Prophase I (Diplotene/Diakinesis) — crossing-over: X-shaped chiasmata visible; show overlapping X in #f59e0b between one pair
 5. Metaphase I      — bivalents align at metaphase plate; show spindle fibers from both poles
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

  const prompt = `You are creating a VISUALLY RICH, BIOLOGICALLY ACCURATE step-by-step animation for a high school/university biology platform.
${feedbackBlock}
Process to animate: "${nameEn}" (${nameHe})
Biology content: ${contentEn.slice(0, 900)}
${meiosisExtra}
${SHAPE_LIBRARY}
═══════════════════════════════════════════
ANIMATION DESIGN RULES — MANDATORY:
═══════════════════════════════════════════
1. USE the shape library above. Copy element templates and adapt positions/colors.
   - Cell division → chromosomes + spindle fibers + cell plate
   - Protein synthesis → ribosome ON mRNA + tRNA delivering amino acids + growing polypeptide chain
   - Cellular respiration → mitochondria (capsule + cristae) + glucose in + ATP molecules appearing + CO2/H2O out
   - Photosynthesis → chloroplast (chloro + grana) + light-ray lines hitting grana + CO2/H2O in + O2 + glucose out
   - DNA replication → unzipped dna_s1/dna_s2 fork + polymerase + new complementary strand being built
   - Transcription → dna + RNA polymerase moving along + mRNA extruding + nuclear pore export
   - Enzyme catalysis → enzyme with cleft + substrate entering active site + product leaving
   - Vesicle transport → vesicle budding from Golgi + moving toward membrane + exocytosis
   - Signal transduction → protein_receptor in membrane + protein_ligand binding + signaling proteins cascading inward
   - Osmosis / diffusion → membrane_band + molecules crossing from high to low concentration

2. LAYER shapes correctly:
   - Bottom layer: cell membrane (ellipse)
   - Middle: nucleus, organelles (mitochondria, Golgi, ER)
   - Top: molecules (ribosomes, mRNA, proteins), spindle fibers, labels

3. MOVEMENT: In each step, move key actors 60-140 pixels from their previous position.
   Always update BOTH _b and _c parts of chromosomes by the same delta.
   Move ribosomes ALONG the mRNA strand.

4. HIGHLIGHT: The "highlight" array should list ids of the elements undergoing change in this step.

5. LABELS: Add a text element for every key structure. Hebrew labels not needed — use short English names.

6. VISUAL RICHNESS: Each step must be noticeably different. Add/remove elements to show:
   - New molecules appearing (ATP being produced, proteins being synthesized)
   - Organelles moving or changing shape
   - Membranes deforming, fusing, or pinching

7. Use exactly ${stepCount} steps. Non-meiosis processes: aim for 8-10 richly detailed steps.

8. QUALITY BAR — treat EVERY process with the same care as a meiosis animation:
   - Open with an establishing step (the full labelled scene at rest), then one clear
     event per step, and close with the finished product/outcome.
   - Carry elements across steps by REUSING THE SAME id so they animate smoothly;
     only change coordinates/opacity. Introduce a new id only for something genuinely new.
   - Every step's "descHe"/"descEn" must state what physically changed since the prior step.
   - Prefer the detailed path-based organelles over lone circles. A step should never be
     just 2-3 primitives — build a real scene (membrane + organelles + molecules + labels).

Return ONLY valid JSON (no markdown):
{"steps":[
  {"titleHe":"שם שלב","titleEn":"Step Name","descHe":"תיאור מפורט...","descEn":"Detailed description...","elements":[
    {"id":"cell","type":"ellipse","cx":200,"cy":155,"rx":110,"ry":90,"color":"#fdf4e3","stroke":"#c9a55a","strokeWidth":2.5}
  ],"highlight":["cell"]}
]}`;

  let completion;
  try {
    completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a biology visualization expert. Use the provided shape library to create rich, accurate animations. Return only valid JSON with no markdown.",
        },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      // Groq free tier caps TOTAL tokens/minute (prompt + output) at 12000. Keep
      // prompt(~4-5k) + max_tokens under that or the request is rejected (413).
      // The salvage parser recovers usable steps if the output is cut short.
      max_tokens: isMeiosis ? 5500 : 6000,
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
  return steps;
}
