export async function searchBiology(query: string, lang: "he" | "en") {
  const langInstruction =
    lang === "he"
      ? "Respond in Hebrew. Use scientific Hebrew terminology."
      : "Respond in English.";

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content: `You are a biology expert helping build educational content for undergraduate students. ${langInstruction} Be accurate and cite key concepts.`,
        },
        { role: "user", content: query },
      ],
      max_tokens: 800,
      return_citations: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Perplexity API error: ${res.status}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
    citations?: string[];
  };

  return {
    content: data.choices[0]?.message?.content ?? "",
    citations: data.citations ?? [],
  };
}
