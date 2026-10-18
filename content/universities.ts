/* Universities whose B.Sc. biology track the site can follow. Each track lives
   in the Course table (Course.university); "general" is the site's own
   cross-university track and the default. Sources are the official catalogs
   the tracks were built from — only biology courses are mapped (math,
   chemistry and physics are not covered by the site). */

export type University = {
  slug: string;
  nameHe: string;
  nameEn: string;
  shortHe: string;
  shortEn: string;
  programHe: string;
  programEn: string;
  sourceUrl?: string;
};

export const GENERAL_UNIVERSITY = "general";

export const UNIVERSITIES: University[] = [
  {
    slug: "general", nameHe: "מסלול כללי", nameEn: "General track", shortHe: "כללי", shortEn: "General",
    programHe: "המבנה הנפוץ באוניברסיטאות בארץ", programEn: "The structure most Israeli universities share",
  },
  {
    slug: "huji", nameHe: "האוניברסיטה העברית", nameEn: "Hebrew University of Jerusalem", shortHe: "העברית", shortEn: "HUJI",
    programHe: "מדעי החיים חד-חוגי (מסלול 4010), שנתון 2025", programEn: "Life Sciences, single major (track 4010), 2025 catalog",
    sourceUrl: "https://catalog.huji.ac.il/pages/wfrMaslulDetails.aspx?year=2025&faculty=2&entityId=570&chugId=570&degreeCode=71&maslulId=24010",
  },
  {
    slug: "tau", nameHe: "אוניברסיטת תל אביב", nameEn: "Tel Aviv University", shortHe: "תל אביב", shortEn: "TAU",
    programHe: "ביולוגיה מורחב, חד-חוגי — ידיעון תשפ\"א, מבנה שנה א' לפי מצגת 2025", programEn: "Biology, single major — 2020/21 handbook, year 1 per the 2025 orientation",
    sourceUrl: "https://lifesci.tau.ac.il/yedion/2020-21/biology-ba-structure?tab=2",
  },
  {
    slug: "technion", nameHe: "הטכניון", nameEn: "Technion", shortHe: "טכניון", shortEn: "Technion",
    programHe: "תואר ראשון בביולוגיה, המגמה הכללית — קטלוג תשפ\"ו", programEn: "B.Sc. in Biology, general track — 2025/26 catalog",
    sourceUrl: "https://ugportal.technion.ac.il/wp-content/uploads/2025/11/catalog2025-26.pdf",
  },
  {
    slug: "bgu", nameHe: "אוניברסיטת בן-גוריון", nameEn: "Ben-Gurion University", shortHe: "בן-גוריון", shortEn: "BGU",
    programHe: "מדעי החיים, תוכנית ראשית — שנתון תשפ\"ו", programEn: "Life Sciences, main program — 2025/26 catalog",
    sourceUrl: "https://www.bgu.ac.il/media/3o4kpdt0/life01.pdf",
  },
  {
    slug: "biu", nameHe: "אוניברסיטת בר-אילן", nameEn: "Bar-Ilan University", shortHe: "בר-אילן", shortEn: "BIU",
    programHe: "מדעי החיים חד-חוגי — מערכת תשפ\"ז", programEn: "Life Sciences, single major — 2026/27 timetable",
    sourceUrl: "https://life-sciences.biu.ac.il/node/10404",
  },
  {
    slug: "haifa", nameHe: "אוניברסיטת חיפה", nameEn: "University of Haifa", shortHe: "חיפה", shortEn: "Haifa",
    programHe: "ביולוגיה חד-חוגי — שנתון תשפ\"ה", programEn: "Biology, single major — 2024/25 catalog",
    sourceUrl: "https://shnaton2025.haifa.ac.il/2020/02/23/223-%D7%91%D7%99%D7%95%D7%9C%D7%95%D7%92%D7%99%D7%94",
  },
];

export const UNIVERSITY_COOKIE = "bl_uni";

export const universityBySlug = (slug: string | undefined | null) => UNIVERSITIES.find((u) => u.slug === slug);

export const COURSE_KIND_LABEL = {
  he: { required: "חובה", choice: "חובת בחירה", elective: "בחירה" },
  en: { required: "Required", choice: "Required elective", elective: "Elective" },
} as const;
export type CourseKind = keyof typeof COURSE_KIND_LABEL.he;
