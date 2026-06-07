import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";
import { extractText } from "unpdf";
import JSZip from "jszip";

export const maxDuration = 60;

async function extractPptxText(buffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const texts: string[] = [];

  // Slides are at ppt/slides/slide1.xml, slide2.xml, etc.
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] ?? "0");
      const numB = parseInt(b.match(/\d+/)?.[0] ?? "0");
      return numA - numB;
    });

  for (const fileName of slideFiles) {
    const xmlContent = await zip.files[fileName].async("string");
    // Extract all text runs <a:t>...</a:t>
    const textMatches = xmlContent.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) ?? [];
    const slideText = textMatches
      .map((m) => m.replace(/<[^>]+>/g, "").trim())
      .filter(Boolean)
      .join(" ");
    if (slideText) texts.push(`[Slide ${slideFiles.indexOf(fileName) + 1}] ${slideText}`);
  }

  return texts.join("\n");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const topicSlug = formData.get("topicSlug") as string | null;
  const lang = (formData.get("lang") as "he" | "en") ?? "he";

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  let rawText = "";

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
      rawText = text.slice(0, 8000);
    } catch (err) {
      console.error("[syllabus-upload] PDF parse error:", err);
      return Response.json({ error: "Failed to parse PDF. Try uploading as a .txt file instead." }, { status: 400 });
    }
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.name.endsWith(".pptx")
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      rawText = (await extractPptxText(arrayBuffer)).slice(0, 8000);
    } catch (err) {
      console.error("[syllabus-upload] PPTX parse error:", err);
      return Response.json({ error: "Failed to parse PowerPoint file." }, { status: 400 });
    }
  } else {
    rawText = (await file.text()).slice(0, 8000);
  }

  if (!rawText.trim()) {
    return Response.json({ error: "File appears to be empty or could not be read" }, { status: 400 });
  }

  // Load existing subtopics for the selected topic
  let existingSubtopics: { id: string; nameHe: string; nameEn: string; contentHe: string; contentEn: string }[] = [];
  if (topicSlug) {
    const topic = await prisma.topic.findUnique({
      where: { slug: topicSlug },
      include: { subtopics: { select: { id: true, nameHe: true, nameEn: true, contentHe: true, contentEn: true } } },
    });
    existingSubtopics = topic?.subtopics ?? [];
  }

  const existingList = existingSubtopics.length > 0
    ? existingSubtopics.map((s) => `- id:"${s.id}" | "${s.nameEn}" (${s.nameHe})`).join("\n")
    : "none";

  const prompt =
    lang === "he"
      ? `להלן תוכן של סילבוס או חומר לימוד בביולוגיה:\n\n${rawText}\n\nתתי-נושאים קיימים בנושא:\n${existingList}\n\nהפק 3-6 הצעות. עבור כל הצעה: אם היא קשורה לתת-נושא קיים — הצע לעדכן אותו עם התוכן החדש (action:"update", matchedSubtopicId). אחרת — הצע ליצור חדש (action:"create"). החזר JSON בלבד:
{"subtopics":[{"action":"create","slug":"unique-slug","nameHe":"שם","nameEn":"Name","contentHe":"תוכן מפורט (5-7 משפטים)","contentEn":"Detailed content (5-7 sentences)"},{"action":"update","matchedSubtopicId":"existing-id","nameHe":"שם קיים","nameEn":"Existing Name","contentHe":"תוכן מורחב ומשופר (5-7 משפטים)","contentEn":"Expanded improved content (5-7 sentences)"}]}`
      : `The following is a biology syllabus or study material:\n\n${rawText}\n\nExisting subtopics in this topic:\n${existingList}\n\nExtract 3-6 suggestions. For each: if it relates to an existing subtopic, suggest updating it (action:"update", matchedSubtopicId). Otherwise suggest creating new (action:"create"). Return JSON only:
{"subtopics":[{"action":"create","slug":"unique-slug","nameHe":"Hebrew name","nameEn":"Name","contentHe":"Detailed Hebrew content (5-7 sentences)","contentEn":"Detailed content (5-7 sentences)"},{"action":"update","matchedSubtopicId":"existing-id","nameHe":"Hebrew name","nameEn":"Existing Name","contentHe":"Expanded Hebrew content (5-7 sentences)","contentEn":"Expanded content (5-7 sentences)"}]}`;

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
      max_tokens: 3000,
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
