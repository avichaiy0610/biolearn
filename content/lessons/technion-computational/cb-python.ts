import type { Lesson } from "../types";

// Technion 134141 — portal: "זהו לא קורס תכנות, אך נלמד כמה שיעורי בסיס בשפת התכנות הפופולרית פייתון". Scope (Codex
// 2026-10-26): Python early and scaffolded (the parallel computing course does not guarantee prior Python); essentials
// only — values, lists, dicts, loops, conditions, functions, reading a file; numpy appears just-in-time in later units.
// All code checked in Python 3.12.
export const cbPython: Lesson = {
  slug: "cb-python",
  status: "draft",
  topic: "bioinformatics",
  course: { slug: "technion-computational", nameHe: "ביולוגיה חישובית" },
  titleHe: "פייתון לביולוגים: הבסיס",
  leadHe:
    "הקורס אינו קורס תכנות — אבל כדי להפוך אלגוריתם לכלי שעובד, צריך מעט פייתון. היחידה מלמדת רק את מה שצריך כדי לקרוא את הקוד בקורס ולשנות אותו: ערכים ומשתנים, רשימות ומילונים, לולאות ותנאים, פונקציות, וקריאה של קובץ. כל דוגמה כאן היא שאלה ביולוגית קטנה.",
  minutes: 50,
  objectivesHe: [
    "להשתמש במשתנים, מספרים ומחרוזות",
    "לעבוד עם רשימות ומילונים ולבחור ביניהם",
    "לכתוב לולאת for ותנאי if",
    "לכתוב פונקציה פשוטה ולבדוק אותה",
    "לקרוא קובץ טקסט שורה אחרי שורה",
  ],
  bodyHe: `
## ערכים ומשתנים {#values}

**משתנה** — שם שמצביע על ערך. פייתון מנחש את הסוג לבד.

\`\`\`python
gene = "lacZ"          # string (text)
length_bp = 3075       # integer
gc_fraction = 0.52     # float (decimal number)
is_essential = False   # boolean (True / False)

print(gene, length_bp * 3, round(gc_fraction * 100), "%")
\`\`\`

**מחרוזות** — אפשר לחתוך (\`seq[0:3]\` — שלוש האותיות הראשונות, אינדקס מתחיל ב-**0**, והקצה הימני **לא** כלול), לחבר (\`+\`), למדוד (\`len\`), להפוך לאותיות גדולות (\`.upper()\`).

\`\`\`python
seq = "atggcgtaa"
seq = seq.upper()        # "ATGGCGTAA"
print(len(seq))          # 9
print(seq[0:3])          # "ATG" — first codon
print(seq[-3:])          # "TAA" — last codon
\`\`\`

## רשימות ומילונים {#collections}

[[figure:cb-list-vs-dict]]

**רשימה** — סדרה **מסודרת**; ניגשים לפי **מיקום**.

\`\`\`python
expression = [12.1, 8.4, 15.0, 9.9]   # one value per sample
expression.append(11.2)              # add a value at the end
print(expression[0], len(expression), max(expression))
\`\`\`

**מילון** — זוגות **מפתח ← ערך**; ניגשים לפי **שם**. מתאים ל"טבלת תרגום".

\`\`\`python
codon_to_aa = {"ATG": "M", "GCG": "A", "TAA": "*"}
print(codon_to_aa["GCG"])            # "A"
codon_to_aa["TGG"] = "W"             # add a new entry
print("TTT" in codon_to_aa)          # False — key not present
\`\`\`

**מתי מה?** רשימה — כשהסדר חשוב (מדידות לאורך זמן, רצף של צעדים). מילון — כשרוצים **לחפש לפי שם** (קודון ← חומצת אמינו, גן ← ערך ביטוי). חיפוש במילון **מהיר** גם כשיש מיליון מפתחות.

## לולאות ותנאים {#loops}

**לולאת for** — חוזרת על פעולה לכל איבר:

\`\`\`python
seq = "ATGGCGTAA"
count_g = 0
for base in seq:          # go over the letters one by one
    if base == "G":       # condition
        count_g += 1      # add 1
print(count_g)            # 3
\`\`\`

**range** — לולאה על מיקומים (למשל קודונים):

\`\`\`python
seq = "ATGGCGTAA"
for i in range(0, len(seq), 3):      # 0, 3, 6
    print(i, seq[i:i + 3])           # position and codon
\`\`\`

**הזחה (רווחים בתחילת השורה)** קובעת מה בתוך הלולאה ומה בתוך התנאי — בפייתון זה **חלק מהתחביר**, לא קישוט.

## פונקציות {#functions}

**פונקציה** — מאגדת צעדים תחת שם, עם **קלט** (פרמטרים) ו**פלט** (\`return\`). כך כותבים פעם אחת ומשתמשים הרבה.

\`\`\`python
def gc_content(seq):
    """Return the fraction of G and C in a DNA sequence."""
    seq = seq.upper()
    if len(seq) == 0:
        return 0.0                      # edge case: empty sequence
    gc = seq.count("G") + seq.count("C")
    return gc / len(seq)

print(gc_content("ATGGCGTAA"))          # 0.444...
assert gc_content("GGCC") == 1.0         # quick self-test
\`\`\`

**הרגל טוב:** אחרי שכותבים פונקציה — **בודקים** אותה על קלט שהתשובה שלו ידועה (\`assert\` עוצר את התוכנית אם הבדיקה נכשלת).

## לקרוא קובץ {#files}

נתונים ביולוגיים מגיעים בקבצים. הדרך הבסיסית — לקרוא שורה אחרי שורה:

\`\`\`python
# file "genes.txt": one line per gene, name and length separated by a tab
lengths = {}
with open("genes.txt") as f:          # the file closes automatically
    for line in f:
        name, length = line.strip().split("\\t")
        lengths[name] = int(length)    # text -> integer
print(len(lengths), "genes read")
\`\`\`

**טעויות נפוצות:** שכחה ש**הכול נקרא כטקסט** (צריך \`int\` או \`float\`), תו סוף שורה (\`.strip()\`), ושורת כותרת בתחילת הקובץ. (ביחידה הבאה — טבלאות שלמות בעזרת ספרייה מוכנה.)
`,
  experiment: {
    titleHe: "איך אנחנו יודעים: למה ביולוגים צריכים קוד — הבעיה של אקסל (זימן ועמיתים, 2016)",
    bodyHe: `**השאלה:** כמה פעמים נתונים ביולוגיים "מתקלקלים" בגלל עבודה ידנית בגיליון אלקטרוני?

**מה עשו:** מארק זימן, יותם ארן ואסאם אל-אוסטה בדקו קבצי נתונים משלימים של כ-**3,600** מאמרים בכתבי עת גנומיים מובילים (2005–2015), וחיפשו שמות גנים ש**אקסל הפך אוטומטית** לתאריכים או למספרים — למשל **SEPT2** (ספטין 2) שהופך ל-"2-Sep", ו-**MARCH1** ל-"1-Mar".

**מה מצאו:**
- כ-**20%** מהמאמרים שהיו בהם רשימות גנים בקבצי אקסל — כללו שגיאות כאלה.
- מספר הקבצים המשלימים עם שגיאות **גדל** עם השנים (כ-15% בשנה בחמש השנים האחרונות שנבדקו).

**ההמשך:** ב-2020 ועדת השמות של גנים אנושיים (HGNC) **שינתה את שמות הגנים** (SEPT2 ← SEPTIN2, MARCH1 ← MARCHF1) — בין השאר כדי למנוע את הבעיה.

**הלקח לקורס:** עבודה **בקוד** מאפשרת להגדיר במפורש איך הנתונים נקראים, לבדוק מזהים וטיפוסים ולתעד כל שינוי — כך מפחיתים שגיאות ואפשר לשחזר את הניתוח. אבל קוד לא מתקן נתונים שכבר שובשו, וגם אותו צריך לבדוק.`,
  },
  trapsHe: [
    "לשכוח שאינדקס מתחיל ב-0 — האות הראשונה היא seq[0].",
    "לשכוח שבחיתוך seq[a:b] הקצה b לא כלול.",
    "לשכוח שהכול נקרא מקובץ כטקסט — \"3075\" אינו המספר 3075 עד שממירים.",
    "להשתמש ברשימה כשצריך חיפוש לפי שם — מילון מהיר ונוח יותר.",
    "לשבש הזחה — בפייתון היא קובעת מה בתוך הלולאה.",
    "לא לבדוק פונקציה על דוגמה ידועה לפני שמשתמשים בה.",
  ],
  terms: [
    { he: "משתנה", en: "Variable" },
    { he: "מחרוזת / מספר שלם / מספר עשרוני", en: "String / int / float" },
    { he: "רשימה", en: "List" },
    { he: "מילון", en: "Dictionary (dict)" },
    { he: "לולאה / תנאי", en: "Loop (for) / condition (if)" },
    { he: "הזחה", en: "Indentation" },
    { he: "פונקציה / פרמטר / ערך מוחזר", en: "Function / parameter / return value" },
    { he: "חיתוך", en: "Slicing" },
    { he: "בדיקה עצמית", en: "Assertion (assert)" },
  ],
  workedProblems: [
    {
      id: "reverse-complement",
      titleHe: "גדיל משלים הפוך",
      problemHe: `כתבו פונקציה \`reverse_complement(seq)\` שמחזירה את הגדיל המשלים ההפוך של רצף DNA (A↔T, C↔G, ובסדר הפוך). בדקו אותה על "ATGC" (צפוי: "GCAT") ועל "AAACCC".`,
      solutionHe: `**רעיון:** מילון להחלפת כל בסיס, ואז היפוך הסדר.

\`\`\`python
def reverse_complement(seq):
    pair = {"A": "T", "T": "A", "C": "G", "G": "C"}
    out = []
    for base in reversed(seq.upper()):   # walk from the end
        out.append(pair[base])             # collect the paired bases
    return "".join(out)                    # join once at the end

assert reverse_complement("ATGC") == "GCAT"
print(reverse_complement("AAACCC"))      # "GGGTTT"
\`\`\`

**למה זה חשוב:** גן יכול להיות על כל אחד משני הגדילים; כדי לחפש אותו בשני הכיוונים — מחפשים גם ברצף וגם במשלים ההפוך שלו.`,
      answerHe: "פונקציה עם מילון זוגות ולולאה מהסוף; \"AAACCC\" ← \"GGGTTT\".",
    },
    {
      id: "count-dict",
      titleHe: "לספור בסיסים במילון",
      problemHe: `כתבו קוד שסופר כמה פעמים מופיע כל בסיס ברצף "GATTACAGATTACA" ושומר את התוצאה במילון. מה התוצאה? איך תחשבו את אחוז ה-GC מהמילון?`,
      solutionHe: `\`\`\`python
seq = "GATTACAGATTACA"
counts = {}
for base in seq:
    counts[base] = counts.get(base, 0) + 1   # 0 if the key is new
print(counts)        # {'G': 2, 'A': 6, 'T': 4, 'C': 2}

gc = (counts.get("G", 0) + counts.get("C", 0)) / len(seq)
print(round(gc, 3))  # 0.286
\`\`\`

**הטריק:** \`counts.get(base, 0)\` מחזיר 0 אם המפתח עוד לא קיים — כך לא צריך תנאי נפרד לפעם הראשונה. (4 מתוך 14 ← 0.286.)`,
      answerHe: "{G: 2, A: 6, T: 4, C: 2}; GC = 4/14 ≈ 0.286.",
    },
  ],
  questions: [
    {
      id: "py-1", difficulty: "easy",
      question: "מה יודפס: seq = \"ATGCA\"; print(seq[1:3])?",
      options: [
        { text: "TG", why: "נכון — מיקומים 1 ו-2; 3 לא כלול." },
        { text: "ATG", why: "זה seq[0:3]." },
        { text: "TGC", why: "זה seq[1:4]." },
        { text: "AT", why: "זה seq[0:2]." },
      ],
      correct: 0,
    },
    {
      id: "py-2", difficulty: "easy",
      question: "איזה מבנה מתאים לתרגום קודון לחומצת אמינו?",
      options: [
        { text: "מילון — קודון כמפתח וחומצת אמינו כערך", why: "נכון." },
        { text: "מספר אחד", why: "לא." },
        { text: "רשימה של מספרים", why: "לא נוח לחיפוש לפי שם." },
        { text: "ערך בוליאני", why: "לא." },
      ],
      correct: 0,
    },
    {
      id: "py-3", difficulty: "medium",
      question: "קראתם מקובץ את השורה \"lacZ\\t3075\". מה הסוג של \"3075\" אחרי split?",
      options: [
        { text: "מחרוזת — צריך להמיר עם int()", why: "נכון." },
        { text: "מספר שלם", why: "הכול נקרא כטקסט." },
        { text: "מספר עשרוני", why: "לא." },
        { text: "רשימה", why: "split מחזיר רשימה של מחרוזות; האיבר עצמו מחרוזת." },
      ],
      correct: 0,
    },
    {
      id: "py-4", difficulty: "medium",
      question: "מה עושה counts.get(base, 0)?",
      options: [
        { text: "מחזיר את הערך של base במילון, או 0 אם המפתח לא קיים", why: "נכון." },
        { text: "מוחק את המפתח base", why: "לא." },
        { text: "תמיד מחזיר 0", why: "רק אם המפתח חסר." },
        { text: "מוסיף 1 למונה", why: "זה מה שעושים אחר כך." },
      ],
      correct: 0,
    },
    {
      id: "py-5", difficulty: "medium",
      question: "למה כדאי להוסיף assert אחרי כתיבת פונקציה?",
      options: [
        { text: "כדי לבדוק אוטומטית שהיא מחזירה את התוצאה הנכונה על דוגמה ידועה", why: "נכון." },
        { text: "כדי להאיץ את הפונקציה", why: "לא." },
        { text: "כדי לשמור את הפונקציה בקובץ", why: "לא." },
        { text: "כדי להדפיס את התוצאה", why: "לא." },
      ],
      correct: 0,
    },
    {
      id: "py-6", difficulty: "hard",
      question: "for i in range(0, len(seq), 3): print(seq[i:i+3]) — מה זה מדפיס עבור seq = \"ATGGCGTA\"?",
      options: [
        { text: "ATG, GCG, TA", why: "נכון — הקודון האחרון חלקי, כי האורך 8 אינו מתחלק ב-3." },
        { text: "ATG, GCG", why: "גם החלק האחרון מודפס." },
        { text: "ATG, TGG, GGC, ...", why: "זה בצעדים של 1." },
        { text: "שגיאה", why: "חיתוך מעבר לסוף אינו שגיאה בפייתון." },
      ],
      correct: 0,
    },
  ],
  refs: [
    { kind: "book", text: "Downey AB (2015) Think Python, 2nd ed. O'Reilly (free online)." },
    { kind: "paper", text: "Ziemann M, Eren Y, El-Osta A (2016) Gene name errors are widespread in the scientific literature. Genome Biol 17:177." },
    { kind: "paper", text: "Bruford EA et al. (2020) Guidelines for human gene nomenclature. Nat Genet 52:754–758." },
  ],
  review: { writtenBy: "Claude", writtenAt: "2026-10-27" },
};
