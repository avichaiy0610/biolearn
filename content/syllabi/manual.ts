/* Lesson tables read BY EYE from the official syllabus PDF, for documents whose table pdftotext cannot
   extract reliably (several text columns interleave — the record has `hasUnparsedSchedule`).

   scripts/syllabus-fetch.ts applies an entry only while the PDF is byte-for-byte the one that was read
   (`pdfSha16` = first 16 hex digits of the file's sha256). When the faculty replaces the file, the entry
   is NOT applied and the sync warns: open the new PDF in `Project One/syllabuses/_fetched/<slug>/` with
   the Read tool, re-read the table, and update the entry and its hash.

   Rules for an entry: topics verbatim and in the table's order; nothing added from other columns
   (reading, homework, teaching mode go to `noteHe`); a typo in the source is kept, with [] around a fix. */

export type ManualSyllabus = {
  pdfSha16: string;
  readAt: string; // ISO date of the visual read
  /** What the table numbers: "שיעור" (default), "שבוע", "יחידה". */
  sessionLabelHe?: string;
  sessions: { lectures: string; topicsHe: string[]; partHe?: string }[];
  /** Grading as the document's own table states it (replaces the scrambled extracted lines). */
  assessmentHe?: string[];
  noteHe?: string;
};

export const MANUAL_SYLLABI: Record<string, ManualSyllabus> = {
  "biu-biostatistics": {
    pdfSha16: "af4e8035222f23f4", readAt: "2026-11-11", sessionLabelHe: "שבוע",
    sessions: [
      { lectures: "1", topicsHe: ["תהליך המחקר המדעי - מאפיינים ועקרונות", "מהי הסטטיסטיקה - תיאור והסקה", "הגדרת משתנים. משתנה בדיד ומשתנה רציף", "רמות מדידה של משתנים"] },
      { lectures: "2", topicsHe: ["סטטיסטיקה תיאורית", "משתנים – תלוי וב\"ת, אוכלוסיה, מדגם, סולמות מדידה", "אופני תיאור והצגת משתנה – סדרת ערכים, טבלת שכיחויות, הצגה גרפית"] },
      { lectures: "3", topicsHe: ["מדדי המרכז: חישוב מדדי מרכז והשימוש בהם – הממוצע האריתמטי, החציון, השכיח", "מדדי פיזור: סטיית תקן ושונות, תחום", "תכונות מדדי הפיזור"] },
      { lectures: "4", topicsHe: ["התפלגות נורמלית", "משמעות ציון התקן", "התפלגות נורמלית סטנדרטית", "חישוב הסתברות בהתפלגות נורמלית", "חישוב אחוזונים"] },
      { lectures: "5", topicsHe: ["בדיקת השערות", "מבחן Z", "חישוב והבנת לוח Z"] },
      { lectures: "6", topicsHe: ["מבחן T – תיאוריה", "רווח סמך - מבחן Z ומבחן T"] },
      { lectures: "7", topicsHe: ["מבחן T למדגמים בלתי תלויים ולמדגמים מזווגים – תיאוריה", "קריאת פלטים"] },
      { lectures: "8", topicsHe: ["קורלציה – חישוב", "רגרסיה – תיאוריה והבנת פלטים"] },
      { lectures: "9", topicsHe: ["חי בריבוע"] },
      { lectures: "10", topicsHe: ["מבחני שונות חד ודו כיווניים – תיאוריה והבנת פלטים"] },
    ],
    assessmentHe: ["הגשת ארבעה תרגילים", "תרגילי בית (10%)", "מבחן מסכם (85%)"],
    noteHe: "תרגילי הבית לפי הטבלה: תרגיל 1 (סטטיסטיקה תיאורית, מדדי מרכז ופיזור) בשבוע 3; תרגיל 2 (התפלגות נורמלית, בדיקת השערות ורווח סמך) בשבוע 6; תרגיל 3 (הבנת פלטים – מבחני טי ומבחני שונות) בשבוע 10. במסמך מצוינים רק 95% מהציון.",
  },

  "biu-systems-physiology": {
    pdfSha16: "b69e401fb2a593fb", readAt: "2026-11-11",
    sessions: [
      { lectures: "1", topicsHe: ["מבוא: רמות האירגון בגוף האדם; הומאוסטזיס", "מערכות הבקרה בגוף האדם - מערכת העצבים האוטונומית והמערכת האנדוקרינית (המערכת ההורמונלית)"] },
      { lectures: "2", partHe: "המערכת הקרדיווסקולרית (שיעורים 2-9)", topicsHe: ["מרכיבי ותפקידי הדם", "אנטומיה של הלב", "מחזורי הדם (הסיסטמי והריאתי); מחזור הדם בעובר"] },
      { lectures: "3", topicsHe: ["כניסת הדם אל הלב, מעבר הדם בין מדורי הלב, יציאת הדם מהלב", "המעגל הכלילי", "מנגנון ההתכווצות של תא שריר הלב"] },
      { lectures: "4", topicsHe: ["מערכת ההולכה החשמלית בלב ותפקודה", "הקורלציה בין הפעילות החשמלית בלב לפעילות ההתכווצות וההרפיה של הלב"] },
      { lectures: "5", topicsHe: ["מחלות לב", "הפרעות קצב כפי שמשתקפות ברישומי אק\"ג"] },
      { lectures: "6", topicsHe: ["הקורלציה בין הפעילות החשמלית בלב ללחצים במדורי הלב ובאבי העורקים", "תפוקת הלב והגורמים המשפיעים עליה", "אי-ספיקת לב"] },
      { lectures: "7", topicsHe: ["וויסות תפוקת הלב ע\"י מערכת העצבים והמערכת ההורמונלית"] },
      { lectures: "8", topicsHe: ["המבנה האנטומי של כלי הדם", "מערכת הלחצים המניעה סינון וספיגה מחדש", "המודינמיקה"] },
      { lectures: "9", topicsHe: ["וויסות עצבי, הורמונלי ומקומי של לחץ הדם וזרימת הדם בכלל המערכת (לב וכלי הדם)", "שוק היפוולמי"] },
      { lectures: "10", partHe: "מערכת הנשימה (שיעורים 10-13)", topicsHe: ["אנטומיה של דרכי הנשימה", "מעבר וחילופי גזים בגוף"] },
      { lectures: "11", topicsHe: ["הסעת חמצן מהסביבה אל הרקמות", "הסעת פחמן דו-חמצני מהרקמות אל הסביבה"] },
      { lectures: "12", topicsHe: ["המכניקה של הנשימה; קיבולות ריאה; תפקודי ריאה", "מחלות ריאה"] },
      { lectures: "13", topicsHe: ["וויסות מערכת הנשימה ע\"י מערכת העצבים וגורמים אחרים"] },
    ],
    assessmentHe: ["מבחן מסכם — 100% מהציון הסופי", "נוכחות – חובה ב-80% מהשיעורים"],
    noteHe: "קריאה לפי הטבלה (Tortora & Derrickson, מהדורה 15): שיעור 1 – פרקים 1, 15, 18; שיעור 2 – 19, 20, 21; שיעורים 3–7 – פרק 20; שיעורים 8–9 – פרק 21; שיעורים 10–13 – פרק 23.",
  },

  "biu-animal-physiology": {
    pdfSha16: "647305d11a9c8dcc", readAt: "2026-11-11",
    sessions: [
      { lectures: "1", topicsHe: ["מבוא לפיזיולוגיה של ממברנות"] },
      { lectures: "2", topicsHe: ["פוטנציאל המנוחה של הממברנה"] },
      { lectures: "3", topicsHe: ["תעלות יוניות"] },
      { lectures: "4", topicsHe: ["תעלות תלויות מתח ופוטנציאל הפעולה"] },
      { lectures: "5", topicsHe: ["העברה סינפטית"] },
      { lectures: "6", topicsHe: ["תעלות יוניות המופעלות על ידי ליגנד"] },
      { lectures: "7", topicsHe: ["מנגנון ההתכווצות של שריר השלד"] },
      { lectures: "8", topicsHe: ["חוש המישוש"] },
      { lectures: "9", topicsHe: ["חוש המישוש (המשך)"] },
      { lectures: "10", topicsHe: ["בקרה על תנועה"] },
      { lectures: "11", topicsHe: ["החושים הכימיים"] },
      { lectures: "12", topicsHe: ["חוש השמע"] },
      { lectures: "13", topicsHe: ["חוש הראיה"] },
    ],
    assessmentHe: ["מבחן מסכם — 100% מהציון", "בוחן ביניים — 7% בונוס (7 נקודות)", "הערכה מעצבת: הגשת תרגילים — 0% מהציון הסופי (נקודות הבונוס נחשבות רק למי שהגיש 80% מהתרגילים)", "נוכחות – חובה ב-80% מהשיעורים והתרגולים"],
    noteHe: "קריאה לפי הטבלה (Kandel, Principles of Neural Science, מהדורה 5): שיעורים 1–13 – פרקים 4, 6, 5, 7, 12, 10, 34, 22, 22, 35, 32, 30, 26.",
  },

  "biu-molecular-a": {
    pdfSha16: "809f16a5721793dd", readAt: "2026-11-11",
    sessions: [
      { lectures: "1", topicsHe: ["מבוא, חזרה על הדוגמה המרכזית של הביולוגיה המולקולרית", "דנ״א - אנזימי רסטריקציה, הפרדת מולקולות דנ״א בג׳ל"] },
      { lectures: "2", topicsHe: ["שיבוט, פלסמידים, וקטורי ביטוי"] },
      { lectures: "3", topicsHe: ["סימון דנ״א, היברידיזציה, אנליזת southern, ספריה גנומית", "Spectral karyotyping & DNA in situ hybridization"] },
      { lectures: "4", topicsHe: ["קביעת רצף דנ״א – משיטות בסיסיות ועד לשיטות מתקדמות לקביעת רצף של גנום"] },
      { lectures: "5", topicsHe: ["שיטות אבחון גנטי (כולל RFLP)"] },
      { lectures: "6", topicsHe: ["רנ״א - ביטוי ייחודי לרקמה", "northern blot", "ספריית cDNA", "RNA-seq, DNA microarrays"] },
      { lectures: "7", topicsHe: ["reverse transcription-PCR", "Real-Time PCR", "השוואת שיטות שונות לבחינת ביטוי גנים"] },
      { lectures: "8", topicsHe: ["חלבונים - הפרדת חלבונים בג׳ל (ג׳ל חד-ממדי וג׳ל דו-ממדי)", "אנליזת mass spectrometry", "נוגדנים", "Immunostaining"] },
      { lectures: "9", topicsHe: ["western blot", "epitope tagging", "שימוש בחלבונים פלורסנטים"] },
      { lectures: "10", topicsHe: ["איפיון קישור בין חלבונים (כולל GST-fusion, Yeast Two-Hybrid, FRET)", "השקעת חלבונים בעזרת נוגדנים, IP-WB", "protein microarrays"] },
      { lectures: "11", topicsHe: ["עבודה עם תאים: הפרדת תאים, גידול תאים בתרבית, FACS", "ביטוי גנים בתאים לטווח זמן קצר ויצירת שורות תאים יציבות", "גנים מדווחים"] },
      { lectures: "12", topicsHe: ["אפיון קישור חלבון-דנ״א", "מוטגנזה מכוונת"] },
      { lectures: "13", topicsHe: ["חיות טרנסגניות", "שיטות להשתקת פעילות של גן", "החסרת גן מחיה שלמה - יצירת עכברי knock out", "CRISPR"] },
    ],
    assessmentHe: ["בחינה 100%", "בחנים באופן ספורדי במהלך הקורס — משימות בונוס לציון", "לקורס ישנו תרגול"],
    noteHe: "קריאת חובה: פרק 8 בספר \"ביולוגיה מולקולרית של התא\", מהדורה 6. המסמך מתוארך 2.25 (מכינה לרפואה, סמסטר ב').",
  },

  "biu-molecular-b": {
    pdfSha16: "66dcf5f5f954810f", readAt: "2026-11-11",
    sessions: [
      { lectures: "1", topicsHe: ["דנ\"א, כרומוזומים, גנום ואפיגנטיקה"] },
      { lectures: "2", topicsHe: ["כיצד תאים קוראים את הגנום ובקרה של ביטוי גנים"] },
      { lectures: "3", topicsHe: ["[ע]ריכה גנטית בעזרת מערכת הקריספר"] },
      { lectures: "4", topicsHe: ["שיטות למדידת דיוק של עריכה גנטית"] },
      { lectures: "5", topicsHe: ["עריכה אפיגנטית ומה עוד אפשר לעשות עם הגנום"] },
      { lectures: "6", topicsHe: ["סוגים שונים של סקרין מערכתי כלל גנומי (genome wide screens)"] },
      { lectures: "7", topicsHe: ["Omics I - Genomics"] },
      { lectures: "8", topicsHe: ["Omics II - Transcriptomics including single cell RNA sequencing"] },
      { lectures: "9", topicsHe: ["Omics III - Ribosome display and Proteomics"] },
      { lectures: "10", topicsHe: ["בקרה על רמות חלבונים בתא (שלבי התרגום ופירוק)"] },
    ],
    assessmentHe: ["מבחן (ציון מספרי)"],
    noteHe: "\"נושאים שקוצצו\" לפי המסמך: שיעורים 1, 2, 6 ו-10 כללו בשנים קודמות שני שיעורים כל אחד; השנה שיעור אחד — היקף החומר לא משתנה, אך יינתנו פחות דוגמאות. ספר: Molecular Biology of the Cell, Alberts, מהדורה 6.",
  },

  "biu-virology": {
    pdfSha16: "3de4f9de0abf5636", readAt: "2026-11-11",
    sessions: [
      { lectures: "1", topicsHe: ["ההיסטוריה של חקר הנגיפים; הגדרת הנגיפים; עקרונות המבנה וגנום הנגיפים; קריטריונים למיון נגיפים"] },
      { lectures: "2", topicsHe: ["שלבי ההדבקה הנגיפית: ספיחה, הצמדות, חדירה, הפשטה, התרבות, הבשלה ושחרור נגיפים", "דרכי ההעברה של נגיפים", "קולטנים תאיים המתווכים הצמדות וכניסת נגיפים לתא וחשיבותם"] },
      { lectures: "3", topicsHe: ["מנגנוני התרבות של נגיפים בעלי גנום DNA דו-גדילי ו-DNA חד-גדילי", "סקירה קצרה של מספר משפחות מייצגות"] },
      { lectures: "4", topicsHe: ["מנגנוני התרבות של נגיפים בעלי גנום RNA בפולאריות חיובית, נגיף הפוליו כדוגמא", "מנגנוני התרבות של נגיפים בעלי גנום RNA בפולאריות שלילית, נגיף השפעת כדוגמא"] },
      { lectures: "5", topicsHe: ["מאפייני ומנגנוני ההתרבות של נגיפי משפחת ה-Retroviridae", "HIV והתכשירים האנטי-נגיפיים המשמשים לעיכוב התרבותו"] },
      { lectures: "6", topicsHe: ["הרכבה והבשלה של נגיפים", "סוגי הדבקות נגיפיות: פרודוקטיבית, עקרה, מתמשכת וחבויה", "מערכות לריבוי ואפיון נגיפים (תרביות תאים, organ culture, ביצי עוף מופרות, וחיות מודל), אפקטים ציטופאתיים", "מושגים כלליים: רגישות, מתירנות", "אמצעים לכימות נגיפים, PFU ו-MOI; ניסוי גידול חד שלבי"] },
      { lectures: "7", topicsHe: ["נגיפים וסרטן", "נגיפים וריפוי גני", "דיון ביחסי הגומלין בין הנגיפים לבין התאים המאכסנים"] },
    ],
    assessmentHe: ["מבחן (עמידה בבחינה מסכמת)"],
    noteHe: "המסמך: \"נכון לשנת לימודים תשפ\"ג 2022\", 1 ש\"ס הרצאה; סדר השיעורים נתון לשינוי. בשיעור 6 המקור כותב \"IPFU ו-MO\" (שיבוש של PFU ו-MOI).",
  },

  "biu-biochem-b": {
    pdfSha16: "3a715ea8a23c62e6", readAt: "2026-11-11", sessionLabelHe: "יחידה",
    sessions: [
      { lectures: "1", partHe: "חלק א׳: ד״ר מורן דבלה-לויט", topicsHe: ["Course introduction"] },
      { lectures: "2", topicsHe: ["Introduction to Biochemistry", "Introduction to Bioenergetics"] },
      { lectures: "3", topicsHe: ["Carbohydrates structure", "Glycoconjugates: importance, function to cellular biology and research strategies"] },
      { lectures: "4", topicsHe: ["Overview of cellular respiration and major metabolic pathways (Glycolysis, PDC, Kreb's cycle, Electron transport chain, and anaerobic pathways)"] },
      { lectures: "5", topicsHe: ["Glycolysis", "Lactic acid and Ethanol fermentation"] },
      { lectures: "6", topicsHe: ["Regulation on enzymatic function"] },
      { lectures: "7", topicsHe: ["Glycolysis regulation, reactions and regulation"] },
      { lectures: "8", topicsHe: ["Pyruvate Dehydrogenase complex: principles and reactions"] },
      { lectures: "9", topicsHe: ["Krebs cycle: main principles and reactions"] },
      { lectures: "10", topicsHe: ["Krebs cycle regulation and integration of the cellular respiration pathways"] },
      { lectures: "1", partHe: "חלק ב׳: פרופ׳ ניסן יששכר", topicsHe: ["Oxidative phosphorylation, Membrane Structure, Membrane Transport - Fundamental Concepts"] },
      { lectures: "2", topicsHe: ["Electron Transport Chain and Chemical Variations"] },
      { lectures: "3", topicsHe: ["איך כל מה שלמדנו מתבטא במציאות"] },
      { lectures: "4", topicsHe: ["Biological Membranes"] },
      { lectures: "5", topicsHe: ["Fatty acids metabolism"] },
      { lectures: "6", topicsHe: ["Fatty acid oxidation"] },
      { lectures: "7", topicsHe: ["איך כל מה שלמדנו מתבטא במציאות"] },
      { lectures: "1", partHe: "חלק ג׳: ד״ר יואב פז", topicsHe: ["Metabolism of Nitrogenous Compounds I: Principles of Biosynthesis, Utilization, and Turnover", "Utilization of Inorganic Nitrogen: The Nitrogen Cycle; Utilization of Ammonia: Biogenesis of Organic Nitrogen"] },
      { lectures: "2", topicsHe: ["Metabolism of Nitrogenous Compounds I: Principles of Biosynthesis, Utilization, and Turnover", "The Nitrogen Economy: Aspects of Amino Acid Synthesis and Degradation; Protein Turnover; Amino Acid Degradation and Metabolism of Nitrogenous End Products; Coenzymes Involved in Nitrogen Metabolism"] },
      { lectures: "3", topicsHe: ["Metabolism of Nitrogenous Compounds II: Amino Acids, Porphyrins, and Neurotransmitters", "Pathways of Amino Acid Degradation; Amino Acids as Biosynthetic Precursors"] },
      { lectures: "4", topicsHe: ["Regulation of Glutamine Synthetase"] },
      { lectures: "5", topicsHe: ["Metabolism of Nitrogenous Compounds II: Amino Acids, Porphyrins, and Neurotransmitters", "Porphyrin and Heme Metabolism; Amino Acids and Their Metabolites as Neurotransmitters and Biological Regulators; Amino Acid Biosynthesis"] },
      { lectures: "6", topicsHe: ["Nucleotide Metabolism", "Outlines of Pathways in Nucleotide Metabolism; De Novo Biosynthesis of Purine Nucleotides; Purine Degradation and Clinical Disorders of Purine Metabolism"] },
      { lectures: "7", topicsHe: ["Nucleotide Metabolism", "Pyrimidine Nucleotide Metabolism; Glutamine-Dependent Amidotransferases; Deoxyribonucleotide Biosynthesis and Metabolism"] },
      { lectures: "8", topicsHe: ["Heme Metabolism: Synthesis & Catabolism"] },
      { lectures: "1", partHe: "חלק ד׳: פרופ׳ איתן אוקון", topicsHe: ["Gluconeogenesis: Substrates, enzymes, regulation"] },
      { lectures: "2", topicsHe: ["Glycogen synthesis and breakdown"] },
      { lectures: "3", topicsHe: ["Lactate metabolism"] },
      { lectures: "4", topicsHe: ["Gluconeogenesis substrates"] },
      { lectures: "5", topicsHe: ["Amino Acid Degradation and Metabolism of Nitrogenous End Products"] },
      { lectures: "6", topicsHe: ["Metabolic diseases: Defects of Glycogen metabolism"] },
      { lectures: "7", topicsHe: ["The effect of mutations in metabolism related enzyme on diseases"] },
      { lectures: "8", topicsHe: ["Metabolic Division of Labor Among the Major Organs"] },
      { lectures: "9", topicsHe: ["Coordination of Energy Homeostasis"] },
      { lectures: "10", topicsHe: ["Diabetes"] },
      { lectures: "11", topicsHe: ["Treatment strategies for type 1 and 2 diabetes"] },
      { lectures: "12", topicsHe: ["Signal transduction mechanisms of metabolism-related hormones"] },
      { lectures: "13", topicsHe: ["GPCRs"] },
      { lectures: "14", topicsHe: ["Secondary messengers"] },
      { lectures: "15", topicsHe: ["RTK"] },
      { lectures: "16", topicsHe: ["Steroid hormones"] },
      { lectures: "17", topicsHe: ["Caloric restriction, lifespan extention and autophagy"] },
      { lectures: "18", topicsHe: ["Metabolic fueling of the brain"] },
      { lectures: "19", topicsHe: ["Caffeine and energy metabolism"] },
    ],
    assessmentHe: ["מטלות Perusal — 25% מהציון הסופי", "מטלות Annoto — 25% מהציון הסופי", "מטלות בוטים עם תרחישים — 25% מהציון הסופי", "מבחן סופי — 25% מהציון הסופי", "בכל אחד מארבעת חלקי הקורס כשני מפגשים פרונטליים, שהנוכחות בהם חובה"],
    noteHe: "הטבלה מחולקת ליחידות לימוד (לא לשיעורים): הקורס היברידי, ארבעה מרצים ברצף, רוב היחידות מקוונות. ספר: Biochemistry (Van Holde), מהדורה 4 — חלק א׳ פרקים 3, 9, 13, 14; חלק ב׳ 10, 15, 17; חלק ג׳ 20, 21, 22; חלק ד׳ 13, 18, 20, 23. ליחידות 17–19 בחלק ד׳ מוצמדים שבעת מאמרי החובה שבסוף המסמך.",
  },
};
