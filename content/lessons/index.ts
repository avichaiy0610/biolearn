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
import { molNucleicAcids } from "./technion-molecular/mol-nucleic-acids";
import { molChromatin } from "./technion-molecular/mol-chromatin";
import { molReplicationFork } from "./technion-molecular/mol-replication-fork";
import { molReplicationOrigins } from "./technion-molecular/mol-replication-origins";
import { molRepair } from "./technion-molecular/mol-repair";
import { molRecombination } from "./technion-molecular/mol-recombination";
import { molTranscriptionProk } from "./technion-molecular/mol-transcription-prok";
import { molTranscriptionEuk } from "./technion-molecular/mol-transcription-euk";
import { molRnaProcessing } from "./technion-molecular/mol-rna-processing";
import { molGeneticCode } from "./technion-molecular/mol-genetic-code";
import { molRibosomeInitiation } from "./technion-molecular/mol-ribosome-initiation";
import { molTranslationElongation } from "./technion-molecular/mol-translation-elongation";
import { cellMembranes } from "./technion-cell/cell-membranes";
import { cellEr } from "./technion-cell/cell-er";
import { cellQualityControl } from "./technion-cell/cell-quality-control";
import { cellGolgiEndosomes } from "./technion-cell/cell-golgi-endosomes";
import { cellVesicleTransport } from "./technion-cell/cell-vesicle-transport";
import { cellNuclearMitoImport } from "./technion-cell/cell-nuclear-mito-import";
import { cellCytoskeleton } from "./technion-cell/cell-cytoskeleton";
import { cellMotorsPolarity } from "./technion-cell/cell-motors-polarity";
import { cellJunctions } from "./technion-cell/cell-junctions";
import { cellEcm } from "./technion-cell/cell-ecm";
import { cellSignalingPrinciples } from "./technion-cell/cell-signaling-principles";
import { cellGpcr } from "./technion-cell/cell-gpcr";
import { cellRtk } from "./technion-cell/cell-rtk";
import { cellCycleControl } from "./technion-cell/cell-cycle-control";
import { gxOperons } from "./technion-gene-expression/gx-operons";
import { gxCisElements } from "./technion-gene-expression/gx-cis-elements";
import { gxTranscriptionFactors } from "./technion-gene-expression/gx-transcription-factors";
import { gxChromatinModifications } from "./technion-gene-expression/gx-chromatin-modifications";
import { gxEpigenetics } from "./technion-gene-expression/gx-epigenetics";
import { gxAlternativeSplicing } from "./technion-gene-expression/gx-alternative-splicing";
import { gxTranslationControl } from "./technion-gene-expression/gx-translation-control";
import { gxNcrna } from "./technion-gene-expression/gx-ncrna";
import { gxGenomeStructure } from "./technion-gene-expression/gx-genome-structure";
import { gxGeneFamilies } from "./technion-gene-expression/gx-gene-families";
import { gxRepeatsMobile } from "./technion-gene-expression/gx-repeats-mobile";
import { gxGenomeWide } from "./technion-gene-expression/gx-genome-wide";
import { gxIntegration } from "./technion-gene-expression/gx-integration";
import { phTransport } from "./technion-physiology/ph-transport";
import { phMembranePotential } from "./technion-physiology/ph-membrane-potential";
import { phActionPotential } from "./technion-physiology/ph-action-potential";
import { phNervousSystem } from "./technion-physiology/ph-nervous-system";
import { phSynapse } from "./technion-physiology/ph-synapse";
import { phSkeletalMuscle } from "./technion-physiology/ph-skeletal-muscle";
import { phSmoothCardiacMuscle } from "./technion-physiology/ph-smooth-cardiac-muscle";
import { phBlood } from "./technion-physiology/ph-blood";
import { phKidneyFiltration } from "./technion-physiology/ph-kidney-filtration";
import { phKidneyTubules } from "./technion-physiology/ph-kidney-tubules";
import { phVolumePressure } from "./technion-physiology/ph-volume-pressure";
import { mvHistory } from "./technion-micro-viro/mv-history";
import { mvMethods } from "./technion-micro-viro/mv-methods";
import { mvCellEnvelope } from "./technion-micro-viro/mv-cell-envelope";
import { mvSurfaceMotility } from "./technion-micro-viro/mv-surface-motility";
import { mvGrowth } from "./technion-micro-viro/mv-growth";
import { mvEnvironment } from "./technion-micro-viro/mv-environment";
import { mvAntibiotics } from "./technion-micro-viro/mv-antibiotics";
import { mvMetabolicDiversity } from "./technion-micro-viro/mv-metabolic-diversity";
import { mvNutrientCycles } from "./technion-micro-viro/mv-nutrient-cycles";
import { mvEcology } from "./technion-micro-viro/mv-ecology";
import { mvViruses } from "./technion-micro-viro/mv-viruses";
import { mvPhages } from "./technion-micro-viro/mv-phages";
import { mvGeneTransfer } from "./technion-micro-viro/mv-gene-transfer";
import { mvEndospores } from "./technion-micro-viro/mv-endospores";
import { mvEvolution } from "./technion-micro-viro/mv-evolution";
import { mvImmunology } from "./technion-micro-viro/mv-immunology";
import { mvClinical } from "./technion-micro-viro/mv-clinical";
import { ppPlantCell } from "./technion-plant-physiology/pp-plant-cell";
import { ppResearchTools } from "./technion-plant-physiology/pp-research-tools";
import { ppWaterCells } from "./technion-plant-physiology/pp-water-cells";
import { ppWaterBalance } from "./technion-plant-physiology/pp-water-balance";
import { ppCellGrowth } from "./technion-plant-physiology/pp-cell-growth";
import { ppDevelopment } from "./technion-plant-physiology/pp-development";
import { ppAuxin } from "./technion-plant-physiology/pp-auxin";
import { ppCytokininGibberellin } from "./technion-plant-physiology/pp-cytokinin-gibberellin";
import { ppAbaEthylene } from "./technion-plant-physiology/pp-aba-ethylene";
import { ppLightReactions } from "./technion-plant-physiology/pp-light-reactions";
import { ppCalvin } from "./technion-plant-physiology/pp-calvin";
import { ppPhotoreceptors } from "./technion-plant-physiology/pp-photoreceptors";
import { ppTropisms } from "./technion-plant-physiology/pp-tropisms";
import { ppCircadianPhotoperiod } from "./technion-plant-physiology/pp-circadian-photoperiod";
import { ppFlowering } from "./technion-plant-physiology/pp-flowering";
import { ppBioticStress } from "./technion-plant-physiology/pp-biotic-stress";
import { b1Intro } from "./technion-biology-1/b1-intro";
import { b1Science } from "./technion-biology-1/b1-science";
import { b1ProteinsEnzymes } from "./technion-biology-1/b1-proteins-enzymes";
import { b1Cells } from "./technion-biology-1/b1-cells";
import { b1EukaryoticCell } from "./technion-biology-1/b1-eukaryotic-cell";
import { b1Membranes } from "./technion-biology-1/b1-membranes";
import { b1Energy } from "./technion-biology-1/b1-energy";
import { b1Metabolism } from "./technion-biology-1/b1-metabolism";
import { b1Dna } from "./technion-biology-1/b1-dna";
import { b1GeneExpression } from "./technion-biology-1/b1-gene-expression";
import { b1CellDivision } from "./technion-biology-1/b1-cell-division";
import { b1Development } from "./technion-biology-1/b1-development";
import { evEvidence } from "./technion-evolution/ev-evidence";
import { evTreeOfLife } from "./technion-evolution/ev-tree-of-life";
import { evEukaryotes } from "./technion-evolution/ev-eukaryotes";
import { evAnimals } from "./technion-evolution/ev-animals";
import { evHuman } from "./technion-evolution/ev-human";
import { evSelection } from "./technion-evolution/ev-selection";
import { evDrift } from "./technion-evolution/ev-drift";
import { evPopulationStructure } from "./technion-evolution/ev-population-structure";
import { evSelectionForces } from "./technion-evolution/ev-selection-forces";
import { evMeasuringSelection } from "./technion-evolution/ev-measuring-selection";
import { evEvoDevo } from "./technion-evolution/ev-evo-devo";
import { evGeneticSystems } from "./technion-evolution/ev-genetic-systems";

export const LESSONS: Lesson[] = [mendelProbability, dominanceAlleles, pedigrees, chromosomalTheory, sexDetermination, linkageMapping, mutations, chromosomeStructure, chromosomeNumber, natureOfGene, geneInteraction, nonMendelian, aminoAcids, proteinStructure, proteinFolding, fibrousMembrane, proteinMethods, hemoglobin, enzymePrinciples, enzymeKinetics, catalyticMechanisms, allostericRegulation, covalentRegulation, carbsLipids, metConcepts, metGlycolysis, metGluconeogenesis, metCitricAcid, metOxphos, metPhotosynthesis, metPentose, metGlycogen, metFattyAcids, metIntegration, metLipidsCholesterol, metAminoAcids, metNucleotides, molNucleicAcids, molChromatin, molReplicationFork, molReplicationOrigins, molRepair, molRecombination, molTranscriptionProk, molTranscriptionEuk, molRnaProcessing, molGeneticCode, molRibosomeInitiation, molTranslationElongation, cellMembranes, cellEr, cellQualityControl, cellGolgiEndosomes, cellVesicleTransport, cellNuclearMitoImport, cellCytoskeleton, cellMotorsPolarity, cellJunctions, cellEcm, cellSignalingPrinciples, cellGpcr, cellRtk, cellCycleControl, gxOperons, gxCisElements, gxTranscriptionFactors, gxChromatinModifications, gxEpigenetics, gxAlternativeSplicing, gxTranslationControl, gxNcrna, gxGenomeStructure, gxGeneFamilies, gxRepeatsMobile, gxGenomeWide, gxIntegration, phTransport, phMembranePotential, phActionPotential, phNervousSystem, phSynapse, phSkeletalMuscle, phSmoothCardiacMuscle, phBlood, phKidneyFiltration, phKidneyTubules, phVolumePressure, mvHistory, mvMethods, mvCellEnvelope, mvSurfaceMotility, mvGrowth, mvEnvironment, mvAntibiotics, mvMetabolicDiversity, mvNutrientCycles, mvEcology, mvViruses, mvPhages, mvGeneTransfer, mvEndospores, mvEvolution, mvImmunology, mvClinical, ppPlantCell, ppResearchTools, ppWaterCells, ppWaterBalance, ppCellGrowth, ppDevelopment, ppAuxin, ppCytokininGibberellin, ppAbaEthylene, ppLightReactions, ppCalvin, ppPhotoreceptors, ppTropisms, ppCircadianPhotoperiod, ppFlowering, ppBioticStress, b1Intro, b1Science, b1ProteinsEnzymes, b1Cells, b1EukaryoticCell, b1Membranes, b1Energy, b1Metabolism, b1Dna, b1GeneExpression, b1CellDivision, b1Development, evEvidence, evTreeOfLife, evEukaryotes, evAnimals, evHuman, evSelection, evDrift, evPopulationStructure, evSelectionForces, evMeasuringSelection, evEvoDevo, evGeneticSystems];

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
