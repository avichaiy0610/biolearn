import type { CourseScope, ScopeEntry } from "./types";

// Technion 134040 "פיזיולוגיה מוליקולרית של הצמח". Evidence available (2026-10-22): the official topic list on the
// students portal (13 topics, unusually specific — it names each hormone, both phases of photosynthesis, light
// quality, tropism, photoperiodism, the clock, flowering and biotic stress); Moodle closed to guests. A section is
// "core" when a topic names it in its own words, "likely" when it only falls under a broader topic.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const CELL = "מבנה הצמח והתא הצמחי";
const TOOLS = "כלים למחקר במדעי הצמח";
const WATER = "יחסי צמח-מים";
const GROW = "גדילה והתפתחות";
const HORM = "מסלולי העברת אותות בתגובה להורמונים (אוקסין, ציטוקינין, גיברלין, חומצה אבציסית, אתילן)";
const LIGHT = "פוטוסינתזה, שלבי האור";
const CALVIN = "מעגל קלוין";
const QUALITY = "איכות האור כאות המבקר תהליכים פיזיולוגים והתפתחותיים";
const TROP = "טרופיזם";
const PHOTOP = "פוטופריודיזם";
const CLOCK = "שעון צירקאדי";
const FLOWER = "פריחה";
const BIOTIC = "תגובת הצמח לעקות ביוטית";

export const technionPlantPhysiologyScope: CourseScope = {
  courseSlug: "technion-plant-physiology",
  checkedAt: "2026-10-22",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134040" },
  sections: {
    "pp-plant-cell": {
      "body-plan": named(CELL),
      "cell-types": named(CELL),
      "cell-wall": named(CELL),
      "plasmodesmata": named(CELL),
      "vacuole-plastids": named(CELL),
      "division": heading(CELL, "חלוקת התא הצמחי"),
    },
    "pp-research-tools": {
      "arabidopsis": named(TOOLS),
      "genetics": named(TOOLS),
      "agrobacterium": named(TOOLS),
      "reporters": named(TOOLS),
      "silencing-editing": named(TOOLS),
    },
    "pp-water-cells": {
      "properties": named(WATER),
      "movement": named(WATER),
      "water-potential": named(WATER),
      "cell-water": named(WATER),
      "aquaporins": named(WATER),
    },
    "pp-water-balance": {
      "continuum": named(WATER),
      "soil-root": named(WATER),
      "cohesion-tension": named(WATER),
      "transpiration": named(WATER),
      "stomata": named(WATER),
    },
    "pp-cell-growth": {
      "wall-structure": named(GROW),
      "direction": named(GROW),
      "lockhart": named(GROW),
      "acid-growth": named(GROW),
      "growth-stop": heading(GROW, "סיום הגדילה והקשחת הדופן"),
    },
    "pp-development": {
      "dormancy": heading(GROW, "תרדמת זרעים"),
      "germination": heading(GROW, "נביטה"),
      "seedling": named(GROW),
      "ram": named(GROW),
      "sam": named(GROW),
    },
    "pp-auxin": {
      "signaling-principles": named(HORM),
      "auxin-synthesis": named(HORM, "אוקסין"),
      "polar-transport": named(HORM, "אוקסין"),
      "auxin-signaling": named(HORM, "אוקסין"),
      "auxin-roles": named(HORM, "אוקסין"),
    },
    "pp-cytokinin-gibberellin": {
      "cytokinin-synthesis": named(HORM, "ציטוקינין"),
      "cytokinin-signaling": named(HORM, "ציטוקינין"),
      "cytokinin-roles": named(HORM, "ציטוקינין"),
      "gibberellin": named(HORM, "גיברלין"),
      "ga-signaling": named(HORM, "גיברלין"),
      "green-revolution": heading(HORM, "המהפכה הירוקה"),
    },
    "pp-aba-ethylene": {
      "aba": named(HORM, "חומצה אבציסית"),
      "aba-signaling": named(HORM, "חומצה אבציסית"),
      "ethylene": named(HORM, "אתילן"),
      "ethylene-signaling": named(HORM, "אתילן"),
    },
    "pp-light-reactions": {
      "pigments": named(LIGHT),
      "antenna": named(LIGHT),
      "z-scheme": named(LIGHT),
      "atp": named(LIGHT),
      "cyclic": named(LIGHT),
      "photoprotection": heading(LIGHT, "הגנה מעודף אור"),
      "herbicides": heading(LIGHT, "קוטלי עשבים"),
    },
    "pp-calvin": {
      "cycle": named(CALVIN),
      "rubisco": named(CALVIN),
      "regulation": named(CALVIN),
      "products": heading(CALVIN, "עמילן וסוכרוז"),
      "photorespiration": heading(CALVIN, "הנשימה הפוטוסינתטית"),
      "c4-cam": heading(CALVIN, "מסלולי C4 ו-CAM"),
    },
    "pp-photoreceptors": {
      "families": named(QUALITY),
      "phytochrome": named(QUALITY),
      "phya-phyb": named(QUALITY),
      "phy-signaling": named(QUALITY),
      "shade": named(QUALITY),
      "blue-uv": named(QUALITY),
    },
    "pp-tropisms": {
      "logic": named(TROP),
      "phototropism": named(TROP),
      "root-gravitropism": named(TROP),
      "shoot-gravitropism": named(TROP),
      "other-tropisms": named(TROP),
    },
    "pp-circadian-photoperiod": {
      "rhythms": named(CLOCK),
      "clock": named(CLOCK),
      "photoperiodism": named(PHOTOP),
      "coincidence": named(PHOTOP),
    },
    "pp-flowering": {
      "phase-change": heading(FLOWER, "המעבר מהשלב הצעיר לבוגר"),
      "florigen": named(FLOWER),
      "vernalization": heading(FLOWER, "ורנליזציה"),
      "pathways": named(FLOWER),
      "abc": named(FLOWER),
    },
    "pp-biotic-stress": {
      "overview": named(BIOTIC),
      "pti": named(BIOTIC),
      "eti": named(BIOTIC),
      "sa-sar": named(BIOTIC),
      "ja": named(BIOTIC),
      "viruses": heading(BIOTIC, "השתקת RNA נגד נגיפים"),
    },
  },
};
