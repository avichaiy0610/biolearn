import type { CourseScope } from "./types";

// 2026-11-02: six past exams (2021-2025) in the Drive are now evidence, and sections added from them are marked
// evidence "exam". Scope of the written units; the two unwritten units remain explicit in the plan.
export const technionVirologyScope: CourseScope = {
  courseSlug: "technion-virology",
  checkedAt: "2026-11-02",
  defaultSource: {
    labelHe: "פורטל הטכניון — 134039",
    url: "https://students.technion.ac.il/local/technionsearch/course/134039"
  },
  sections: {
    "vr-attachment-entry": {
      "receptor": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס מונה את שלבי המסלול הליטי בשמם: ספיחה, כניסה — זיהוי הקולטן ומה שקובע טווח מאכסנים",
      },
      "adsorption": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס מונה את שלבי המסלול הליטי בשמם: ספיחה, כניסה — הספיחה עצמה, הפיכה ובלתי הפיכה",
      },
      "phage-entry": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס מונה את שלבי המסלול הליטי בשמם: ספיחה, כניסה; הסילבוס מציין דוגמאות מפאג׳ים",
      },
      "animal-entry": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס מונה את שלבי המסלול הליטי בשמם: ספיחה, כניסה; הסילבוס מציין דוגמאות מנגיפי בעלי חיים",
      },
      "trigger": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "נכלל בשלב הכניסה שבתיאור הקורס, אבל מנגנון הטריגר אינו מוזכר בשמו",
      },
      "uncoating": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "נכלל בשלב הכניסה שבתיאור הקורס, אבל פירוק המעטפת אינו מוזכר בשמו",
      },
    },
    "vr-dna-expression": {
      "three-classes": {
        level: "core",
        evidence: "exam",
        noteHe: "שלוש קבוצות הגנים בנגיפי dsDNA לפי זמן הביטוי — 14 נקודות בשני מבחני 2023, וחוזר ב-2025"
      },
      cytoplasmic: {
        level: "core",
        evidence: "exam",
        noteHe: "נגיף DNA שמשכפל בציטופלזמה ונושא מערכת שעתוק בוויריון — חלק מהשאלה החוזרת על מקור הפולימראז"
      },
      "waves": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: המסלול הליטי — ביטוי הגנום — למה הביטוי מחולק בזמן",
      },
      "t7": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: דוגמאות מפאג׳ים בעלי גנומי DNA — T7 כמקרה המלא של החלפת הפולימראז",
      },
      "machinery": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: המסלול הליטי — ביטוי הגנום — מי משעתק כל גל",
      },
      "animal": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "נכלל בנושא ביטוי הגנום, אבל טרנסאקטיבטור אינו מוזכר בשמו",
      },
      "late-dependency": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "נכלל בנושא ביטוי הגנום, אבל התלות בשכפול אינה מוזכרת בשמה",
      },
      "experiments": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות — ניסוי זמנים, מוטנטים ובקרות",
      },
    },
    "vr-animal-defenses": {
      deamination: {
        level: "core",
        evidence: "exam",
        noteHe: "דה-אמינציה של ציטוזין: נגד מי פועלת, איך, ומה החלבון הנגיפי שמנטרל אותה — 16 נקודות ב-2023 ב'"
      },
      "other-defenses": {
        level: "core",
        evidence: "staff-material",
        noteHe: "ההגנות שהקורס מלמד בצד החי: חישה ו-NF-κB, אפופטוזיס וגנים נגד-אפופטוטיים, ו-RNAi"
      },
      "innate-recognition": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מסגרת יסוד של הנושא המפורש."
      },
      "sensor-compartments": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "ifn-production": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "autocrine-paracrine": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "antiviral-state": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      pkr: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "oas-rnase-l": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "response-limits": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-assembly-packaging": {
      "assembly-problem": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מסגרת יסוד של הנושא המפורש."
      },
      "self-assembly": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "assisted-assembly": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "assembly-pathways": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מסגרת יסוד של הנושא המפורש."
      },
      "genome-selection": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מסגרת יסוד של הנושא המפורש."
      },
      phi29: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "packaging-energy": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "packaging-evidence": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: הרכבה ואריזה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-bacterial-defenses": {
      "anti-crispr": {
        level: "core",
        evidence: "exam",
        noteHe: "מנגנון שמגן על הנגיף מפני CRISPR-Cas — 2023 א'; שני מאמרי 2024 עסקו בנגד-CRISPR מבוסס RNA, 16 נקודות כל אחד"
      },
      "defense-stages": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מסגרת יסוד של הנושא המפורש."
      },
      "restriction-modification": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "host-controlled-variation": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "crispr-stages": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "crispr-specificity": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "abortive-infection": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      cbass: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "defense-evidence": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: מנגנוני הגנה של המאכסן. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-evolution": {
      "diversity-sources": {
        level: "core",
        evidence: "exam",
        noteHe: "יצירת שונות: קצב מוטציה לפי סוג גנום, רקומבינציה וריאסורטמנט — שאלה של 15 נקודות ב-2025"
      },
      "variation-selection": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מסגרת יסוד של הנושא המפורש."
      },
      "fitness-context": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "drift-bottlenecks": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "mutant-populations": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      tradeoffs: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "arms-race": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מסגרת יסוד של הנושא המפורש."
      },
      "cyanophage-psba": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "evolution-evidence": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: תוצאות אבולוציוניות של יחסי הגומלין. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-exit": {
      "exit-barriers": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: יציאה. מסגרת יסוד של הנושא המפורש."
      },
      lysis: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: יציאה. מסגרת יסוד של הנושא המפורש."
      },
      budding: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: יציאה. מסגרת יסוד של הנושא המפורש."
      },
      escrt: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: יציאה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      exocytosis: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: יציאה. מסגרת יסוד של הנושא המפורש."
      },
      "nonlytic-release": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: יציאה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      m13: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: יציאה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "exit-evidence": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: יציאה. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-genome-replication": {
      "primer-types": {
        level: "core",
        evidence: "exam",
        noteHe: "\"נקבו בשלושה סוגי פריימרים שנגיפים שונים משתמשים בהם\" — 18 נקודות ב-2024 ב', ו-20 נקודות ב-2025"
      },
      "strand-displacement": {
        level: "core",
        evidence: "exam",
        noteHe: "תיאור תהליך השכפול עם אחד מסוגי הפריימרים — 2025, שאלה על שכפול"
      },
      "replication-questions": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שכפול הגנום. מסגרת יסוד של הנושא המפורש."
      },
      "primer-polymerase": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שכפול הגנום. מסגרת יסוד של הנושא המפורש."
      },
      "replication-machine": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שכפול הגנום. מסגרת יסוד של הנושא המפורש."
      },
      sv40: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: שכפול הגנום. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "viral-host-sources": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שכפול הגנום. מסגרת יסוד של הנושא המפורש."
      },
      "genome-ends": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שכפול הגנום. מסגרת יסוד של הנושא המפורש."
      },
      "rna-replication": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שכפול הגנום. מסגרת יסוד של הנושא המפורש."
      },
      "replication-evidence": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: שכפול הגנום. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-latency": {
      "latent-state": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: היבטים של המסלול הלטנטי. מסגרת יסוד של הנושא המפורש."
      },
      "genome-maintenance": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: היבטים של המסלול הלטנטי. מסגרת יסוד של הנושא המפורש."
      },
      "lambda-maintenance": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: היבטים של המסלול הלטנטי. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "lambda-induction": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: היבטים של המסלול הלטנטי. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "hsv-chromatin": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: היבטים של המסלול הלטנטי. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      reactivation: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: היבטים של המסלול הלטנטי. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "latency-evidence": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: היבטים של המסלול הלטנטי. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-methods": {
      counting: {
        level: "core",
        evidence: "exam",
        noteHe: "\"באיזו שיטה תכמתו את הנגיפים שנוצרו\" — חלק משאלת תכנון הניסוי בארבעה מבחנים"
      },
      measurement: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות. מסגרת יסוד של הנושא המפורש."
      },
      infectivity: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות. מסגרת יסוד של הנושא המפורש."
      },
      kinetics: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות. מסגרת יסוד של הנושא המפורש."
      },
      molecular: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      causality: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      controls: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      interpretation: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: שיטות מחקר בסיסיות. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-properties": {
      "tailed-phage": {
        level: "core",
        evidence: "exam",
        noteHe: "אילו נגיפים נושאים שתי סימטריות (2021, 2024 א'), שני תפקידי הזנב (2024 ב'), שני תפקידי הפורטל (2024 א')"
      },
      "capsid-enlargement": {
        level: "core",
        evidence: "exam",
        noteHe: "\"שתי דרכים שבהן קפסיד איקוסהדרלי יכול להתפתח כדי להכיל גנום גדול יותר\" — 2024 ב'"
      },
      virion: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מאפייני הנגיף. מסגרת יסוד של הנושא המפורש."
      },
      constraints: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מאפייני הנגיף. מסגרת יסוד של הנושא המפורש."
      },
      repetition: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מאפייני הנגיף. מסגרת יסוד של הנושא המפורש."
      },
      helical: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מאפייני הנגיף. מסגרת יסוד של הנושא המפורש."
      },
      icosahedral: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מאפייני הנגיף. מסגרת יסוד של הנושא המפורש."
      },
      envelope: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מאפייני הנגיף. מסגרת יסוד של הנושא המפורש."
      },
      information: {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: מאפייני הנגיף. מסגרת יסוד של הנושא המפורש."
      }
    },
    "vr-rna-expression": {
      "rna-jobs": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: ביטוי הגנום. מסגרת יסוד של הנושא המפורש."
      },
      "rna-products": {
        level: "core",
        evidence: "syllabus-named",
        noteHe: "תיאור הקורס: ביטוי הגנום. מסגרת יסוד של הנושא המפורש."
      },
      "translation-strategies": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: ביטוי הגנום. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      poliovirus: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: ביטוי הגנום. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      ms2: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: ביטוי הגנום. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "translation-switch": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: ביטוי הגנום. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      },
      "expression-evidence": {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "תיאור הקורס: ביטוי הגנום. מנגנון או דוגמה מייצגים; אינם נקובים בשמם בפורטל."
      }
    },
    "vr-origins": {
      "what-viruses-need": {
        level: "core",
        evidence: "exam",
        noteHe: "נשאל בחמישה מתוך שישה מבחנים: שלושה רכיבים או תפקודים שכל נגיף חייב מהמארח (2025, שאלה 4, 15 נקודות)"
      },
      size: {
        level: "core",
        evidence: "exam",
        noteHe: "טווח הגדלים והפרדה לפי גודל בסינון (2025, שאלה 1, 8 נקודות)"
      },
      alive: {
        level: "core",
        evidence: "exam",
        noteHe: "\"האם נגיפים חיים\" — 9 נקודות במבחן 2021"
      },
      hypotheses: {
        level: "core",
        evidence: "exam",
        noteHe: "מוצא הנגיפים — 14 נקודות בשני מבחני 2023"
      },
      "hallmark-genes": {
        level: "core",
        evidence: "exam",
        noteHe: "המאמר שנדון בכיתה ב-2023: קונין ועמיתיו 2006, גנים חתומים ומוצא הנגיפים"
      },
      testing: {
        level: "likely",
        evidence: "syllabus-heading",
        noteHe: "מסגרת מתודית לשאלת המוצא; אינה נקובה בשמה בפורטל."
      }
    },
  }
};