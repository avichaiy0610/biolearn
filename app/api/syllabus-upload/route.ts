import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";

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
      // Import the internal implementation to avoid filesystem access in serverless
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment
      // @ts-ignore – pdf-parse has no types for this subpath
      const pdfModule = (await import("pdf-parse/lib/pdf-parse.js")) as any;
      const pdfParse = pdfModule.default ?? pdfModule;
      const data = await pdfParse(buffer);
      rawText = data.text.slice(0, 8000);
    } catch (err) {
      console.error("[syllabus-upload] PDF parse error:", err);
      return Response.json({ error: "Failed to parse PDF. Try uploading as a .txt file instead." }, { status: 400 });
    }
  } else {
    rawText = (await file.text()).slice(0, 8000);
  }

  if (!rawText.trim()) {
    return Response.json({ error: "File appears to be empty" }, { status: 400 });
  }

  const prompt =
    lang === "he"
      ? `להלן תוכן של סילבוס או חומר לימוד בביולוגיה:\n\n${rawText}\n\nבהתבסס על תוכן זה, הפק רשימה של 3-6 תתי-נושאים רלוונטיים לאתר לימודי ביולוגיה לתואר ראשון. החזר JSON בלבד במבנה הבא:
{"subtopics":[{"slug":"unique-slug-en","nameHe":"שם בעברית","nameEn":"Name in English","contentHe":"תוכן מפורט בעברית (3-5 משפטים)","contentEn":"Detailed content in English (3-5 sentences)"}]}`
      : `The following is a biology syllabus or study material:\n\n${rawText}\n\nExtract 3-6 relevant subtopics for an undergraduate biology education website. Return JSON only:
{"subtopics":[{"slug":"unique-slug-en","nameHe":"Hebrew name","nameEn":"Name in English","contentHe":"Detailed Hebrew content (3-5 sentences)","contentEn":"Detailed English content (3-5 sentences)"}]}`;

  let suggestions: object[] = [];
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a biology educator. Extract educational subtopics from biology materials and format them as JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
    });
    const responseText = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(responseText);
    suggestions = parsed.subtopics ?? [];
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
