import { bankForSubtopic, bankForTopic, toQuizQuestion } from "@/content/question-bank";

// Static, reviewed questions — no AI and no DB involved, so this keeps working
// when the AI provider is down. ?subtopicId=… or ?topic=…[&limit=N] (random N).
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subtopicId = searchParams.get("subtopicId");
  const topic = searchParams.get("topic");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 50);

  if (!subtopicId && !topic) {
    return Response.json({ error: "חסר נושא או תת-נושא.", code: "bad_request" }, { status: 400 });
  }
  let list = subtopicId ? bankForSubtopic(subtopicId) : bankForTopic(topic!);
  if (list.length > limit) {
    list = [...list].sort(() => Math.random() - 0.5).slice(0, limit);
  }
  return Response.json(list.map(toQuizQuestion));
}
