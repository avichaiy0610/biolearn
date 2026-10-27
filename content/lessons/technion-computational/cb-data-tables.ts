import type { Lesson } from "../types";

// Technion 134141 — portal: "ניתוח רשימות נתונים". Scope (Codex 2026-10-26): moved early so later sequence, image and
// tracking exercises reuse it — CSV loading, missing values, filtering, grouping, joining by biological identifiers,
// plotting and interpretation; sorting/binary search only as compact algorithm examples (binary search needs sorted
// input). Descriptive statistics themselves are refreshers (bi-stats-exploration). Code checked with pandas 2.x.
export const cbDataTables: Lesson = {
  slug: "cb-data-tables",
  status: "draft",
  topic: "bioinformatics",
  course: { slug: "technion-computational", nameHe: "ביולוגיה חישובית" },
  titleHe: "ניתוח רשימות וטבלאות נתונים",
  leadHe:
    "רוב העבודה החישובית בביולוגיה מתחילה בטבלה: ערכי ביטוי של גנים, מדידות של תאים, מהירויות של תולעים בכל שעה. היחידה מלמדת לעבוד עם טבלה בפייתון בעזרת הספרייה pandas — לקרוא, לנקות ערכים חסרים, לסנן, לקבץ, לחבר שתי טבלאות לפי שם גן, ולצייר — ומראה שני אלגוריתמים בסיסיים מאחורי הקלעים: מיון וחיפוש בינארי.",
  minutes: 50,
  objectivesHe: [
    "לקרוא טבלה מקובץ CSV ולבדוק שהיא נקראה נכון",
    "לזהות ערכים חסרים ולהחליט איך לטפל בהם",
    "לסנן שורות, לחשב עמודות חדשות ולקבץ לפי קטגוריה",
    "לחבר שתי טבלאות לפי מזהה ביולוגי משותף",
    "לצייר היסטוגרמה ולפרש אותה",
    "להסביר מיון וחיפוש בינארי ומתי חיפוש בינארי אפשרי",
  ],
  bodyHe: `
## טבלה ב-pandas {#dataframe}

[[figure:cb-dataframe]]

**DataFrame** — טבלה: כל **שורה** היא תצפית (גן, תא, תולעת), כל **עמודה** היא משתנה (שם, ביטוי, טיפול).

\`\`\`python
import pandas as pd

# in practice: df = pd.read_csv("expression.csv")
df = pd.DataFrame({
    "gene":      ["lacZ", "lacY", "araC", "recA", "dnaK"],
    "control":   [10.0, 8.0, 5.0, 20.0, None],   # None = missing value
    "treatment": [40.0, 30.0, 5.5, 19.0, 33.0],
})
print(df.head())          # first rows
print(df.shape)           # (5, 3): rows, columns
print(df.dtypes)          # type of each column
\`\`\`

**תמיד בודקים מיד אחרי הקריאה:** מספר שורות ועמודות, סוגי העמודות (מספר שנקרא כטקסט = בעיה), שמות העמודות.

## ערכים חסרים {#missing}

בנתונים אמיתיים יש **חורים** — מדידה שנכשלה, תא שלא זוהה.

\`\`\`python
print(df.isna().sum())            # how many missing per column
clean = df.dropna()               # drop rows with any missing value
print(len(df), "->", len(clean))  # 5 -> 4
\`\`\`

**להחליט, לא להתעלם:**
- **להוריד** שורות — פשוט, אבל אם החוסר **לא אקראי** (למשל דווקא הגנים שהתבטאו חלש לא נמדדו) — התוצאה מוטה.
- **למלא** (בממוצע, באפס) — מסוכן: אפס הוא ערך, לא "לא יודע".
- **לדווח** תמיד כמה הוסרו ולמה.

## סינון, עמודות חדשות וקיבוץ {#filter-group}

\`\`\`python
clean = df.dropna().copy()
clean["ratio"] = clean["treatment"] / clean["control"]     # new column
up = clean[clean["ratio"] > 2]                             # filter rows
print(up[["gene", "ratio"]])                               # lacZ 4.0, lacY 3.75
\`\`\`

**קיבוץ** — לחשב סיכום **לכל קבוצה**:

\`\`\`python
cells = pd.DataFrame({
    "strain": ["WT", "WT", "WT", "mut", "mut", "mut"],
    "length": [2.1, 1.9, 2.0, 3.2, 2.9, 3.1],   # cell length (um)
})
print(cells.groupby("strain")["length"].agg(["mean", "std", "count"]))
\`\`\`

(מה **אומרים** הממוצע וסטיית התקן ואיך משווים קבוצות — ביחידות הסטטיסטיקה; כאן מתרגלים את הפעולה.)

## חיבור טבלאות לפי מזהה {#join}

**בעיה נפוצה:** טבלת ביטוי עם **שמות גנים**, וטבלה נפרדת של **תפקודים** — צריך לחבר.

\`\`\`python
annot = pd.DataFrame({
    "gene":     ["lacZ", "lacY", "recA", "ompF"],
    "function": ["beta-galactosidase", "lactose permease",
                 "DNA repair", "porin"],
})
merged = clean.merge(annot, on="gene", how="left")   # keep all expression rows
print(merged[["gene", "ratio", "function"]])
\`\`\`

**מלכודות בחיבור:**
- **מזהים שונים** לאותו גן (שם, מספר מאגר, כינוי) — חיבור נכשל בשקט. עדיף מזהה יציב (מספר מאגר).
- **רישיות ורווחים** ("LacZ" ≠ "lacZ ").
- **שורות כפולות** — אם גן מופיע פעמיים בטבלה השנייה, הוא יוכפל בתוצאה.
- \`how="left"\` שומר גם שורות **בלי** התאמה (עם ערך חסר) — כדאי לבדוק כמה כאלה יש.

## לצייר ולפרש {#plot}

[[figure:cb-histogram]]

\`\`\`python
import matplotlib
matplotlib.use("Agg")              # draw without a window
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
lengths = rng.normal(2.0, 0.2, 500)          # simulated cell lengths
plt.hist(lengths, bins=30)
plt.xlabel("cell length (um)")
plt.ylabel("number of cells")
plt.savefig("lengths.png")
\`\`\`

**מה מחפשים בהיסטוגרמה:** מרכז, פיזור, **שני שיאים** (אולי שתי אוכלוסיות — למשל תאים לפני ואחרי חלוקה), ערכים חריגים, ו**קצוות חתוכים** (אולי המכשיר לא מודד מעל ערך מסוים).

## מאחורי הקלעים: מיון וחיפוש בינארי {#sort-search}

[[figure:cb-binary-search]]

**חיפוש ליניארי** — בודקים כל איבר: **O(n)**.

**חיפוש בינארי** — רק ברשימה **ממוינת**: משווים לאיבר האמצעי, וזורקים חצי בכל צעד ← **O(log n)**. מיליון איברים ← כ-**20** השוואות.

\`\`\`python
def binary_search(sorted_list, target):
    lo, hi = 0, len(sorted_list) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if sorted_list[mid] == target:
            return mid
        if sorted_list[mid] < target:
            lo = mid + 1          # target is in the right half
        else:
            hi = mid - 1          # target is in the left half
    return -1                     # not found

positions = sorted([5400, 120, 98000, 3300, 47000])   # gene start positions
print(binary_search(positions, 47000))                 # 3 — index in the sorted list
\`\`\`

**מיון** עצמו עולה **O(n log n)** — כדאי רק אם מחפשים **הרבה פעמים** באותה רשימה. לחיפוש אחד — סריקה ליניארית זולה יותר.
`,
  experiment: {
    titleHe: "איך אנחנו יודעים: ביואינפורמטיקה פורנזית (בגרלי וקומבס, 2009)",
    bodyHe: `**הרקע:** ב-2006–2007 פורסמו מאמרים שטענו שאפשר לנבא, מתוך פרופיל ביטוי גנים של גידול, לאיזו כימותרפיה המטופל יגיב. על בסיסם התחילו ניסויים קליניים.

**מה עשו:** קית' בגרלי וקווין קומבס, סטטיסטיקאים במרכז MD אנדרסון, ניסו **לשחזר** את התוצאות מהנתונים שפורסמו — ונכשלו. הם עברו על הטבלאות **שורה אחרי שורה**, בקוד, ופרסמו את כל הניתוח כך שכל אחד יכול להריץ אותו.

**מה מצאו:**
- **הזזה של שורה אחת** (off-by-one) בין רשימת הגנים לבין טבלת הערכים — כל גן קיבל את הערך של השכן שלו.
- **תוויות הפוכות** — דגימות "רגישות" ו"עמידות" שהוחלפו.
- גנים שהופיעו **פעמיים**, ודגימות שחזרו בשני קבוצות.

**ההמשך:** הניסויים הקליניים הופסקו, ומאמרים רבים הוסרו. המקרה הוביל לדרישות של שקיפות ושחזור בניתוח נתונים גנומיים.

**הלקח לקורס:** טעויות של **טבלה** — הזזת שורות, חיבור לפי סדר במקום לפי מזהה, תוויות הפוכות — יכולות להפוך תוצאה ביולוגית לגמרי. לכן: מחברים לפי **מזהה**, בודקים מספרי שורות אחרי כל צעד, ושומרים את כל הניתוח **בקוד**.`,
  },
  trapsHe: [
    "לא לבדוק את הטבלה אחרי הקריאה — עמודה מספרית שנקראה כטקסט תשבש כל חישוב.",
    "למלא ערכים חסרים באפס — אפס הוא מדידה, לא \"לא ידוע\".",
    "להוריד שורות עם ערכים חסרים בלי לשאול אם החוסר אקראי.",
    "לחבר טבלאות לפי שמות לא עקביים — חלק מהשורות נעלמות בשקט.",
    "להשתמש בחיפוש בינארי על רשימה לא ממוינת — התוצאה שגויה.",
    "למיין רק כדי לחפש פעם אחת — סריקה ליניארית זולה יותר.",
  ],
  terms: [
    { he: "טבלת נתונים (DataFrame)", en: "DataFrame" },
    { he: "קובץ CSV", en: "Comma-separated values (CSV)" },
    { he: "ערך חסר", en: "Missing value (NaN)" },
    { he: "סינון", en: "Filtering" },
    { he: "קיבוץ", en: "Grouping (groupby)" },
    { he: "חיבור טבלאות", en: "Join / merge" },
    { he: "מזהה יציב", en: "Stable identifier" },
    { he: "היסטוגרמה", en: "Histogram" },
    { he: "חיפוש בינארי", en: "Binary search" },
    { he: "מיון", en: "Sorting" },
  ],
  workedProblems: [
    {
      id: "pipeline",
      titleHe: "מצינור נתונים לתשובה",
      problemHe: `לטבלה \`worms\` עמודות: \`worm_id\`, \`genotype\` ("WT" או "mutant"), \`hour\`, \`speed\` (מיקרומטר לשנייה; לחלק מהשעות חסר). כתבו קוד שמחשב לכל גנוטיפ את המהירות הממוצעת, אחרי הורדת שעות עם ערך חסר, והדפיסו גם כמה שורות הוסרו בכל גנוטיפ. למה חשוב לדווח על ההסרה?`,
      solutionHe: `\`\`\`python
import pandas as pd

worms = pd.DataFrame({
    "worm_id":  [1, 1, 2, 2, 3, 3],
    "genotype": ["WT", "WT", "WT", "WT", "mutant", "mutant"],
    "hour":     [1, 2, 1, 2, 1, 2],
    "speed":    [120.0, 110.0, None, 130.0, 60.0, None],
})
removed = worms["speed"].isna().groupby(worms["genotype"]).sum()
clean = worms.dropna(subset=["speed"])
print(clean.groupby("genotype")["speed"].mean())   # WT 120.0, mutant 60.0
print(removed)                                     # WT 1, mutant 1
\`\`\`

**שימו לב לשקלול:** הממוצע כאן הוא על פני **השעות** שנשארו, ולכן תולעת עם יותר שעות תקינות מקבלת משקל גדול יותר. אם השאלה היא "מה המהירות של תולעת טיפוסית בכל גנוטיפ", מסכמים קודם לכל תולעת ואחר כך בין תולעים: ב-WT הממוצעים הם 115 ו-130 ← **122.5** µm/s (לא 120).

**למה לדווח:** אם בגנוטיפ אחד חסרות הרבה יותר שעות (למשל המוטנט לא זז והמעקב "איבד" אותו), הממוצע מוטה — ודווקא החסר מספר משהו ביולוגי. וגם: כל תולעת תורמת כמה שעות — הן **לא** תצפיות בלתי תלויות (ביחידות של מעקב).`,
      answerHe: "dropna ואז groupby ממוצע; לדווח כי חוסר לא-אקראי מטה את התוצאה.",
    },
    {
      id: "binary-steps",
      titleHe: "כמה צעדים בחיפוש בינארי",
      problemHe: `(א) ברשימה ממוינת של 1,000,000 מיקומי גנים — בכמה השוואות לכל היותר נמצא מיקום בחיפוש בינארי?
(ב) ובחיפוש ליניארי?
(ג) צריך לבדוק 10 מיקומים בלבד ברשימה לא ממוינת. האם כדאי למיין קודם (עלות בערך n·log₂n)?`,
      solutionHe: `**(א)** \`log₂(10⁶) ≈ 20\` ← כ-**20** השוואות.

**(ב)** עד **1,000,000**.

**(ג)** מיון: \`10⁶ × 20 = 2 × 10⁷\` פעולות. 10 חיפושים ליניאריים: \`10 × 10⁶ = 10⁷\`. ← **לא כדאי** — סריקה זולה יותר. מיון משתלם כשמחפשים **הרבה** פעמים.`,
      answerHe: "(א) כ-20; (ב) עד מיליון; (ג) לא — 10 סריקות זולות מהמיון.",
    },
  ],
  questions: [
    {
      id: "dt-1", difficulty: "easy",
      question: "מה צריך לבדוק מיד אחרי קריאת טבלה מקובץ?",
      options: [
        { text: "מספר שורות ועמודות, שמות העמודות והסוגים שלהן", why: "נכון." },
        { text: "רק את השורה האחרונה", why: "לא מספיק." },
        { text: "שום דבר — הקריאה תמיד נכונה", why: "לא תמיד." },
        { text: "רק את הגודל של הקובץ בבתים", why: "לא מספיק." },
      ],
      correct: 0,
    },
    {
      id: "dt-2", difficulty: "easy",
      question: "מה עושה df.groupby(\"strain\")[\"length\"].mean()?",
      options: [
        { text: "מחשב את אורך התא הממוצע לכל זן בנפרד", why: "נכון." },
        { text: "ממיין את הטבלה לפי אורך", why: "לא." },
        { text: "מוחק זנים", why: "לא." },
        { text: "מחשב ממוצע אחד לכל הטבלה", why: "לכל קבוצה." },
      ],
      correct: 0,
    },
    {
      id: "dt-3", difficulty: "medium",
      question: "למה מסוכן למלא ערכים חסרים באפס?",
      options: [
        { text: "אפס הוא ערך מדוד; הוא מטה ממוצעים ויוצר תוצאות מלאכותיות", why: "נכון." },
        { text: "כי pandas לא מאפשר אפסים", why: "מאפשר." },
        { text: "כי זה מוחק את העמודה", why: "לא." },
        { text: "אין בזה סיכון", why: "יש." },
      ],
      correct: 0,
    },
    {
      id: "dt-4", difficulty: "medium",
      question: "חיברתם טבלת ביטוי לטבלת תפקודים לפי שם גן, ו-30% מהגנים לא קיבלו תפקוד. מה הדבר הראשון לבדוק?",
      options: [
        { text: "האם המזהים זהים בשתי הטבלאות — שמות ישנים/חדשים, רישיות, רווחים", why: "נכון." },
        { text: "שהמחשב תקין", why: "לא זה." },
        { text: "שאין עמודת ביטוי", why: "לא רלוונטי." },
        { text: "להוריד את השורות האלה ולהמשיך", why: "קודם להבין למה." },
      ],
      correct: 0,
    },
    {
      id: "dt-5", difficulty: "medium",
      question: "באיזה מצב אפשר להשתמש בחיפוש בינארי?",
      options: [
        { text: "כשהרשימה ממוינת", why: "נכון." },
        { text: "תמיד", why: "רק ברשימה ממוינת." },
        { text: "רק ברשימות קצרות", why: "דווקא מועיל בארוכות." },
        { text: "רק במחרוזות", why: "לא." },
      ],
      correct: 0,
    },
    {
      id: "dt-6", difficulty: "hard",
      question: "בהיסטוגרמה של אורכי תאים רואים שני שיאים. מה הפרשנות הסבירה הראשונה?",
      options: [
        { text: "ייתכן שיש שתי אוכלוסיות (למשל תאים לפני ואחרי חלוקה) — כדאי לבדוק", why: "נכון." },
        { text: "המדידה שגויה בהכרח", why: "לא בהכרח." },
        { text: "צריך להוריד את אחד השיאים", why: "לא." },
        { text: "זה לא אומר כלום", why: "זה רמז חשוב." },
      ],
      correct: 0,
    },
  ],
  refs: [
    { kind: "book", text: "McKinney W (2022) Python for Data Analysis, 3rd ed. O'Reilly — ch. 5, 7–10." },
    { kind: "paper", text: "Baggerly KA, Coombes KR (2009) Deriving chemosensitivity from cell lines: forensic bioinformatics and reproducible research in high-throughput biology. Ann Appl Stat 3:1309–1334." },
    { kind: "paper", text: "Wickham H (2014) Tidy data. J Stat Softw 59(10):1–23." },
    { kind: "paper", text: "Ziemann M, Eren Y, El-Osta A (2016) Gene name errors are widespread in the scientific literature. Genome Biol 17:177." },
  ],
  review: { writtenBy: "Claude", writtenAt: "2026-10-27" },
};
