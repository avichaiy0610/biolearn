import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 50);
}

export const maxDuration = 60;

async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string
): Promise<object[]> {
  const prompt = `You are creating a VISUALLY RICH, BIOLOGICALLY ACCURATE animation for a biology education platform. The animation must look like a professional textbook diagram that MOVES — with proper cellular structures, realistic shapes, and dramatic motion.

Process to animate: "${nameEn}" (${nameHe})
Biology content: ${contentEn.slice(0, 800)}

═══════════════════════════════════════════
VISUAL DESIGN RULES — MANDATORY:
═══════════════════════════════════════════
1. LAYER shapes to create biological depth: outer membrane → cytoplasm → nucleus → contents
2. CELLS = large circle (color="#fdf4e3", stroke="#c9a55a", strokeWidth=2.5) + inner circle/ellipse for nucleus (color="#e8d4a0", stroke="#b89040", strokeWidth=1.5)
3. CHROMOSOMES = elongated ellipses (rx=6, ry=20) colored red (#dc2626) or green (#16a34a), not plain circles
4. PROTEINS/ENZYMES = medium circles (r=18-25) with vivid colors (#7c3aed, #f59e0b, #3b82f6)
5. Elements MUST travel 50-150 pixels between steps — show dramatic spatial change
6. Use 7-9 steps. Each step must be clearly different from the previous.
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
  chr_g1(ellipse,cx=188,cy=136,rx=6,ry=20,color="#16a34a",op=1)
  chr_g2(ellipse,cx=196,cy=136,rx=6,ry=20,color="#16a34a",op=0.8)
  chr_r1(ellipse,cx=204,cy=164,rx=6,ry=20,color="#dc2626",op=1)
  chr_r2(ellipse,cx=212,cy=164,rx=6,ry=20,color="#dc2626",op=0.8)
  lbl(text,x=200,y=258,label="Prophase — chromosomes condense",fontSize=11,textColor="#78350f",op=1)

Step 3 "Metaphase — Spindle Forms, Chromosomes Align":
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  spindle_l(line,x1=115,y1=150,x2=200,y2=150,color="#94a3b8",op=0.7)
  spindle_r(line,x1=285,y1=150,x2=200,y2=150,color="#94a3b8",op=0.7)
  chr_g1(ellipse,cx=197,cy=132,rx=6,ry=20,color="#16a34a",op=1)    ← MOVED to center
  chr_g2(ellipse,cx=203,cy=132,rx=6,ry=20,color="#16a34a",op=0.8)
  chr_r1(ellipse,cx=197,cy=168,rx=6,ry=20,color="#dc2626",op=1)    ← MOVED to center
  chr_r2(ellipse,cx=203,cy=168,rx=6,ry=20,color="#dc2626",op=0.8)
  lbl(text,x=200,y=258,label="Metaphase — chromosomes aligned",fontSize=11,textColor="#78350f",op=1)

Step 4 "Anaphase — Chromatids PULLED APART (LARGE MOVEMENT)":
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  chr_g1(ellipse,cx=155,cy=132,rx=6,ry=18,color="#16a34a",op=1)    ← MOVES LEFT 42px
  chr_g2(ellipse,cx=245,cy=132,rx=6,ry=18,color="#16a34a",op=0.8)  ← MOVES RIGHT 42px
  chr_r1(ellipse,cx=155,cy=168,rx=6,ry=18,color="#dc2626",op=1)    ← MOVES LEFT
  chr_r2(ellipse,cx=245,cy=168,rx=6,ry=18,color="#dc2626",op=0.8)  ← MOVES RIGHT
  lbl(text,x=200,y=258,label="Anaphase — chromatids separating",fontSize=11,textColor="#78350f",op=1)

Step 5 "Telophase — Two Nuclei Form":
  cell(circle,cx=200,cy=150,r=85,color="#fdf4e3",stroke="#c9a55a",strokeWidth=2.5,op=1)
  nuc_l(circle,cx=148,cy=150,r=32,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=1)
  nuc_r(circle,cx=252,cy=150,r=32,color="#e8d4a0",stroke="#b89040",strokeWidth=1.5,op=1)
  chr_g1(ellipse,cx=140,cy=141,rx=5,ry=14,color="#16a34a",op=0.9)
  chr_r1(ellipse,cx=156,cy=159,rx=5,ry=14,color="#dc2626",op=0.9)
  chr_g2(ellipse,cx=244,cy=141,rx=5,ry=14,color="#16a34a",op=0.9)
  chr_r2(ellipse,cx=260,cy=159,rx=5,ry=14,color="#dc2626",op=0.9)
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
      max_tokens: 8000,
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
