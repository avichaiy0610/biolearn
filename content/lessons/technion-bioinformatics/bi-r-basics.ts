import type { Lesson } from "../types";

// Technion 136158 — portal outcome 2: "use the R language to answer basic bioinformatic questions in biology and
// medicine". Scope (Codex 2026-10-26): practical tables — import, clean, subset, join, plot — and a first Bioconductor
// task; R practice continues in every later unit. Code checked in R 4.4 (base R + Biostrings).
export const biRBasics: Lesson = {
  slug: "bi-r-basics",
  status: "draft",
  topic: "bioinformatics",
  course: { slug: "technion-bioinformatics", nameHe: "שיטות בביואינפורמטיקה למדעי החיים" },
  titleHe: "R לנתונים ביולוגיים",
  leadHe:
    "R היא שפה שנבנתה לניתוח נתונים, וסביבה שבה נמצאים רוב הכלים הסטטיסטיים והביואינפורמטיים לביולוגים. היחידה לא מלמדת תכנות מאפס — היא מראה את מה שצריך כדי לעבוד עם טבלה ביולוגית אמיתית: וקטורים וטבלאות, קריאה מקובץ, סינון ומיון, חיבור שתי טבלאות, גרף ראשון — וצעד ראשון ב-Bioconductor עם רצפים.",
  minutes: 50,
  objectivesHe: [
    "להבחין בין וקטור, factor, data frame ו-list, ולדעת איך לגשת לאיברים בכל אחד",
    "לקרוא טבלה מקובץ CSV/TSV ולבדוק שהיא נקראה נכון",
    "לסנן, למיין ולחשב עמודות חדשות בטבלה",
    "לחבר שתי טבלאות לפי עמודה משותפת (merge)",
    "לצייר היסטוגרמה ו-boxplot ולקרוא אותם",
    "להשתמש ב-Biostrings לחישוב בסיסי על רצפים",
    "להסביר למה ניתוח בקוד עדיף על עבודה ידנית בגיליון",
  ],
  bodyHe: `
## וקטורים — אבן הבניין {#vectors}

ב-R **כמעט הכול וקטור**: גם מספר בודד הוא וקטור באורך 1. פעולות חלות על **כל האיברים בבת אחת** — בלי לולאה.

\`\`\`r
len <- c(1200, 450, 3300, 980)        # lengths of four genes (bp)
names(len) <- c("geneA", "geneB", "geneC", "geneD")
len / 1000                             # all lengths in kb
len > 1000                             # logical vector: TRUE FALSE TRUE FALSE
len[len > 1000]                        # only the long genes
mean(len); sum(len > 1000)             # mean; how many are longer than 1000
\`\`\`

**שלוש דרכים לבחור איברים:** לפי **מיקום** (\`len[2]\` — שימו לב: הספירה ב-R מתחילה מ-**1**), לפי **שם** (\`len["geneC"]\`), ולפי **תנאי** (\`len[len > 1000]\`).

**סוגי וקטורים:** מספרי (\`numeric\`), טקסט (\`character\`), לוגי (\`logical\`). וקטור מכיל **סוג אחד** בלבד — אם מערבבים מספרים וטקסט, הכול הופך לטקסט. זו סיבה נפוצה לכך ש"המספרים לא מתחברים".

**factor** — משתנה קטגוריאלי (טיפול/ביקורת, רקמה) עם רשימת **רמות** קבועה. סטטיסטיקה וגרפים ב-R משתמשים ברמות — למשל, הרמה הראשונה היא קבוצת ההשוואה.

## טבלאות: data frame {#data-frames}

**data frame** היא טבלה: כל **עמודה** היא וקטור (עם סוג משלה), כל **שורה** היא תצפית — גן, דגימה, חולה.

\`\`\`r
expr <- read.csv("expression.csv")     # read a file; for TSV: read.delim()
dim(expr); head(expr); str(expr)       # size, first rows, type of each column
summary(expr$log2FC)                   # one column: $name
expr[expr$padj < 0.05, ]               # rows that meet a condition (comma = all columns)
expr[order(expr$padj), c("gene", "log2FC", "padj")]   # sort and pick columns
expr$up <- expr$log2FC > 1             # a new computed column
\`\`\`

**לבדוק תמיד אחרי קריאה:** \`str()\` — האם עמודה מספרית נקראה כמספר? (מספיק תא אחד עם "NA " או "–" כדי שכל העמודה תהפוך לטקסט.) \`dim()\` — האם מספר השורות הגיוני? \`head()\` — האם הכותרות נכונות?

**ערכים חסרים:** \`NA\`. רוב הפונקציות מחזירות \`NA\` אם יש ערך חסר — \`mean(x, na.rm = TRUE)\` מתעלם ממנו. \`is.na()\` מוצא אותם.

**list** — מכיל איברים מכל סוג ובכל אורך (טבלה, וקטור, טקסט). תוצאות של פונקציות סטטיסטיות (כמו \`t.test\`) הן list, וניגשים לחלקים שלהן ב-\`$\`.

## חיבור טבלאות {#merge}

לעיתים קרובות הנתונים בשתי טבלאות: תוצאות הניסוי לפי **מזהה גן**, וביאור (שם, כרומוזום, תפקוד) בטבלה אחרת.

\`\`\`r
annot <- read.delim("annotation.tsv")  # columns: gene, symbol, chromosome
both <- merge(expr, annot, by = "gene")              # only genes found in both
both_all <- merge(expr, annot, by = "gene", all.x = TRUE)   # keep every gene of expr
\`\`\`

**לבדוק אחרי חיבור:** כמה שורות היו וכמה נשארו. אם נעלמו הרבה — המזהים כנראה **לא באותו פורמט** (למשל \`ENSG00000141510.18\` עם גרסה מול \`ENSG00000141510\` בלי, או סמל גן מול מזהה Ensembl). אם השורות **התרבו** — לאחד המזהים יש יותר משורה אחת בטבלת הביאור.

## גרפים ראשונים {#plots}

[[figure:bi-r-plots]]

\`\`\`r
hist(expr$log2FC, breaks = 50, main = "log2 fold change")
# a small demonstration table
long <- data.frame(condition = rep(c("control", "treated"), each = 3),
                   value     = c(8, 10, 12, 18, 20, 22))
boxplot(value ~ condition, data = long, ylab = "expression")
\`\`\`

- **היסטוגרמה** — צורת ההתפלגות של משתנה אחד: האם היא סימטרית, יש זנב, יש ערכים קיצוניים?
- **boxplot** — השוואה בין קבוצות: הקו האמצעי הוא **החציון**, הקופסה — **הרבעון הראשון עד השלישי**, והנקודות מחוץ ל"שפמים" — ערכים קיצוניים.

**התפלגויות ביולוגיות לעיתים מוטות:** ביטוי גנים, למשל, מכיל הרבה ערכים נמוכים ומעט גבוהים מאוד. לכן מציגים לעיתים קרובות **log2** — ושם הפרש של 1 הוא הכפלה.

## Bioconductor ורצפים {#bioconductor}

**Bioconductor** הוא אוסף של אלפי חבילות R לניתוח נתונים ביולוגיים — מרצפים ועד ניתוח ביטוי. התקנה דרך \`BiocManager::install("Biostrings")\`.

\`\`\`r
library(Biostrings)
dna <- DNAString("ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCC")
length(dna)
letterFrequency(dna, "GC", as.prob = TRUE)   # GC fraction
reverseComplement(dna)
translate(dna)                                # MVHLTPEEKSAVTA
seqs <- readDNAStringSet("sequences.fasta")   # a FASTA file with many sequences
width(seqs)                                   # length of each sequence
\`\`\`

\`DNAString\` מכיר את **אלפבית** ה-DNA: \`translate\` משתמש בקוד הגנטי, \`reverseComplement\` יודע ש-A מול T. מחרוזת טקסט רגילה לא יודעת את זה.

## למה קוד ולא גיליון {#why-code}

גיליון אלקטרוני נוח להצצה, אבל לניתוח יש לו בעיות:
- **אין תיעוד:** לא רואים איזה סינון נעשה, באיזה סדר, ועל אילו שורות.
- **שינויים שקטים:** הוא "מתקן" נתונים בלי לשאול (ראו "איך אנחנו יודעים").
- **אי אפשר לחזור:** כשמגיעים נתונים חדשים צריך לעשות הכול שוב בידיים.

סקריפט R הוא **מתכון**: מריצים אותו שוב על נתונים חדשים ומקבלים בדיוק את אותם צעדים. בקורס, כל תוצאה צריכה להגיע מקוד שמישהו אחר יכול להריץ.
`,
  experiment: {
    titleHe: "איך אנחנו יודעים: גיליון אלקטרוני הפך גנים לתאריכים (זימן ועמיתים, 2016)",
    bodyHe: `**הרקע:** חלק משמות הגנים דומים לתאריכים או למספרים: \`SEPT2\` (ספטין 2), \`MARCH1\`, \`DEC1\`. כשמדביקים או פותחים רשימת גנים בגיליון עם ההגדרות הרגילות — התוכנה **ממירה אותם לתאריך** (\`SEPT2\` ← 2 בספטמבר) בלי להודיע. מזהים מספריים ארוכים עלולים להפוך לכתיב מדעי.

**מה עשו:** מארק זימן, יותם אירן ואסם אל-אוסטה סרקו את **קובצי ה-Excel הנלווים** של אלפי מאמרים בגנומיקה מ-18 כתבי עת (2005–2015), וחיפשו רשימות גנים שחלק מהשמות בהן הפכו לתאריכים או למספרים.

**מה מצאו:** בכ-**חמישית** מהמאמרים שצירפו רשימות גנים ב-Excel היו שמות גנים **משובשים** — והשיעור עלה עם השנים. השגיאות האלה עוברות לניתוחים הבאים: גן שהפך לתאריך פשוט "נעלם" מניתוח העשרה או מחיבור לטבלת ביאור.

**ההמשך:** ב-2020 **שינתה** הוועדה לשמות גנים אנושיים (HGNC) את שמותיהם של כמה עשרות גנים כאלה — \`SEPT2\` הפך ל-\`SEPTIN2\`, \`MARCH1\` ל-\`MARCHF1\`. כלומר, היה **קל יותר לשנות את שמות הגנים מאשר את התוכנה**.

**המסקנה:** נתונים עוברים דרך קוד, שבו רואים כל צעד; בודקים אחרי קריאה שהמזהים נשארו כפי שהיו; ושומרים טבלאות בפורמט טקסט (CSV/TSV).`,
  },
  trapsHe: [
    "לספור מ-0: ב-R האיבר הראשון הוא x[1], לא x[0].",
    "לשכוח את הפסיק בבחירת שורות: expr[expr$padj < 0.05, ] — בלי הפסיק R מבין שמדובר בעמודות.",
    "לא לבדוק את סוג העמודה אחרי קריאה — תא אחד עם טקסט הופך עמודה מספרית שלמה לטקסט.",
    "לחשב ממוצע על עמודה עם NA ולקבל NA — צריך na.rm = TRUE (ולשאול למה חסרים ערכים).",
    "לחבר טבלאות ולא לבדוק כמה שורות נשארו — פורמט מזהים שונה (עם גרסה / בלי) מוחק שורות בשקט.",
    "להשתמש ב-== להשוואה לערך חסר — x == NA תמיד NA; משתמשים ב-is.na(x).",
    "לתרגם DNA כטקסט רגיל — Biostrings מכיר את הקוד הגנטי והאלפבית; מחרוזת רגילה לא.",
  ],
  terms: [
    { he: "וקטור", en: "Vector" },
    { he: "משתנה קטגוריאלי (רמות)", en: "Factor (levels)" },
    { he: "טבלת נתונים", en: "Data frame" },
    { he: "רשימה", en: "List" },
    { he: "ערך חסר", en: "NA (missing value)" },
    { he: "בחירה לפי תנאי", en: "Logical indexing" },
    { he: "חיבור טבלאות", en: "Merge / join" },
    { he: "היסטוגרמה / boxplot", en: "Histogram / box plot" },
    { he: "Bioconductor", en: "Bioconductor" },
    { he: "Biostrings", en: "Biostrings (DNAString, DNAStringSet)" },
    { he: "סקריפט ניתן לשחזור", en: "Reproducible script" },
  ],
  workedProblems: [
    {
      id: "filter-table",
      titleHe: "סינון טבלת תוצאות",
      problemHe: `בטבלה \`res\` יש תוצאות ניסוי ביטוי: עמודות \`gene\`, \`log2FC\`, \`padj\`.

\`\`\`r
res <- data.frame(gene   = c("TP53", "MYC", "GAPDH", "CDKN1A", "BAX"),
                  log2FC = c(0.2, -2.1, 0.0, 3.4, 1.6),
                  padj   = c(0.6, 0.001, 0.99, 1e-8, NA))
\`\`\`

(א) מה יחזיר \`res[res$padj < 0.05, ]\`? שימו לב לשורה של BAX.
(ב) כתבו פקודה שמחזירה רק את הגנים שגם \`padj < 0.05\` וגם \`log2FC > 1\`, בלי שורות NA.
(ג) מה המשמעות הביולוגית של \`log2FC = -2.1\`?`,
      solutionHe: `**(א)** MYC ו-CDKN1A — **וגם שורה של NA**: ל-BAX \`padj\` חסר, התנאי \`NA < 0.05\` הוא \`NA\`, ו-R מחזיר שורה ריקה (כולה NA). זו מלכודת קלאסית.

**(ב)**
\`\`\`r
res[!is.na(res$padj) & res$padj < 0.05 & res$log2FC > 1, ]
# or: subset(res, padj < 0.05 & log2FC > 1)   (subset drops NA rows)
\`\`\`
התוצאה: **CDKN1A** בלבד (MYC ירד, BAX בלי padj).

**(ג)** \`2^-2.1 ≈ 0.23\` ← הביטוי של MYC בקבוצת הטיפול הוא כ-**רבע** מזה שבביקורת (ירידה של פי ~4.3).`,
      answerHe: "(א) MYC, CDKN1A ושורת NA; (ב) רק CDKN1A; (ג) ירידה לכרבע מהביטוי.",
    },
    {
      id: "merge-check",
      titleHe: "חיבור שנכשל",
      problemHe: `לטבלת התוצאות (2,000 גנים, עמודה \`gene\` עם ערכים כמו \`ENSG00000141510.18\`) מחברים טבלת ביאור (60,000 גנים, עמודה \`gene\` עם ערכים כמו \`ENSG00000141510\`).
\`merge(res, annot, by = "gene")\` מחזיר **0 שורות**.
(א) מה הבעיה?
(ב) איך מתקנים בקוד?
(ג) אחרי התיקון מתקבלות 2,013 שורות. מה זה אומר?`,
      solutionHe: `**(א)** במזהים של \`res\` יש **מספר גרסה** (\`.18\`), ובביאור אין — אף מזהה לא זהה.

**(ב)** מסירים את הגרסה:
\`\`\`r
res$gene <- sub("\\\\..*$", "", res$gene)    # drop the dot and everything after it
\`\`\`

**(ג)** יותר שורות מגנים ← לחלק מהמזהים יש **יותר משורה אחת** בטבלת הביאור (למשל גן עם שני שמות או שני מיקומים). בודקים: \`sum(duplicated(annot$gene))\`, ומחליטים איזו שורה להשאיר.`,
      answerHe: "(א) גרסה במזהה; (ב) מוחקים את הגרסה עם sub; (ג) כפילויות בטבלת הביאור.",
    },
  ],
  questions: [
    {
      id: "r-1", difficulty: "easy",
      question: "x <- c(5, 8, 2). מה יחזיר x[2]?",
      options: [
        { text: "8", why: "נכון — ב-R הספירה מתחילה מ-1." },
        { text: "2", why: "זה x[3]; ב-R האיבר הראשון הוא x[1]." },
        { text: "5", why: "זה x[1]." },
        { text: "שגיאה", why: "אין שגיאה — מיקום 2 קיים." },
      ],
      correct: 0,
    },
    {
      id: "r-2", difficulty: "easy",
      question: "מה עושה הפקודה str(df) מיד אחרי קריאת קובץ?",
      options: [
        { text: "מציגה את מבנה הטבלה: מספר שורות ועמודות והסוג של כל עמודה", why: "נכון — כך בודקים שעמודות מספריות נקראו כמספרים." },
        { text: "ממירה את כל העמודות לטקסט", why: "str רק מציגה, לא משנה." },
        { text: "מוחקת שורות עם NA", why: "את זה עושה na.omit." },
        { text: "שומרת את הטבלה לקובץ", why: "לשמירה: write.csv." },
      ],
      correct: 0,
    },
    {
      id: "r-3", difficulty: "medium",
      question: "עמודת \"expression\" נקראה כטקסט במקום כמספר. מה הסיבה הסבירה?",
      options: [
        { text: "באחד התאים או יותר יש ערך שאינו מספר (כמו \"n/a\" או \"–\")", why: "נכון — תא אחד מספיק כדי שכל העמודה תהיה טקסט." },
        { text: "R לא יודע לקרוא מספרים מקובץ CSV", why: "הוא קורא מספרים כרגיל." },
        { text: "העמודה ארוכה מדי", why: "אורך לא משנה סוג." },
        { text: "שם העמודה באנגלית", why: "לשם אין קשר לסוג." },
      ],
      correct: 0,
    },
    {
      id: "r-4", difficulty: "medium",
      question: "mean(c(4, NA, 6)) מחזיר NA. מה הפתרון הנכון?",
      options: [
        { text: "mean(c(4, NA, 6), na.rm = TRUE) — ולבדוק למה הערך חסר", why: "נכון — מתעלמים מ-NA במודע." },
        { text: "להחליף את NA ב-0", why: "0 הוא ערך אמיתי ויטה את הממוצע." },
        { text: "אי אפשר לחשב ממוצע כשיש ערך חסר", why: "אפשר, עם na.rm = TRUE." },
        { text: "mean(c(4, NA, 6), na.rm = FALSE)", why: "FALSE משאיר את הערך החסר בחישוב, ולכן התוצאה עדיין NA." },
      ],
      correct: 0,
    },
    {
      id: "r-5", difficulty: "medium",
      question: "בטבלה של 500 גנים, merge עם טבלת ביאור החזיר 120 שורות בלבד. מה הצעד הראשון?",
      options: [
        { text: "להשוות את פורמט המזהים בשתי הטבלאות (גרסה, סמל מול Ensembl, אותיות גדולות/קטנות)", why: "נכון — זו הסיבה הנפוצה." },
        { text: "להשתמש רק ב-120 הגנים", why: "זה מאבד בשקט 380 גנים." },
        { text: "להריץ את merge שוב", why: "אותה פקודה תיתן אותה תוצאה." },
        { text: "למחוק את טבלת הביאור", why: "זה לא פותר את הבעיה." },
      ],
      correct: 0,
    },
    {
      id: "r-6", difficulty: "hard",
      question: "למה ב-boxplot של ביטוי גנים מציגים לעיתים קרובות log2 של הביטוי?",
      options: [
        { text: "ההתפלגות מוטה מאוד (הרבה ערכים נמוכים, מעט גבוהים מאוד); log2 מאזן אותה, והפרש של 1 שווה הכפלה", why: "נכון." },
        { text: "log2 מעלים ערכים חריגים לגמרי", why: "הוא מקטין את ההשפעה שלהם על התצוגה, לא מעלים." },
        { text: "R לא יכול לצייר ערכים גדולים", why: "יכול." },
        { text: "log2 הופך את הנתונים לנורמליים בדיוק", why: "הוא מקרב לסימטריה, לא מבטיח נורמליות." },
      ],
      correct: 0,
    },
  ],
  refs: [
    { kind: "paper", text: "Ziemann M, Eren Y, El-Osta A (2016) Gene name errors are widespread in the scientific literature. Genome Biol 17:177." },
    { kind: "paper", text: "Bruford EA et al. (2020) Guidelines for human gene nomenclature. Nat Genet 52:754–758." },
    { kind: "paper", text: "Huber W et al. (2015) Orchestrating high-throughput genomic analysis with Bioconductor. Nat Methods 12:115–121." },
    { kind: "book", text: "Wickham H, Çetinkaya-Rundel M, Grolemund G (2023) R for Data Science, 2nd ed. O'Reilly." },
  ],
  review: { writtenBy: "Claude", writtenAt: "2026-10-26" },
};
