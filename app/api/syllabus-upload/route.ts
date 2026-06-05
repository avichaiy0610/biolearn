import { prisma } from "@/lib/prisma";
import { getModel } from "@/lib/google-ai";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const topicSlug = formData.get("topicSlug") as string | null;
  const lang = (formData.get("lang") as "he" | "en") ?? "he";

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  let rawText = "";

  if (file.type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfModule = (await import("pdf-parse")) as any;
      const pdfParse = pdfModule.default ?? pdfModule;
      const data = await pdfParse(buffer);
      rawText = data.text.slice(0, 8000);
    } catch {
      return Response.json({ error: "Failed to parse PDF" }, { status: 400 });
    }
  } else {
    rawText = (await file.text()).slice(0, 8000);
  }

  if (!rawText.trim()) {
    return Response.json({ error: "File appears to be empty" }, { status: 400 });
  }

  const prompt =
    lang === "he"
      ? `להלן תוכן של סילבוס או חומר לימוד בביולוגיה:\n\n${rawText}\n\nבהתבסס על תוכן זה, הפק רשימה של 3-6 תתי-נושאים רלוונטיים לאתר לימודי ביולוגיה לתואר ראשון. החזר JSON בלבד (ללא הסבר נוסף) במבנה הבא:
[{"slug":"unique-slug-en","nameHe":"שם בעברית","nameEn":"Name in English","contentHe":"תוכן מפורט בעברית (3-5 משפטים)","contentEn":"Detailed content in English (3-5 sentences)"}]`
      : `The following is a biology syllabus or study material:\n\n${rawText}\n\nExtract 3-6 relevant subtopics for an undergraduate biology education website. Return JSON only:
[{"slug":"unique-slug-en","nameHe":"Hebrew name","nameEn":"Name in English","contentHe":"Detailed Hebrew content (3-5 sentences)","contentEn":"Detailed English content (3-5 sentences)"}]`;

  const model = getModel(true);
  const result = await model.generateContent(
    "You are a biology educator. Extract educational subtopics from biology materials and format them as JSON. Return ONLY valid JSON array, no markdown fences.\n\n" +
      prompt
  );
  const responseText = result.response.text();

  let suggestions: object[] = [];
  try {
    const cleaned = responseText.replace(/```json\n?|\n?```/g, "").trim();
    suggestions = JSON.parse(cleaned);
  } catch {
    suggestions = [];
  }

  const material = await prisma.uploadedMaterial.create({
    data: {
      fileName: file.name,
      topicSlug: topicSlug ?? null,
      rawText: rawText.slice(0, 2000),
      suggestions: JSON.stringify(suggestions),
    },
  });

  return Response.json({ id: material.id, suggestions });
}
