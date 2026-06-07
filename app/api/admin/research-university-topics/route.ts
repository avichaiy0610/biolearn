import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { lang } = await request.json().catch(() => ({ lang: "he" }));

  const existingTopics = await prisma.topic.findMany({
    select: { slug: true, nameEn: true, nameHe: true },
  });

  const existingList = existingTopics.map((t) => `slug:"${t.slug}" | "${t.nameEn}" (${t.nameHe})`).join("\n") || "none";

  const prompt = `You are an expert biology curriculum designer with comprehensive knowledge of what is taught at leading universities worldwide (Hebrew University, Tel Aviv University, Weizmann Institute, MIT, Harvard, Stanford, etc.).

Existing topics on the website:
${existingList}

Typical undergraduate biology curriculum covers these major domains — check which are missing:
- Cell Biology (cell cycle, organelles, membrane transport, signal transduction, cytoskeleton)
- Molecular Biology (DNA replication, transcription, translation, gene regulation, epigenetics)
- Genetics (Mendelian genetics, population genetics, genomics, mutations, genetic mapping)
- Biochemistry (metabolism, enzymes, protein structure, lipids, carbohydrates)
- Microbiology (bacteria, viruses, fungi, antibiotic resistance, microbiome)
- Immunology (innate immunity, adaptive immunity, antibodies, vaccines, autoimmunity, allergies)
- Neurobiology / Neuroscience (nervous system, synaptic transmission, neuroplasticity, sensory systems)
- Developmental Biology (embryogenesis, cell differentiation, stem cells, morphogenesis)
- Evolutionary Biology (natural selection, speciation, phylogenetics, molecular evolution)
- Ecology (ecosystems, population dynamics, food webs, climate change impacts)
- Physiology (cardiovascular, respiratory, renal, endocrine, digestive systems)
- Plant Biology (photosynthesis, plant hormones, plant reproduction, secondary metabolism)
- Bioinformatics (sequence alignment, phylogenetic analysis, structural biology tools)
- Cancer Biology (oncogenes, tumor suppressors, metastasis, cancer therapies)
- Biotechnology (CRISPR, PCR, cloning, recombinant proteins, gene therapy)

Suggest 5-7 important topics that are MISSING from the existing list. For each, provide 4-5 key subtopics typically taught in university courses.

Return JSON only:
{
  "suggestions": [
    {
      "slug": "unique-en-slug",
      "nameEn": "Topic Name in English",
      "nameHe": "שם הנושא בעברית",
      "descEn": "3-4 sentence description of what this topic covers at university level, why it is important, and what students gain from studying it",
      "descHe": "תיאור של 3-4 משפטים",
      "category": "one of: cell, genetics, molecular, biochemistry, physiology, ecology, microbiology, neuroscience, immunology, developmental, evolutionary, biotechnology",
      "icon": "single relevant emoji",
      "subtopics": [
        {
          "slug": "subtopic-slug",
          "nameEn": "Subtopic Name",
          "nameHe": "שם תת-הנושא",
          "contentEn": "6-8 sentence explanation covering key concepts, mechanisms, examples, and real-world significance for this subtopic",
          "contentHe": "הסבר של 6-8 משפטים המכסה מושגי מפתח, מנגנונים, דוגמאות ומשמעות מעשית"
        }
      ],
      "reason": "Why this topic is essential for undergraduate biology and what unique value it adds"
    }
  ]
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology curriculum expert with deep knowledge of university biology education worldwide. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 5000,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);

    const existingSlugs = new Set(existingTopics.map((t) => t.slug));
    const existingNames = new Set(existingTopics.map((t) => t.nameEn.toLowerCase()));
    const suggestions = (parsed.suggestions ?? []).filter(
      (s: { slug: string; nameEn: string }) =>
        !existingSlugs.has(s.slug) && !existingNames.has(s.nameEn.toLowerCase())
    );

    return Response.json({ suggestions, lang });
  } catch (err) {
    console.error("[research-university-topics]", err);
    return Response.json({ error: "AI request failed" }, { status: 500 });
  }
}
