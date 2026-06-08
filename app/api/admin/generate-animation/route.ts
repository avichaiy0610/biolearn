import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 50);
}

export const maxDuration = 60;

const MEIOSIS_KEYWORDS = /\bmeiosis\b|\bmeios[ei]s\b|מיוזה/i;

function isMeiosisProcess(nameEn: string, nameHe: string): boolean {
  return MEIOSIS_KEYWORDS.test(nameEn) || MEIOSIS_KEYWORDS.test(nameHe);
}

async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string
): Promise<object[]> {
  const stepCount = isMeiosisProcess(nameEn, nameHe) ? "12-14" : "7-9";

  const meiosisExtra = isMeiosisProcess(nameEn, nameHe) ? `
═══════════════════════════════════════════
MEIOSIS — MANDATORY 12-STEP SEQUENCE:
═══════════════════════════════════════════
You MUST generate ALL 12 stages below in order. Each must be visually distinct:
 1. Interphase       — cell with chromatin (diffuse), large nucleus
 2. Prophase I (Leptotene/Zygotene) — chromosomes condense as individual threads; homologs start to recognise
 3. Prophase I (Pachytene/Synapsis) — homologous pairs fully synapsed side-by-side → BIVALENTS (4 chromatids each pair, drawn as 4 closely packed thin ellipses)
 4. Prophase I (Diplotene/Diakinesis) — crossing-over: X-shaped chiasmata visible; show an overlapping X between one pair
 5. Metaphase I      — bivalents align at metaphase plate; spindle fibres from both poles
 6. Anaphase I       — homologous PAIRS (not chromatids) move to opposite poles; cell elongates
 7. Telophase I / Cytokinesis I — two haploid cells form; each has n chromosomes, each still consisting of 2 sister chromatids
 8. Prophase II      — show BOTH daughter cells; chromosomes recondense in each
 9. Metaphase II     — in both cells chromosomes (each = 2 chromatids) align at metaphase plate
10. Anaphase II      — sister chromatids separate and move to opposite poles in BOTH cells
11. Telophase II / Cytokinesis II — four haploid cells begin to form
12. Final result     — four distinct haploid daughter cells (gametes), each drawn as a small cell with single-chromatid chromosomes; label as "Haploid (n)"

KEY BIOLOGICAL RULES FOR MEIOSIS:
- Use TWO homolog colours: green (#16a34a / #4ade80) = homolog A, red (#dc2626 / #f87171) = homolog B
- In steps 3-7 (Meiosis I): homologs stay PAIRED. Move paired homologs together.
- In steps 8-12 (Meiosis II): sister chromatids separate. Each cell has n chromosomes.
- Chromosomes: use _b suffix for body (rx=4-5, ry=18-22), _c suffix for centromere (rx=8, ry=4)
- Step 4 crossing-over: show a line(x1,y1,x2,y2) in color="#f59e0b" crossing between the paired chromatids
- Steps 7 onward: draw TWO side-by-side cells (cell_l and cell_r) with their chromosomes
- Step 12: draw FOUR small cells (two rows of two) each labelled "n"
` : "";

  const prompt = `You are creating a VISUALLY RICH, BIOLOGICALLY ACCURATE animation for a biology education platform. The animation must look like a professional textbook diagram that MOVES — with proper cellular structures, realistic shapes, and dramatic motion.

Process to animate: "${nameEn}" (${nameHe})
Biology content: ${contentEn.slice(0, 800)}
${meiosisExtra}
═══════════════════════════════════════════
VISUAL DESIGN RULES — MANDATORY:
═══════════════════════════════════════════
1. LAYER shapes to create biological depth: outer membrane → cytoplasm → nucleus → contents
2. CELLS = large circle (color="#fdf4e3", stroke="#c9a55a", strokeWidth=2.5) + inner circle/ellipse for nucleus (color="#e8d4a0", stroke="#b89040", strokeWidth=1.5)
3. CHROMOSOMES = ALWAYS two elements: an elongated chromatid body + a centromere disc at the midpoint:
   - Body: ellipse(rx=5, ry=20) — use id suffix _b — colored #dc2626 (red) or #16a34a (green)
   - Centromere: ellipse(rx=9, ry=5) — use id suffix _c — ALWAYS color="#9f1239", layered on top of body, same cx/cy
   - When chromosomes MOVE, move BOTH elements by the same delta (keep cx/cy identical)
   Example (green chromosome pair at center 190,135):
     chr_g1_b(ellipse,cx=190,cy=135,rx=5,ry=20,color="#16a34a",op=1)
     chr_g1_c(ellipse,cx=190,cy=135,rx=9,ry=5,color="#9f1239",op=1)
     chr_g2_b(ellipse,cx=198,cy=135,rx=5,ry=20,color="#4ade80",op=0.9)
     chr_g2_c(ellipse,cx=198,cy=135,rx=9,ry=5,color="#9f1239",op=0.9)
4. PROTEINS/ENZYMES = medium circles (r=18-25) with vivid colors (#7c3aed, #f59e0b, #3b82f6)
5. Elements MUST travel 50-150 pixels between steps — show dramatic spatial change
6. Use ${stepCount} steps. Each step must be clearly different from the previous.
7. Include text labels for every key structure

CANVAS: viewBox 0 0 400 300
Zones: Left x=20-130 | Center x=140-260 | Right x=270-380
       Top y=15-80   | Middle y=90-210   | Bottom y=220-285

BIOLOGICAL COLOR PALETTE:
  Cell membrane: color="#fdf4e3", stroke="#c9a55a"
  Nucleus:       color="#e8d4a0", stroke="#b89040"
  Green chrom:   color="#16a34a"   Red chrom: color="#dc2626"
  Enzyme/protein: color="#7c3aed"  DNA: color="#3b82f6"
  RNA:           color="#f59e0b"   ATP/energy: color="#f97316"
  Membrane:      color="#22c55e"   Vesicle: color="#06b6d4"

═══════════════════════════════════════════
COMPLETE EXAMPLE — MITOSIS:
═══════════════════════════════════════════
Step 1 "Interphase":
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  nucleus(ellipse,cx=200,cy=150,rx=42,ry=38,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=1)
  chromatin_g(ellipse,cx=193,cy=143,rx=16,ry=9,color="#16a34a",op=0.6)
  chromatin_r(ellipse,cx=207,cy=157,rx=14,ry=9,color="#dc2626",op=0.6)
  lbl(text,x=200,y=258,label="Interphase",fontSize=12,textColor="#78350f",op=1)

Step 2 "Prophase — Chromosomes Condense" (nucleus fades, chr rods appear):
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  nucleus(ellipse,cx=200,cy=150,rx=42,ry=38,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=0.3)
  chr_g1_b(ellipse,cx=188,cy=136,rx=5,ry=20,color="#16a34a",op=1)
  chr_g1_c(ellipse,cx=188,cy=136,rx=9,ry=5,color="#9f1239",op=1)
  chr_g2_b(ellipse,cx=196,cy=136,rx=5,ry=20,color="#4ade80",op=0.85)
  chr_g2_c(ellipse,cx=196,cy=136,rx=9,ry=5,color="#9f1239",op=0.85)
  chr_r1_b(ellipse,cx=204,cy=164,rx=5,ry=20,color="#dc2626",op=1)
  chr_r1_c(ellipse,cx=204,cy=164,rx=9,ry=5,color="#9f1239",op=1)
  chr_r2_b(ellipse,cx=212,cy=164,rx=5,ry=20,color="#f87171",op=0.85)
  chr_r2_c(ellipse,cx=212,cy=164,rx=9,ry=5,color="#9f1239",op=0.85)
  lbl(text,x=200,y=258,label="Prophase — chromosomes condense",fontSize=11,textColor="#78350f",op=1)

Step 3 "Metaphase — Spindle Forms, Chromosomes Align":
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  spindle_l(line,x1=115,y1=150,x2=200,y2=150,color="#94a3b8",op=0.7)
  spindle_r(line,x1=285,y1=150,x2=200,y2=150,color="#94a3b8",op=0.7)
  chr_g1_b(ellipse,cx=197,cy=132,rx=5,ry=20,color="#16a34a",op=1)    ← MOVED to center
  chr_g1_c(ellipse,cx=197,cy=132,rx=9,ry=5,color="#9f1239",op=1)
  chr_g2_b(ellipse,cx=203,cy=132,rx=5,ry=20,color="#4ade80",op=0.85)
  chr_g2_c(ellipse,cx=203,cy=132,rx=9,ry=5,color="#9f1239",op=0.85)
  chr_r1_b(ellipse,cx=197,cy=168,rx=5,ry=20,color="#dc2626",op=1)    ← MOVED to center
  chr_r1_c(ellipse,cx=197,cy=168,rx=9,ry=5,color="#9f1239",op=1)
  chr_r2_b(ellipse,cx=203,cy=168,rx=5,ry=20,color="#f87171",op=0.85)
  chr_r2_c(ellipse,cx=203,cy=168,rx=9,ry=5,color="#9f1239",op=0.85)
  lbl(text,x=200,y=258,label="Metaphase — chromosomes aligned",fontSize=11,textColor="#78350f",op=1)

Step 4 "Anaphase — Chromatids PULLED APART (LARGE MOVEMENT)":
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  chr_g1_b(ellipse,cx=155,cy=132,rx=5,ry=18,color="#16a34a",op=1)    ← MOVES LEFT 42px
  chr_g1_c(ellipse,cx=155,cy=132,rx=9,ry=5,color="#9f1239",op=1)
  chr_g2_b(ellipse,cx=245,cy=132,rx=5,ry=18,color="#4ade80",op=0.85) ← MOVES RIGHT 42px
  chr_g2_c(ellipse,cx=245,cy=132,rx=9,ry=5,color="#9f1239",op=0.85)
  chr_r1_b(ellipse,cx=155,cy=168,rx=5,ry=18,color="#dc2626",op=1)    ← MOVES LEFT
  chr_r1_c(ellipse,cx=155,cy=168,rx=9,ry=5,color="#9f1239",op=1)
  chr_r2_b(ellipse,cx=245,cy=168,rx=5,ry=18,color="#f87171",op=0.85) ← MOVES RIGHT
  chr_r2_c(ellipse,cx=245,cy=168,rx=9,ry=5,color="#9f1239",op=0.85)
  lbl(text,x=200,y=258,label="Anaphase — chromatids separating",fontSize=11,textColor="#78350f",op=1)

Step 5 "Telophase — Two Nuclei Form":
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  nuc_l(circle,cx=148,cy=150,r=32,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=1)
  nuc_r(circle,cx=252,cy=150,r=32,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=1)
  chr_g1_b(ellipse,cx=140,cy=141,rx=4,ry=14,color="#16a34a",op=0.9)
  chr_g1_c(ellipse,cx=140,cy=141,rx=7,ry=4,color="#9f1239",op=0.9)
  chr_r1_b(ellipse,cx=156,cy=159,rx=4,ry=14,color="#dc2626",op=0.9)
  chr_r1_c(ellipse,cx=156,cy=159,rx=7,ry=4,color="#9f1239",op=0.9)
  chr_g2_b(ellipse,cx=244,cy=141,rx=4,ry=14,color="#16a34a",op=0.9)
  chr_g2_c(ellipse,cx=244,cy=141,rx=7,ry=4,color="#9f1239",op=0.9)
  chr_r2_b(ellipse,cx=260,cy=159,rx=4,ry=14,color="#dc2626",op=0.9)
  chr_r2_c(ellipse,cx=260,cy=159,rx=7,ry=4,color="#9f1239",op=0.9)
  lbl(text,x=200,y=258,label="Telophase — two nuclei form",fontSize=11,textColor="#78350f",op=1)

Step 6 "Cytokinesis — Cell Divides":
  cell_l(ellipse,cx=135,cy=150,rx=72,ry=80,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  cell_r(ellipse,cx=265,cy=150,rx=72,ry=80,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  nuc_l(circle,cx=135,cy=150,r=28,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=1)
  nuc_r(circle,cx=265,cy=150,r=28,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=1)
  lbl_l(text,x=135,y=255,label="Daughter cell 1",fontSize=10,textColor="#78350f",op=1)
  lbl_r(text,x=265,y=255,label="Daughter cell 2",fontSize=10,textColor="#78350f",op=1)
═══════════════════════════════════════════

NOW CREATE YOUR ANIMATION for "${nameEn}" using the same layered biological style.
Apply cell/nucleus layering, colored chromosomes or molecules, strokes on membranes, and dramatic movement.

Element types: circle(cx,cy,r), ellipse(cx,cy,rx,ry), rect(x,y,width,height), line(x1,y1,x2,y2), text(x,y,label,fontSize,textColor), path(d)
Required per element: id, type, color(hex), opacity(0-1)
Optional per element: stroke(hex), strokeWidth(number)

Return ONLY valid JSON:
{"steps":[
  {"titleHe":"היקשרות האנזים","titleEn":"Enzyme Binding","descHe":"האנזים פולימראז נקשר לאתר הפרומוטר על גבי רצף ה-DNA ויוצר קומפלקס פתיחה. הכריכה מביאה לשינוי תצורתי שמתח את שני גדילי ה-DNA.","descEn":"RNA polymerase binds to the promoter region of the DNA, forming an open complex. This binding causes a conformational change that unwinds the two DNA strands at the transcription start site.","elements":[
    {"id":"cell","type":"circle","cx":200,"cy":150,"r":85,"color":"#fdf4e3","stroke":"#c9a55a","strokeWidth":2.5,"opacity":1},
    {"id":"nucleus","type":"ellipse","cx":200,"cy":150,"rx":42,"ry":38,"color":"#e8d4a0","stroke":"#b89040","strokeWidth":1.5,"opacity":1},
    {"id":"lbl","type":"text","x":200,"y":258,"label":"Enzyme binds DNA","textColor":"#1e3a5f","fontSize":11,"opacity":1}
  ],"highlight":["cell","nucleus"]}
]}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology visualization expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: isMeiosisProcess(nameEn, nameHe) ? 14000 : 8000,
    });
    const responseText = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(responseText);
    const steps =
      parsed.steps ??
      parsed.animation?.steps ??
      parsed.animationSteps ??
      parsed.data?.steps ??
      [];
    return Array.isArray(steps) ? steps : [];
  } catch (err) {
    console.error("[generate-animation] failed:", err);
    return [];
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const {
    subtopicId,
    topicSlug: directTopicSlug,
    nameHe: directNameHe,
    nameEn: directNameEn,
    contentEn: directContentEn,
  } = body;

  let nameHe: string, nameEn: string, contentEn: string, topicId: string;
  let subtopicToLink: string | null = null;
  let processSlugBase: string;

  if (subtopicId) {
    const subtopic = await prisma.subtopic.findUnique({
      where: { id: subtopicId },
      include: { topic: true },
    });
    if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });
    nameHe = subtopic.nameHe;
    nameEn = subtopic.nameEn;
    contentEn = subtopic.contentEn;
    topicId = subtopic.topicId;
    subtopicToLink = subtopicId;
    processSlugBase = subtopic.slug;
  } else if (directTopicSlug && directNameEn) {
    const topic = await prisma.topic.findUnique({ where: { slug: directTopicSlug } });
    if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });
    nameHe = directNameHe ?? directNameEn;
    nameEn = directNameEn;
    contentEn = directContentEn ?? "";
    topicId = topic.id;
    processSlugBase = slugify(nameEn);
  } else {
    return Response.json({ error: "subtopicId or (topicSlug + nameEn) required" }, { status: 400 });
  }

  const steps = await generateAnimationSteps(nameEn, nameHe, contentEn);

  if (steps.length === 0) {
    return Response.json({ error: "AI failed to generate animation steps" }, { status: 500 });
  }

  const processSlug = `${processSlugBase}-animation-${Date.now()}`;

  const process = await prisma.process.create({
    data: {
      topicId,
      slug: processSlug,
      nameHe,
      nameEn,
      descHe: `אנימציה: ${nameHe}`,
      descEn: `Animation: ${nameEn}`,
      steps: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        create: steps.map((s: any, i: number) => ({
          order: i + 1,
          titleHe: String(s.titleHe ?? ""),
          titleEn: String(s.titleEn ?? ""),
          descHe: String(s.descHe ?? ""),
          descEn: String(s.descEn ?? ""),
          svgData: JSON.stringify({
            elements: s.elements ?? [],
            highlight: s.highlight ?? [],
          }),
        })),
      },
    },
  });

  if (subtopicToLink) {
    await prisma.subtopic.update({
      where: { id: subtopicToLink },
      data: { relatedProcessSlug: processSlug },
    });
  }

  return Response.json({ processSlug: process.slug, stepsCreated: steps.length });
}
