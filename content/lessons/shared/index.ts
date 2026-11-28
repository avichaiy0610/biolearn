import type { Lesson } from "../types";
import { shSexualSelection } from "./sh-sexual-selection";
import { shHeart } from "./sh-heart";
import { shVessels } from "./sh-vessels";
import { shRespiration } from "./sh-respiration";
import { shHomeostasisAutonomic } from "./sh-homeostasis-autonomic";
import { shMotorControl } from "./sh-motor-control";
import { shSomatosensory } from "./sh-somatosensory";
import { shMineralPhloem } from "./sh-mineral-phloem";
import { shQuantitativeGenetics } from "./sh-quantitative-genetics";
import { shPlantDiversity } from "./sh-plant-diversity";
import { shMolluscs } from "./sh-molluscs";
import { shCoexistence } from "./sh-coexistence";
import { shMutualismParasitism } from "./sh-mutualism-parasitism";
import { shBehavioralEcology } from "./sh-behavioral-ecology";
import { shDigestion } from "./sh-digestion";
import { shSpecialSenses } from "./sh-special-senses";
import { shPhylogenetics } from "./sh-phylogenetics";
import { shMolMethods } from "./sh-mol-methods";
import { shBacterialGeneticsMethods } from "./sh-bacterial-genetics-methods";
import { shPlantReproduction } from "./sh-plant-reproduction";

/* Units written for the other universities' tracks (phase 2, 2026-11-25): each fills a gap named by the official
   syllabi of several courses, so the course a unit "belongs" to is only the first one that needed it. */
export const SHARED_LESSONS: Lesson[] = [
  shSexualSelection, shHeart, shVessels, shRespiration, shHomeostasisAutonomic, shMotorControl, shSomatosensory,
  shMineralPhloem, shQuantitativeGenetics, shPlantDiversity, shMolluscs, shCoexistence, shMutualismParasitism,
  // phase 2b (2026-11-28)
  shBehavioralEcology, shDigestion, shSpecialSenses, shPhylogenetics, shMolMethods, shBacterialGeneticsMethods,
  shPlantReproduction,
];
