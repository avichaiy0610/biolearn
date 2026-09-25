/* Per-topic study guide: learning goals, "what matters for the exam", and
   textbook references. Written and checked against the textbooks below;
   chapter numbers/titles verified against the publishers' tables of contents:
   Campbell Biology 12e (Pearson), Alberts MBoC 7e (Norton, 2022),
   Lehninger Principles of Biochemistry 8e (Macmillan). */

export type BookRef = {
  book: "Campbell" | "Alberts" | "Lehninger";
  chapters: { n: number; title: string }[];
};

export type TopicGuide = {
  goalsHe: string[];
  examHe: string[];
  refs: BookRef[];
};

export const BOOKS = {
  Campbell: { title: "Campbell Biology", edition: "12th ed.", authors: "Urry, Cain, Wasserman, Minorsky, Orr" },
  Alberts: { title: "Molecular Biology of the Cell", edition: "7th ed.", authors: "Alberts et al." },
  Lehninger: { title: "Lehninger Principles of Biochemistry", edition: "8th ed.", authors: "Nelson, Cox, Hoskins" },
} as const;

export const TOPIC_GUIDES: Record<string, TopicGuide> = {
  "cell-biology": {
    goalsHe: [
      "לתאר את מבנה התא האאוקריוטי ולהבחין בין אברונים עם ממברנה כפולה, עם ממברנה יחידה ומבנים ללא ממברנה",
      "להסביר תעבורה דרך הקרום: דיפוזיה, דיפוזיה מזורזת, הובלה פעילה ראשונית ומשנית, אנדוציטוזה ואקסוציטוזה",
      "לתאר את שלבי מחזור התא והמיטוזה, ולהסביר כיצד ציקלינים, CDK ונקודות הבקרה מווסתים את המעבר ביניהם",
      "להסביר את מסלולי פירוק החלבונים — מערכת האוביקוויטין-פרוטאזום מול הליזוזום והאוטופגיה",
      "לתאר את מרכיבי שלד התא ואת תפקידיהם בצורת התא, בתנועה ובחלוקה",
      "להסביר את עקרונות האפופטוזיס ואת ההבדל בינו לבין נמק",
    ],
    examHe: [
      "סדר שלבי המיטוזה ומה בדיוק קורה בכל אחד — במיוחד פרומטאפאזה (פירוק מעטפת הגרעין, חיבור לקינטוכורים) ואנאפאזה (ספראז מפרק קוהזין)",
      "איזה קומפלקס ציקלין–CDK פועל בכל שלב, ומה תפקידי Rb/E2F, p53/p21 ו-APC/C",
      "G0 הוא יציאה מ-G1, לא שלב שבא לפניו",
      "ההבדל בין הובלה פעילה ראשונית (משאבת Na⁺/K⁺ — שימוש ישיר ב-ATP) למשנית (שימוש במפל ריכוזים)",
      "מסלול חלבון מופרש: ריבוזום צמוד ל-RER ← גולג'י ← שלפוחית ← אקסוציטוזה",
      "E1/E2/E3 ושרשרת K48 מסמנים לפירוק בפרוטאזום; הליזוזום מפרק גם אברונים שלמים (אוטופגיה)",
    ],
    refs: [
      { book: "Campbell", chapters: [{ n: 6, title: "A Tour of the Cell" }, { n: 7, title: "Membrane Structure and Function" }, { n: 11, title: "Cell Communication" }, { n: 12, title: "The Cell Cycle" }] },
      { book: "Alberts", chapters: [{ n: 10, title: "Membrane Structure" }, { n: 11, title: "Small-Molecule Transport and Electrical Properties of Membranes" }, { n: 12, title: "Intracellular Organization and Protein Sorting" }, { n: 13, title: "Intracellular Membrane Traffic" }, { n: 16, title: "The Cytoskeleton" }, { n: 17, title: "The Cell Cycle" }, { n: 18, title: "Cell Death" }] },
    ],
  },

  "molecular-biology": {
    goalsHe: [
      "לתאר את מבנה ה-DNA: גדילים אנטי-מקבילים, זיווג בסיסים ושלד סוכר-פוספט",
      "להסביר את שכפול ה-DNA: הליקאז, פריימאז, פולימראזות, גדיל מוביל ומפגר, מקטעי אוקזאקי וליגאז",
      "להסביר את השעתוק ועיבוד ה-RNA (כיפוי, זנב פולי-A, שחבור) באאוקריוטים",
      "להסביר את התרגום: קוד גנטי, tRNA, אתרי הריבוזום A/P/E, התחלה, הארכה וסיום",
      "להסביר עקרונות של בקרת ביטוי גנים",
      "להסביר את עקרון ה-PCR ואת תפקיד כל שלב בו",
    ],
    examHe: [
      "למה הגדיל המפגר מסונתז במקטעים: DNA פולימראז מאריך רק בכיוון 5'→3'",
      "תפקיד כל אנזים בשכפול — ובמיוחד פריימאז (פריימר RNA) וליגאז (סגירת חריצים)",
      "שכפול חצי-שמרני (ניסוי מזלסון-סטאל)",
      "התאמה בין קודון לאנטיקודון, ומה קורה בכל אחד מאתרי הריבוזום",
      "שלושת שלבי ה-PCR והטמפרטורות שלהם: דנטורציה בכ-95°C, הצמדת פריימרים בכ-55–65°C והארכה ב-72°C",
      "ההבדל בין מוטציה נקודתית שקטה, missense ו-nonsense",
    ],
    refs: [
      { book: "Campbell", chapters: [{ n: 16, title: "The Molecular Basis of Inheritance" }, { n: 17, title: "Gene Expression: From Gene to Protein" }, { n: 18, title: "Regulation of Gene Expression" }, { n: 20, title: "DNA Tools and Biotechnology" }] },
      { book: "Alberts", chapters: [{ n: 4, title: "DNA, Chromosomes, and Genomes" }, { n: 5, title: "DNA Replication, Repair, and Recombination" }, { n: 6, title: "How Cells Read the Genome: From DNA to Protein" }, { n: 7, title: "Control of Gene Expression" }] },
    ],
  },

  biochemistry: {
    goalsHe: [
      "לתאר את ארבע רמות המבנה של חלבונים ואת הכוחות שמייצבים כל רמה",
      "להסביר כיצד אנזימים מזרזים תגובות, ולפרש קינטיקה של מיכאליס-מנטן ועיכוב אנזימטי",
      "להסביר את תפקיד ה-ATP ואת מושג ה-ΔG בצימוד תגובות",
      "לתאר את הגליקוליזה, מחזור קרבס והזרחון החמצוני, ואת מאזן האנרגיה שלהם",
      "להסביר את מבנה הקרום הביולוגי ואת תכונות הליפידים",
      "להסביר עקרונות של בקרה מטבולית (אלוסטרית, הורמונלית, בקרה במשוב)",
    ],
    examHe: [
      "Km ו-Vmax: מה משתנה בעיכוב תחרותי (Km עולה, Vmax קבוע) ובעיכוב לא-תחרותי (Vmax יורד)",
      "אנזים לא משנה את ΔG של התגובה — רק מוריד את אנרגיית השפעול",
      "איפה מתרחש כל שלב בנשימה התאית ומה מייצר כל אחד (ATP, NADH, FADH₂)",
      "PFK-1 כנקודת הבקרה המרכזית של הגליקוליזה",
      "מנגנון הכימיאוסמוזה: מפל H⁺ על פני הממברנה הפנימית מניע את ATP סינתאז",
      "קשרי מימן, קשרים יוניים, אינטראקציות הידרופוביות וגשרי די-סולפיד — ובאיזו רמת מבנה כל אחד חשוב",
    ],
    refs: [
      { book: "Lehninger", chapters: [{ n: 3, title: "Amino Acids, Peptides, and Proteins" }, { n: 4, title: "The Three-Dimensional Structure of Proteins" }, { n: 6, title: "Enzymes" }, { n: 10, title: "Lipids" }, { n: 11, title: "Biological Membranes and Transport" }, { n: 13, title: "Introduction to Metabolism" }, { n: 14, title: "Glycolysis, Gluconeogenesis, and the Pentose Phosphate Pathway" }, { n: 16, title: "The Citric Acid Cycle" }, { n: 19, title: "Oxidative Phosphorylation" }] },
      { book: "Campbell", chapters: [{ n: 5, title: "The Structure and Function of Large Biological Molecules" }, { n: 8, title: "An Introduction to Metabolism" }, { n: 9, title: "Cellular Respiration and Fermentation" }] },
    ],
  },

  genetics: {
    goalsHe: [
      "לנסח את חוקי מנדל (הפרדה ומיון בלתי תלוי) ולקשר אותם להתנהגות הכרומוזומים במיוזה",
      "לפתור הכלאות מונו-היברידיות ודי-היברידיות ולחשב יחסי פנוטיפים וגנוטיפים",
      "להבחין בין דומיננטיות מלאה, חלקית וקו-דומיננטיות, ובין תורשה פוליגנית",
      "להסביר תורשה של גנים הקשורים למין, תאחיזה ושחלוף",
      "להסביר תורשה מיטוכונדריאלית והחתמה גנומית כחריגות מתורשה מנדלית",
      "לסווג סוגי מוטציות ואת השפעתן",
    ],
    examHe: [
      "יחסי 3:1, 1:2:1 ו-9:3:3:1 — ומתי הם לא מתקיימים (תאחיזה, אפיסטזיס, דומיננטיות חלקית)",
      "הכלאה מבחנית (test cross) לזיהוי גנוטיפ",
      "תכונה רצסיבית קשורה ל-X מופיעה בעיקר בזכרים ועוברת מאם נשאית",
      "תדירות רקומבינציה כמדד למרחק בין גנים: 1% רקומבינציה שקול למרחק של יחידת מפה אחת (1 cM)",
      "באיזה שלב של המיוזה נפרדים ההומולוגים (מיוזה I) ובאיזה הכרומטידות האחיות (מיוזה II)",
      "תורשה מיטוכונדריאלית עוברת מהאם בלבד",
    ],
    refs: [
      { book: "Campbell", chapters: [{ n: 13, title: "Meiosis and Sexual Life Cycles" }, { n: 14, title: "Mendel and the Gene Idea" }, { n: 15, title: "The Chromosomal Basis of Inheritance" }] },
    ],
  },

  microbiology: {
    goalsHe: [
      "לתאר את מבנה התא הפרוקריוטי: דופן, קרום, נוקלאואיד, פלסמידים, שוטונים ופילים",
      "להבחין בין חיידקים גרם-חיוביים לגרם-שליליים לפי מבנה הדופן",
      "לתאר את עקומת הגדילה של חיידקים ואת השלבים שלה",
      "לתאר את מבנה הנגיף ואת מחזורי החיים הליטי והליזוגני, ואת מחזור החיים של רטרו-וירוסים",
      "להסביר כיצד מערכת החיסון מזהה פתוגנים ומגיבה אליהם",
    ],
    examHe: [
      "דופן גרם-חיובית: שכבת פפטידוגליקן עבה; גרם-שלילית: שכבה דקה + ממברנה חיצונית עם LPS",
      "שלבי עקומת הגדילה: השהיה (lag), מעריכי (log), נייח (stationary) ומוות",
      "ליטי מול ליזוגני: פרופאג' משתלב בגנום המאכסן ומשוכפל איתו",
      "רטרו-וירוסים משתמשים ב-reverse transcriptase ליצירת DNA מ-RNA",
      "אנטיביוטיקות פועלות על מבנים שייחודיים לחיידקים (דופן, ריבוזום 70S)",
    ],
    refs: [
      { book: "Campbell", chapters: [{ n: 19, title: "Viruses" }, { n: 27, title: "Bacteria and Archaea" }, { n: 43, title: "The Immune System" }] },
      { book: "Alberts", chapters: [{ n: 23, title: "Pathogens and Infection" }] },
    ],
  },

  immunology: {
    goalsHe: [
      "להבחין בין חסינות מולדת לנרכשת מבחינת מהירות, ספציפיות וזיכרון",
      "לתאר את מרכיבי החסינות המולדת: מחסומים, פגוציטים, דלקת, משלים ו-TLRs",
      "להסביר את תפקידי לימפוציטים B ו-T ואת הצגת האנטיגן על MHC I ו-MHC II",
      "לתאר את מבנה הנוגדן ואת תפקידיו",
      "להסביר את עקרון הזיכרון החיסוני והחיסונים",
    ],
    examHe: [
      "MHC I מציג פפטידים פנימיים לתאי T ציטוטוקסיים (CD8⁺); MHC II מציג אנטיגנים חיצוניים לתאי T עוזרים (CD4⁺)",
      "מבנה הנוגדן: שתי שרשראות כבדות ושתיים קלות; האזור המשתנה קושר את האנטיגן",
      "תגובה ראשונית מול משנית — למה המשנית מהירה וחזקה יותר",
      "ברירה שבטית (clonal selection)",
      "חיסון פסיבי (נוגדנים מוכנים) מול פעיל (חיסון שמשרה זיכרון)",
    ],
    refs: [
      { book: "Campbell", chapters: [{ n: 43, title: "The Immune System" }] },
      { book: "Alberts", chapters: [{ n: 24, title: "The Innate and Adaptive Immune Systems" }] },
    ],
  },

  physiology: {
    goalsHe: [
      "להסביר את מקור פוטנציאל המנוחה ואת תפקיד תעלות היונים ומשאבת Na⁺/K⁺",
      "לתאר את שלבי פוטנציאל הפעולה ואת התקדמותו לאורך האקסון, כולל הולכה קופצנית",
      "להסביר העברה סינפטית כימית",
      "לתאר את מבנה הלב ואת מחזור הדם הכפול",
      "להסביר את מחזור הלב ואת מערכת ההולכה החשמלית של הלב",
    ],
    examHe: [
      "דה-פולריזציה: פתיחת תעלות Na⁺ תלויות מתח; רה-פולריזציה: סגירתן ופתיחת תעלות K⁺",
      "התקופה הרפרקטורית ולמה פוטנציאל הפעולה מתקדם בכיוון אחד",
      "מיאלין ונקודות רנוויה מאיצים את ההולכה",
      "בסינפסה: כניסת Ca²⁺ לקצה העצב מובילה לשחרור הנוירוטרנסמיטר",
      "מסלול הדם: עלייה ימנית ← חדר ימני ← ריאות ← עלייה שמאלית ← חדר שמאלי ← אבי העורקים",
      "הקוצב הטבעי (SA node) והעיכוב בצומת AV",
    ],
    refs: [
      { book: "Campbell", chapters: [{ n: 42, title: "Circulation and Gas Exchange" }, { n: 48, title: "Neurons, Synapses, and Signaling" }] },
      { book: "Alberts", chapters: [{ n: 11, title: "Small-Molecule Transport and Electrical Properties of Membranes" }] },
    ],
  },
};
