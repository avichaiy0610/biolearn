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

/* Units written for the other universities' tracks (phase 2, 2026-11-25): each fills a gap named by the official
   syllabi of several courses, so the course a unit "belongs" to is only the first one that needed it. */
export const SHARED_LESSONS: Lesson[] = [
  shSexualSelection, shHeart, shVessels, shRespiration, shHomeostasisAutonomic, shMotorControl, shSomatosensory,
  shMineralPhloem, shQuantitativeGenetics, shPlantDiversity, shMolluscs, shCoexistence, shMutualismParasitism,
];
