import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string
): Promise<object[]> {
  const prompt = `You are creating a CINEMATIC BIOLOGY ANIMATION where molecules and cells dramatically MOVE across the screen like a real scientific video.

Process to animate: "${nameEn}" (${nameHe})
Biology content: ${contentEn.slice(0, 800)}

═══════════════════════════════════════════
CRITICAL MOTION RULES — MANDATORY:
═══════════════════════════════════════════
1. Elements MUST travel large distances between steps (50-150 pixels of movement)
2. Objects should approach each other, bind, then separate
3. Products should move AWAY from the reaction center
4. Use 7-9 steps for detailed, smooth cinematic motion
5. Each step should show a CLEARLY DIFFERENT spatial arrangement

CANVAS: viewBox 0 0 400 300
Spatial zones:
  Left side:   x=20-130,  Center: x=150-250,  Right side: x=270-380
  Top:         y=20-80,   Middle: y=100-200,   Bottom:     y=220-280

═══════════════════════════════════════════
EXAMPLE OF GOOD DRAMATIC MOTION (DNA Replication):
═══════════════════════════════════════════
Step 1 "Double Helix at Rest":
  dna_left(ellipse,cx=90,cy=150,rx=70,ry=18,blue,op=1)   ← left strand
  dna_right(ellipse,cx=310,cy=150,rx=70,ry=18,cyan,op=1) ← right strand
  helicase(circle,cx=200,cy=150,r=22,orange,op=0)         ← enzyme not yet visible
  arrow(line,x1=200,y1=60,x2=200,y2=110,gray,op=0)

Step 2 "Helicase Arrives" (helicase APPEARS and moves to center):
  dna_left(ellipse,cx=90,cy=150,rx=70,ry=18,blue)
  dna_right(ellipse,cx=310,cy=150,rx=70,ry=18,cyan)
  helicase(circle,cx=200,cy=150,r=22,orange,op=1)         ← NOW VISIBLE

Step 3 "Strands Begin Separating" (DNA strands MOVE APART):
  dna_left(ellipse,cx=90,cy=100,rx=70,ry=18,blue)         ← MOVES UP by 50px
  dna_right(ellipse,cx=310,cy=200,rx=70,ry=18,cyan)       ← MOVES DOWN by 50px
  helicase(circle,cx=200,cy=150,r=28,orange)              ← grows bigger

Step 4 "Full Separation + New Strands Form" (products appear and MOVE):
  dna_left(ellipse,cx=50,cy=70,rx=90,ry=15,blue)          ← moves far top-left
  dna_right(ellipse,cx=350,cy=230,rx=90,ry=15,cyan)       ← moves far bottom-right
  helicase(circle,cx=200,cy=150,r=28,orange,op=0.4)       ← fades
  new_strand_a(ellipse,cx=50,cy=100,rx=80,ry=15,green,op=0.8)  ← NEW appears
  new_strand_b(ellipse,cx=350,cy=200,rx=80,ry=15,pink,op=0.8)  ← NEW appears

... continue with products separating and moving to final positions
═══════════════════════════════════════════

Element types: circle(cx,cy,r), ellipse(cx,cy,rx,ry), rect(x,y,width,height), line(x1,y1,x2,y2), text(x,y,label,fontSize 10-12,textColor), path(d)
Required fields per element: id, type, color(hex), opacity(0-1)
Rich color palette: "#3b82f6","#22c55e","#f59e0b","#ec4899","#7c3aed","#06b6d4","#ef4444","#10b981","#f97316","#8b5cf6","#14b8a6","#f43f5e"

Use 8-14 elements. Include text labels so viewers know what each element is.
Highlights (highlight array) = which elements are the focus of each step.

Return ONLY valid JSON:
{"steps":[
  {"titleHe":"שם השלב","titleEn":"Step Name","descHe":"תיאור מדויק מה קורה בשלב זה","descEn":"Precise description of what happens in this step","elements":[
    {"id":"elementId","type":"circle","cx":200,"cy":150,"r":25,"color":"#3b82f6","opacity":1},
    {"id":"lbl_element","type":"text","x":200,"y":185,"label":"Enzyme","textColor":"#1d4ed8","fontSize":11,"opacity":1}
  ],"highlight":["elementId"]}
]}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology visualization expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 5000,
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

  const { subtopicId } = await request.json();
  if (!subtopicId) {
    return Response.json({ error: "subtopicId required" }, { status: 400 });
  }

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { topic: true },
  });
  if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });

  const steps = await generateAnimationSteps(
    subtopic.nameEn,
    subtopic.nameHe,
    subtopic.contentEn
  );

  if (steps.length === 0) {
    return Response.json({ error: "AI failed to generate animation steps" }, { status: 500 });
  }

  const processSlug = `${subtopic.slug}-animation-${Date.now()}`;

  const process = await prisma.process.create({
    data: {
      topicId: subtopic.topicId,
      slug: processSlug,
      nameHe: subtopic.nameHe,
      nameEn: subtopic.nameEn,
      descHe: `אנימציה: ${subtopic.nameHe}`,
      descEn: `Animation: ${subtopic.nameEn}`,
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

  await prisma.subtopic.update({
    where: { id: subtopicId },
    data: { relatedProcessSlug: processSlug },
  });

  return Response.json({ processSlug: process.slug, stepsCreated: steps.length });
}
