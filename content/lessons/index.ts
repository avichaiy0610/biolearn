import type { Lesson, LessonQuestion } from "./types";
import { sexDetermination } from "./technion-genetics/sex-determination";
import { chromosomalTheory } from "./technion-genetics/chromosomal-theory";
import { chromosomeNumber } from "./technion-genetics/chromosome-number";
import { chromosomeStructure } from "./technion-genetics/chromosome-structure";
import { dominanceAlleles } from "./technion-genetics/dominance-alleles";
import { geneInteraction } from "./technion-genetics/gene-interaction";
import { linkageMapping } from "./technion-genetics/linkage-mapping";
import { mendelProbability } from "./technion-genetics/mendel-probability";
import { mutations } from "./technion-genetics/mutations";
import { natureOfGene } from "./technion-genetics/nature-of-gene";
import { nonMendelian } from "./technion-genetics/non-mendelian";
import { pedigrees } from "./technion-genetics/pedigrees";

export const LESSONS: Lesson[] = [mendelProbability, dominanceAlleles, pedigrees, chromosomalTheory, sexDetermination, linkageMapping, mutations, chromosomeStructure, chromosomeNumber, natureOfGene, geneInteraction, nonMendelian];

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);

// QuizGame shape (same as the static question bank).
export function lessonQuizQuestions(l: Lesson) {
  return l.questions.map((q: LessonQuestion) => ({
    id: `lesson:${l.slug}:${q.id}`,
    type: "mcq",
    question: q.question,
    options: q.options.map((o) => o.text),
    answer: q.options[q.correct].text,
    explanation: `התשובה הנכונה: ${q.options[q.correct].text}. ${q.options[q.correct].why.replace(/^נכון[.:]\s*/, "")}`,
    optionWhy: Object.fromEntries(q.options.map((o) => [o.text, o.why])),
    difficulty: q.difficulty,
    subtopicId: l.subtopicId,
  }));
}
