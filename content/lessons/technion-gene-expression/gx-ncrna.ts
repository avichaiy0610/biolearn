import type { Lesson } from "../types";

// Technion 134119 — official syllabus: "בקרה על ידי רנ\"א לא מקודד". In this course the regulatory RNA is
// miRNA and siRNA with their enzymes (Drosha, Dicer, Argonaute) — Avichai, 2026-10-21. Riboswitches, bacterial
// sRNA, CRISPR, piRNA, RNAi heterochromatin and lncRNA were moved to content/lessons/_archive (gx-ncrna.full.ts).
// Facts checked against Lewin's Genes XII ch. 30 and Brown, Genomes 4, ch. 12.
export const gxNcrna: Lesson = {
  slug: "gx-ncrna",
  status: "draft",
  topic: "molecular-biology",
  course: { slug: "technion-gene-expression", nameHe: "בקרת הביטוי הגנטי" },
  titleHe: "בקרה על ידי RNA לא מקודד: miRNA ו-siRNA",
  leadHe:
    "חלק מה-RNA בתא לא מקודד לחלבון, אלא שולט בביטוי של גנים אחרים. RNA קטנים — כ-22 בסיסים — נטענים על חלבון Argonaute, מזווגים עם mRNA מטרה לפי רצף, וגורמים לחיתוך שלו, לפירוקו או לעיכוב התרגום. היחידה עוברת על שני הסוגים העיקריים — miRNA, שמקודד בגנום ומכוונן מאות גנים, ו-siRNA, שנוצר מ-RNA דו-גדילי וחותך מטרה מדויקת — ועל האנזימים שמייצרים אותם: Drosha ו-Dicer.",
  minutes: 35,
  objectivesHe: [
    "לתאר את שלבי הייצור של miRNA: Pol II, Drosha, Exportin-5, Dicer ו-Argonaute",
    "להסביר איך miRNA מזהה מטרות דרך אזור הזרע, ומה הוא עושה להן",
    "להסביר איך נוצר siRNA ואיך הוא חותך את המטרה",
    "להבחין בין miRNA ל-siRNA במקור, בזיווג ובתוצאה",
    "להסביר את השימוש ב-RNAi ככלי מחקר וכתרופה",
  ],
  bodyHe: `
## RNA קטנים רגולטוריים {#classes}

- **miRNA** ו-**siRNA** — RNA קצרים (כ-21–23 בסיסים) שנוצרים מ-RNA דו-גדילי ע"י **Dicer**.
- שניהם פועלים דרך אותו עיקרון: נטענים על חלבון **Argonaute**, ויוצרים איתו את **RISC** — ה-RNA מספק את **הספציפיות** (זיווג בסיסים עם המטרה), והחלבון מבצע את **הפעולה**.
- ההבדל העיקרי — המקור, ומידת ההשלמה למטרה (בהמשך).

## miRNA: ייצור ופעולה {#mirna}

**הייצור (המסלול הקנוני בבעלי חיים):**
1. גן ה-miRNA משועתק (בדרך כלל ע"י Pol II) ל-**pri-miRNA** ארוך, שמתקפל לגבעול-לולאה.
2. בגרעין, **Drosha** (עם DGCR8) חותך את הגבעול-לולאה → **pre-miRNA** (כ-70 בסיסים).
3. **Exportin-5** מוציא אותו לציטופלזמה.
4. **Dicer** חותך את הלולאה → דופלקס של כ-22 זוגות.
5. גדיל אחד (**המנחה**) נטען על חלבון **Argonaute** ויוצר **RISC**; השני מפורק.

**הפעולה:**
- miRNA מזווג עם המטרה (בדרך כלל ב**קצה ה-3′ הלא מתורגם**) בעיקר דרך **אזור הזרע** — בסיסים **2–8** של ה-miRNA. הזיווג בשאר הרצף **חלקי**.
- Argonaute מגייס את **GW182**, שמביא **דה-אדנילאזות** (CCR4–NOT) ומעכב את התרגום → ה-mRNA **מתורגם פחות ומפורק**.
- בגלל שמספיקים 7 בסיסים, miRNA אחד יכול לווסת **מאות** מטרות, ובדרך כלל משפיע על כל אחת **במידה מתונה** — כמו "כוונון עדין".

**התגלית:** **lin-4** בתולעת *C. elegans* (ויקטור אמברוס וגארי רובקון, 1993) — RNA קצר שמשלים לקצה ה-3′ של mRNA הגן **lin-14** ומשתיק אותו, וכך קובע את התזמון של שלבי ההתפתחות. ב-2000 נמצא **let-7**, ששמור גם באדם — והתברר שזו מערכת כללית (פרס נובל, 2024).

[[figure:mirna-pathway]]

## siRNA ו-RNAi {#sirna}

**siRNA** — נוצרים מ**RNA דו-גדילי ארוך** (נגיפי, טרנספוזון, או מלאכותי), ש-Dicer חותך לקטעים.
- siRNA מזווג **באופן מושלם** עם המטרה → Argonaute (**Ago2** ביונקים) **חותך** אותה ("slicer").
- תפקיד טבעי: **הגנה** מפני נגיפים וטרנספוזונים (בצמחים, בחרקים, בתולעים).

**RNAi ככלי וכתרופה:** הוספת RNA דו-גדילי או siRNA משתיקה גן נבחר — שיטה בסיסית במחקר. **פטיסירן** (2018) — siRNA ראשון שאושר כתרופה; הוא משתיק את ה-mRNA של **טרנסתירטין** בכבד, במחלת עמילואידוזיס תורשתית.

**ההבדלים:**
- **miRNA** — מגן ייעודי, מגבעול-לולאה (Drosha ואז Dicer); זיווג **חלקי** (זרע); מעכב ומפרק; מטרות רבות.
- **siRNA** — מ-RNA דו-גדילי ארוך (Dicer בלבד); זיווג **מושלם**; חיתוך; מטרות עם השלמה מלאה (וגם השפעות "מחוץ למטרה" דרך זיווג חלקי).
- כש-miRNA משלים **לגמרי** למטרה שלו, גם הוא יכול להוביל לחיתוך — ההבדל בתוצאה נובע בעיקר ממידת ההשלמה.
`,
  experiment: {
    titleHe: "איך אנחנו יודעים: הגדיל הכפול הוא שמשתיק",
    bodyHe: `בשנות ה-90 השתמשו חוקרים בתולעת *C. elegans* ב-**RNA אנטיסנס** כדי להשתיק גנים: מזריקים RNA שמשלים ל-mRNA, ומצפים שיזווג אליו ויחסום אותו. אבל היה משהו מוזר — גם **RNA סנס** (זהה ל-mRNA, ולכן לא אמור להזדווג אליו) השתיק את הגן.

ב-1998 בדקו **אנדרו פייר וקרייג מלו** את הפתרון: אולי בתכשירים של RNA סנס ואנטיסנס יש מעט **RNA דו-גדילי** שנוצר בטעות בזמן ההכנה. הם טיהרו בקפידה כל גדיל, והזריקו לתולעים, לגן שריר (unc-22) שהשתקתו גורמת לרעידות:
- גדיל סנס מטוהר — השפעה חלשה.
- גדיל אנטיסנס מטוהר — השפעה חלשה.
- **שני הגדילים יחד, כדו-גדילי** — השתקה **חזקה פי 10 עד 100**.

ועוד: **מעט מולקולות** בלבד (כמה לכל תא) הספיקו, ההשתקה **התפשטה** לרקמות אחרות ואפילו **עברה לצאצאים**, וה-mRNA של המטרה **נעלם** מהתא. זה לא יכול היה להיות זיווג פשוט של מולקולה מול מולקולה — היה צריך להיות מנגנון אנזימטי שמגביר את האות. הם קראו לתופעה **RNA interference**, וקיבלו עליה את פרס נובל ב-2006.`,
  },
  trapsHe: [
    "לחשוב ש-miRNA בבעלי חיים מזווג באופן מושלם עם המטרה — הזיווג המכריע הוא באזור הזרע (2–8), והשאר חלקי.",
    "לבלבל בין Drosha (בגרעין, pri→pre) ל-Dicer (בציטופלזמה, pre→דופלקס).",
    "לחשוב ש-siRNA עובר דרך Drosha — הוא נוצר מ-RNA דו-גדילי ארוך, ע\"י Dicer בלבד.",
    "לחשוב ששני הגדילים של הדופלקס פועלים — רק הגדיל המנחה נשאר ב-RISC.",
    "לחשוב ש-miRNA פועל על מטרה אחת — הוא מווסת מאות מטרות, כל אחת במידה מתונה.",
  ],
  terms: [
    { he: "RNA לא מקודד", en: "Noncoding RNA (ncRNA)" },
    { he: "מיקרו-RNA", en: "MicroRNA (miRNA)" },
    { he: "RNA מפריע קצר", en: "Small interfering RNA (siRNA)" },
    { he: "pri-miRNA / pre-miRNA", en: "Primary / precursor miRNA" },
    { he: "Drosha", en: "Drosha" },
    { he: "Dicer", en: "Dicer" },
    { he: "אזור הזרע", en: "Seed region" },
    { he: "RISC", en: "RNA-induced silencing complex" },
    { he: "Argonaute", en: "Argonaute" },
    { he: "התערבות RNA", en: "RNA interference (RNAi)" },
  ],
  workedProblems: [
    {
      id: "mirna-reporter",
      titleHe: "גן מדווח עם אתר ל-miRNA",
      problemHe: `חוקר חיבר את קצה ה-3′ הלא מתורגם של גן X ללוציפראז, והכניס לתאים עם miR-A. הפעילות ירדה ב-60% (לעומת בקרה בלי miR-A).

(א) הוא שינה שני בסיסים באתר שמשלים לבסיסים 3–4 של miR-A. הירידה נעלמה. מה זה מלמד?

(ב) הוא שינה שני בסיסים באתר שמשלים לבסיסים 15–16. הירידה כמעט לא השתנתה. למה?

(ג) מה יקרה לירידה אם מוסיפים "אנטגומיר" — אוליגו שמשלים את miR-A ונקשר אליו?

(ד) בתאים, רמת ה-mRNA של הלוציפראז ירדה ב-50%. מה זה אומר על המנגנון?`,
      solutionHe: `**(א)** הבסיסים 3–4 נמצאים ב**אזור הזרע** — הזיווג שם **חיוני** להכרה.

**(ב)** בסיסים 15–16 **מחוץ לזרע**; הזיווג שם תורם מעט בלבד.

**(ג)** האנטגומיר "תופס" את miR-A — **הירידה נעלמת** (הפעילות חוזרת).

**(ד)** חלק גדול מההשפעה הוא **פירוק ה-mRNA** (דרך דה-אדנילציה), ולא רק עיכוב תרגום — כפי שנמצא לרוב ה-miRNA ביונקים.`,
      answerHe: "(א) אזור הזרע חיוני; (ב) מחוץ לזרע — השפעה קטנה; (ג) הירידה נעלמת; (ד) בעיקר פירוק mRNA.",
    },
    {
      id: "processing-mutants",
      titleHe: "איפה נעצר המסלול?",
      problemHe: `בתאים יש miRNA בשם miR-B, ומטרה שלו — גן Y. מה יקרה ל-pri-miR-B, ל-pre-miR-B, ל-miR-B הבשל ולחלבון Y בכל מוטנט?

(א) תאים בלי Drosha.

(ב) תאים בלי Dicer.

(ג) תאים בלי Exportin-5.

(ד) בתאים בלי Drosha מכניסים siRNA סינתטי (דופלקס בשל) נגד ה-mRNA של Y. האם Y יושתק?`,
      solutionHe: `**(א)** pri-miRNA **מצטבר**; אין pre ואין miRNA בשל → **Y עולה** (אין מי שידכא אותו).

**(ב)** pri נחתך כרגיל, **pre-miRNA מצטבר**; אין miRNA בשל → **Y עולה**.

**(ג)** pre-miRNA **נשאר בגרעין** (ומחלקו מתפרק) → מעט miRNA בשל → **Y עולה**.

**(ד)** **כן** — דופלקס בשל לא צריך Drosha ולא Dicer; הוא נטען ישירות על Argonaute. כך משתיקים גנים במעבדה גם בתאים שבהם המסלול פגום.`,
      answerHe: "(א) pri מצטבר, Y עולה; (ב) pre מצטבר, Y עולה; (ג) pre בגרעין, Y עולה; (ד) כן — siRNA בשל עוקף את Drosha ו-Dicer.",
    },
  ],
  questions: [
    {
      id: "nc-1", difficulty: "easy",
      question: "איזה אנזים חותך את ה-pre-miRNA בציטופלזמה?",
      options: [
        { text: "Drosha", why: "בגרעין, על ה-pri-miRNA." },
        { text: "Dicer", why: "נכון." },
        { text: "Argonaute", why: "הוא נושא את ה-miRNA." },
        { text: "Exportin-5", why: "הוא מוציא את ה-pre-miRNA מהגרעין." },
      ],
      correct: 1,
    },
    {
      id: "nc-2", difficulty: "medium",
      question: "מה ההבדל העיקרי בפעולה של siRNA לעומת רוב ה-miRNA ביונקים?",
      options: [
        { text: "siRNA פועל בגרעין בלבד", why: "לא." },
        { text: "siRNA מזווג באופן מושלם, ו-Argonaute חותך את המטרה", why: "נכון." },
        { text: "siRNA לא צריך Argonaute", why: "צריך." },
        { text: "siRNA מפעיל תרגום", why: "לא." },
      ],
      correct: 1,
    },
    {
      id: "nc-3", difficulty: "medium",
      question: "איפה Drosha חותך, ומה התוצר?",
      options: [
        { text: "בציטופלזמה — דופלקס של 22 זוגות", why: "זה Dicer." },
        { text: "בגרעין — pre-miRNA בצורת גבעול-לולאה", why: "נכון." },
        { text: "בגרעין — miRNA בשל", why: "עוד צריך את Dicer." },
        { text: "בציטופלזמה — pri-miRNA", why: "pri-miRNA הוא המצע שלו, בגרעין." },
      ],
      correct: 1,
    },
    {
      id: "nc-4", difficulty: "hard",
      question: "למה miRNA אחד יכול לווסת מאות גנים?",
      options: [
        { text: "הוא נקשר לפרומוטורים", why: "לא." },
        { text: "ההכרה תלויה בעיקר בזיווג של 7 בסיסים (אזור הזרע), שנמצא בקצה ה-3′ של mRNA רבים", why: "נכון." },
        { text: "הוא חותך כל mRNA בתא", why: "לא." },
        { text: "הוא מתורגם לחלבון מווסת", why: "הוא לא מקודד." },
      ],
      correct: 1,
    },
    {
      id: "nc-5", difficulty: "easy",
      question: "איפה בדרך כלל נקשר miRNA ב-mRNA המטרה בבעלי חיים?",
      options: [
        { text: "בכובע בקצה ה-5′", why: "לא." },
        { text: "בקצה ה-3′ הלא מתורגם, דרך אזור הזרע", why: "נכון." },
        { text: "בקודון ההתחלה בלבד", why: "לא." },
        { text: "בזנב הפולי-A", why: "לא." },
      ],
      correct: 1,
    },
    {
      id: "nc-6", difficulty: "medium",
      question: "מאיזה מקור נוצר siRNA?",
      options: [
        { text: "מגן ייעודי עם גבעול-לולאה, דרך Drosha", why: "זה miRNA." },
        { text: "מ-RNA דו-גדילי ארוך שנחתך ע\"י Dicer", why: "נכון." },
        { text: "מ-tRNA", why: "לא." },
        { text: "מ-rRNA", why: "לא." },
      ],
      correct: 1,
    },
  ],
  refs: [
    { kind: "book", text: "Krebs J.E., Goldstein E.S., Kilpatrick S.T. Lewin's Genes XII (2018), ch. 30." },
    { kind: "book", text: "Brown T.A. Genomes 4 (2018), ch. 12." },
    { kind: "paper", text: "Fire A., Xu S., Montgomery M.K., Kostas S.A., Driver S.E., Mello C.C. (1998). Potent and specific genetic interference by double-stranded RNA in Caenorhabditis elegans. Nature 391: 806–811." },
    { kind: "paper", text: "Lee R.C., Feinbaum R.L., Ambros V. (1993). The C. elegans heterochronic gene lin-4 encodes small RNAs with antisense complementarity to lin-14. Cell 75: 843–854." },
  ],
  review: { writtenBy: "Claude", writtenAt: "2026-10-22" },
};
