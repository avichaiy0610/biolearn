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
import { aminoAcids } from "./technion-biochem/amino-acids";
import { proteinStructure } from "./technion-biochem/protein-structure";
import { proteinFolding } from "./technion-biochem/protein-folding";
import { fibrousMembrane } from "./technion-biochem/fibrous-membrane";
import { proteinMethods } from "./technion-biochem/protein-methods";
import { hemoglobin } from "./technion-biochem/hemoglobin";
import { enzymePrinciples } from "./technion-biochem/enzyme-principles";
import { enzymeKinetics } from "./technion-biochem/enzyme-kinetics";
import { catalyticMechanisms } from "./technion-biochem/catalytic-mechanisms";
import { allostericRegulation } from "./technion-biochem/allosteric-regulation";
import { covalentRegulation } from "./technion-biochem/covalent-regulation";
import { carbsLipids } from "./technion-biochem/carbs-lipids";
import { metConcepts } from "./technion-metabolic/met-concepts";
import { metGlycolysis } from "./technion-metabolic/met-glycolysis";
import { metGluconeogenesis } from "./technion-metabolic/met-gluconeogenesis";
import { metCitricAcid } from "./technion-metabolic/met-citric-acid";
import { metOxphos } from "./technion-metabolic/met-oxphos";
import { metPhotosynthesis } from "./technion-metabolic/met-photosynthesis";
import { metPentose } from "./technion-metabolic/met-pentose";
import { metGlycogen } from "./technion-metabolic/met-glycogen";
import { metFattyAcids } from "./technion-metabolic/met-fatty-acids";
import { metIntegration } from "./technion-metabolic/met-integration";
import { metLipidsCholesterol } from "./technion-metabolic/met-lipids-cholesterol";
import { metAminoAcids } from "./technion-metabolic/met-amino-acids";
import { metNucleotides } from "./technion-metabolic/met-nucleotides";

export const LESSONS: Lesson[] = [mendelProbability, dominanceAlleles, pedigrees, chromosomalTheory, sexDetermination, linkageMapping, mutations, chromosomeStructure, chromosomeNumber, natureOfGene, geneInteraction, nonMendelian, aminoAcids, proteinStructure, proteinFolding, fibrousMembrane, proteinMethods, hemoglobin, enzymePrinciples, enzymeKinetics, catalyticMechanisms, allostericRegulation, covalentRegulation, carbsLipids, metConcepts, metGlycolysis, metGluconeogenesis, metCitricAcid, metOxphos, metPhotosynthesis, metPentose, metGlycogen, metFattyAcids, metIntegration, metLipidsCholesterol, metAminoAcids, metNucleotides];

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
