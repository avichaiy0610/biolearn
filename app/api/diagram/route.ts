import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 30;

export async function POST(request: Request) {
  const { nameEn, nameHe, contentEn, contentHe, topicName, lang } = await request.json();

  if (!nameEn || (!contentEn && !contentHe)) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const isHe = lang === "he";
  const content = isHe ? (contentHe || contentEn) : (contentEn || contentHe);
  const labelLang = isHe ? "Hebrew" : "English";

  const prompt = `You are a biology visualization expert. Create a SINGLE comprehensive overview diagram for this biology subtopic.

Subtopic: "${nameEn}"${nameHe ? ` (${nameHe})` : ""}
Topic: "${topicName || ""}"
Content: ${content.slice(0, 700)}

═══════════════════════════════════════
CANVAS: viewBox 0 0 400 300
Zones: Left x=20-130 | Center x=140-260 | Right x=270-380
       Top y=15-80   | Middle y=90-210   | Bottom y=220-285
═══════════════════════════════════════

VISUAL DESIGN RULES:
1. Show the COMPLETE picture of this concept in one static image
2. Layer shapes for biological depth: membranes → cytoplasm → nucleus → molecules
3. CELLS = large circle (color="#fdf4e3", stroke="#c9a55a", strokeWidth=2.5)
4. NUCLEUS = ellipse (color="#e8d4a0", stroke="#b89040", strokeWidth=1.5)
5. PROTEINS/ENZYMES = medium circles r=18-25 with vivid colors
6. ARROWS = lines with direction showing flow/interaction
7. Every key structure MUST have a text label

BIOLOGICAL COLOR PALETTE:
  Cell membrane: color="#fdf4e3", stroke="#c9a55a"
  Nucleus:       color="#e8d4a0", stroke="#b89040"
  Enzyme/protein: color="#7c3aed"   DNA: color="#3b82f6"
  RNA:           color="#f59e0b"    ATP: color="#f97316"
  Membrane:      color="#22c55e"    Vesicle: color="#06b6d4"
  Glucose/sugar: color="#ef4444"    Product: color="#10b981"

USE ${labelLang} FOR ALL LABELS. Keep labels SHORT (2-4 words).
Generate 8-18 elements total. Include both shapes AND labels for each structure.

Return ONLY valid JSON — exactly this structure:
{
  "elements": [
    {"id":"cell","type":"circle","cx":200,"cy":150,"r":85,"color":"#fdf4e3","stroke":"#c9a55a","strokeWidth":2.5,"opacity":1},
    {"id":"nucleus","type":"ellipse","cx":200,"cy":140,"rx":38,"ry":32,"color":"#e8d4a0","stroke":"#b89040","strokeWidth":1.5,"opacity":1},
    {"id":"arrow1","type":"line","x1":120,"y1":150,"x2":160,"y2":150,"stroke":"#059669","strokeWidth":2.5,"opacity":1},
    {"id":"lbl_cell","type":"text","x":200,"y":255,"label":"Cell Membrane","fontSize":10,"textColor":"#78350f","opacity":1}
  ]
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a biology visualization expert. Return only valid JSON with an 'elements' array of SVG biological diagram elements.",
        },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);
    const elements = parsed.elements ?? parsed.diagram?.elements ?? [];

    if (!Array.isArray(elements) || elements.length === 0) {
      return Response.json({ error: "AI returned empty diagram" }, { status: 500 });
    }

    return Response.json({ elements });
  } catch (err) {
    console.error("[diagram]", err);
    return Response.json({ error: "Failed to generate diagram" }, { status: 500 });
  }
}
