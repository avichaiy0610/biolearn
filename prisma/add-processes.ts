// One-time script to add Translation and Cellular Respiration processes
import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client";

const authToken = process.env.DATABASE_AUTH_TOKEN;
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  ...(authToken ? { authToken } : {}),
});
const prisma = new PrismaClient({ adapter });

const translationSteps = [
  {
    order: 1,
    titleHe: "קשירת mRNA לריבוזום",
    titleEn: "mRNA Binds to Ribosome",
    descHe: "ה-mRNA הבוגר מגיע מהגרעין לציטופלזמה. תת-היחידה הקטנה של הריבוזום (40S באאוקריוטים) נקשרת לקצה 5' של ה-mRNA ומחפשת את קודון הפתיחה AUG.",
    descEn: "Mature mRNA from the nucleus binds to the small ribosomal subunit (40S in eukaryotes) which scans from the 5' end to find the start codon AUG (methionine).",
    svgData: JSON.stringify({
      elements: [
        { id: "mrna", type: "rect", x: 30, y: 145, width: 340, height: 12, color: "#ec4899" },
        { id: "mrnal", type: "text", x: 200, y: 172, label: "mRNA 5'→3'", textColor: "#ec4899", fontSize: 10 },
        { id: "aug", type: "rect", x: 80, y: 138, width: 35, height: 26, color: "#f59e0b" },
        { id: "augl", type: "text", x: 97, y: 128, label: "AUG (start)", textColor: "#f59e0b", fontSize: 9 },
        { id: "small", type: "ellipse", cx: 200, cy: 100, rx: 65, ry: 30, color: "#3b82f6" },
        { id: "smalll", type: "text", x: 200, y: 103, label: "40S small subunit", textColor: "#1e40af", fontSize: 10 },
        { id: "scan", type: "text", x: 200, y: 68, label: "← scanning for AUG", textColor: "#6b7280", fontSize: 9 },
      ],
      highlight: ["small", "aug", "smalll"],
    }),
  },
  {
    order: 2,
    titleHe: "הרכבת קומפלקס הפתיחה — tRNA ראשוני",
    titleEn: "Initiation Complex — First tRNA",
    descHe: "תת-היחידה הגדולה (60S) מצטרפת ליצירת ריבוזום 80S. ה-initiator tRNA (Met-tRNA) נכנס לאתר P ומזהה AUG. אתר A ריק מוכן לקבל את ה-tRNA הבא.",
    descEn: "The large subunit (60S) joins to form the 80S ribosome. The initiator Met-tRNA occupies the P site, aligned with AUG. The A site is empty, ready for the next aminoacyl-tRNA.",
    svgData: JSON.stringify({
      elements: [
        { id: "mrna", type: "rect", x: 30, y: 175, width: 340, height: 12, color: "#ec4899" },
        { id: "large", type: "ellipse", cx: 200, cy: 95, rx: 80, ry: 40, color: "#7c3aed" },
        { id: "largel", type: "text", x: 200, y: 98, label: "60S large subunit", textColor: "#fff", fontSize: 10 },
        { id: "small", type: "ellipse", cx: 200, cy: 150, rx: 70, ry: 28, color: "#3b82f6" },
        { id: "smalll", type: "text", x: 200, y: 153, label: "40S", textColor: "#fff", fontSize: 10 },
        { id: "psite", type: "rect", x: 150, y: 108, width: 40, height: 52, color: "#22c55e", opacity: 0.3 },
        { id: "psitel", type: "text", x: 170, y: 202, label: "P site (Met-tRNA)", textColor: "#22c55e", fontSize: 9 },
        { id: "asite", type: "rect", x: 200, y: 108, width: 40, height: 52, color: "#f59e0b", opacity: 0.3 },
        { id: "asitel", type: "text", x: 220, y: 215, label: "A site (empty)", textColor: "#f59e0b", fontSize: 9 },
        { id: "trna1", type: "text", x: 170, y: 135, label: "tRNA\nMet", textColor: "#22c55e", fontSize: 10 },
      ],
      highlight: ["large", "psite", "trna1", "asite"],
    }),
  },
  {
    order: 3,
    titleHe: "הארכה — הוספת חומצות אמינו",
    titleEn: "Elongation — Adding Amino Acids",
    descHe: "אמינואציל-tRNA מגיע לאתר A ומוכר את הקודון. פפטידיל טרנספראז יוצר קשר פפטידי. הריבוזום נע (Translocation) על גבי ה-mRNA — אתר A הופך P, P הופך E ומשתחרר.",
    descEn: "Aminoacyl-tRNA enters the A site and recognizes its codon. Peptidyl transferase forms the peptide bond. Translocation moves the ribosome 3 nucleotides: A→P, P→E (exit). Chain grows.",
    svgData: JSON.stringify({
      elements: [
        { id: "mrna", type: "rect", x: 30, y: 200, width: 340, height: 12, color: "#ec4899" },
        { id: "rib", type: "ellipse", cx: 200, cy: 160, rx: 85, ry: 50, color: "#7c3aed", opacity: 0.4 },
        { id: "chain", type: "path", d: "M 140 130 Q 155 120 170 125 Q 185 130 200 120 Q 215 110 230 115", color: "#22c55e" },
        { id: "chainl", type: "text", x: 190, y: 105, label: "Growing peptide chain", textColor: "#22c55e", fontSize: 9 },
        { id: "newtRNA", type: "text", x: 240, y: 155, label: "new tRNA", textColor: "#f59e0b", fontSize: 10 },
        { id: "peptbond", type: "circle", cx: 215, cy: 130, r: 8, color: "#ef4444" },
        { id: "bondl", type: "text", x: 215, y: 118, label: "Peptide bond", textColor: "#ef4444", fontSize: 9 },
        { id: "arrow", type: "text", x: 200, y: 245, label: "→→→ translocation", textColor: "#7c3aed", fontSize: 10 },
      ],
      highlight: ["chain", "peptbond", "bondl", "newtRNA", "arrow"],
    }),
  },
  {
    order: 4,
    titleHe: "סיום — קודון עצירה ושחרור חלבון",
    titleEn: "Termination — Stop Codon and Protein Release",
    descHe: "גורם שחרור (Release Factor) מזהה קודון עצירה (UAA, UAG, UGA) — אין tRNA משלים. פפטידיל טרנספראז מפרק את הקשר לחלבון. החלבון משתחרר ומתחיל לקפל לצורתו התלת-ממדית.",
    descEn: "A release factor protein recognizes a stop codon (UAA, UAG, or UGA) — no matching tRNA. Peptidyl transferase cleaves the polypeptide. The ribosome disassembles and the protein folds into its final 3D shape.",
    svgData: JSON.stringify({
      elements: [
        { id: "mrna", type: "rect", x: 30, y: 200, width: 340, height: 12, color: "#ec4899" },
        { id: "stop", type: "rect", x: 200, y: 194, width: 40, height: 24, color: "#ef4444" },
        { id: "stopl", type: "text", x: 220, y: 188, label: "STOP (UAA)", textColor: "#ef4444", fontSize: 9 },
        { id: "rf", type: "circle", cx: 220, cy: 155, r: 20, color: "#f59e0b" },
        { id: "rfl", type: "text", x: 220, y: 158, label: "RF", textColor: "#78350f", fontSize: 11 },
        { id: "protein", type: "path", d: "M 80 80 Q 100 60 130 70 Q 155 80 160 65 Q 175 50 195 60 Q 215 70 210 85", color: "#22c55e" },
        { id: "proteinl", type: "text", x: 145, y: 45, label: "Released polypeptide → folds!", textColor: "#22c55e", fontSize: 9 },
        { id: "disassemble", type: "text", x: 200, y: 255, label: "Ribosome dissociates → reused", textColor: "#6b7280", fontSize: 9 },
      ],
      highlight: ["stop", "rf", "rfl", "protein", "proteinl"],
    }),
  },
];

const cellularRespirationSteps = [
  {
    order: 1,
    titleHe: "גליקוליזה — פירוק גלוקוז לפירובאט",
    titleEn: "Glycolysis — Glucose to Pyruvate",
    descHe: "בציטופלזמה: גלוקוז (6C) → 2 פירובאט (3C). השקעה: 2 ATP. תשואה: 4 ATP + 2 NADH. רווח נקי: 2 ATP. תהליך אנאארובי — אינו דורש חמצן.",
    descEn: "In cytoplasm: glucose (6C) → 2 pyruvate (3C). Investment: 2 ATP. Yield: 4 ATP + 2 NADH. Net gain: 2 ATP. Anaerobic — does not require oxygen.",
    svgData: JSON.stringify({
      elements: [
        { id: "cyto", type: "rect", x: 20, y: 20, width: 360, height: 260, color: "#f0fdf4", opacity: 0.3 },
        { id: "cytol", type: "text", x: 60, y: 42, label: "Cytoplasm", textColor: "#166534", fontSize: 10 },
        { id: "glc", type: "circle", cx: 80, cy: 150, r: 28, color: "#f59e0b" },
        { id: "glcl", type: "text", x: 80, y: 154, label: "Glucose", textColor: "#78350f", fontSize: 10 },
        { id: "arr", type: "line", x1: 110, y1: 150, x2: 185, y2: 150, color: "#6b7280" },
        { id: "gly", type: "text", x: 148, y: 140, label: "10 steps", textColor: "#7c3aed", fontSize: 9 },
        { id: "pyr", type: "circle", cx: 240, cy: 130, r: 22, color: "#7c3aed" },
        { id: "pyr2", type: "circle", cx: 270, cy: 170, r: 22, color: "#7c3aed" },
        { id: "pyrl", type: "text", x: 255, y: 210, label: "2 Pyruvate", textColor: "#7c3aed", fontSize: 10 },
        { id: "atp", type: "text", x: 148, y: 240, label: "Net: 2 ATP + 2 NADH", textColor: "#22c55e", fontSize: 11 },
      ],
      highlight: ["glc", "pyr", "pyr2", "atp"],
    }),
  },
  {
    order: 2,
    titleHe: "פירובאט דקרבוקסילציה — כניסה למיטוכונדריה",
    titleEn: "Pyruvate Decarboxylation — Entry to Mitochondria",
    descHe: "הפירובאט נכנס למטריצת המיטוכונדריה. קומפלקס פירובאט דהידרוגנאז מפרק כל פירובאט: CO₂ משתחרר, Acetyl-CoA נוצר, NADH מיוצר. לכל גלוקוז: 2 Acetyl-CoA + 2 NADH + 2 CO₂.",
    descEn: "Pyruvate enters the mitochondrial matrix. Pyruvate dehydrogenase complex converts each pyruvate: CO₂ released, Acetyl-CoA formed, NADH produced. Per glucose: 2 Acetyl-CoA + 2 NADH + 2 CO₂.",
    svgData: JSON.stringify({
      elements: [
        { id: "mito", type: "ellipse", cx: 200, cy: 155, rx: 155, ry: 115, color: "#fef9c3", opacity: 0.5 },
        { id: "mitol", type: "text", x: 200, y: 58, label: "Mitochondrial Matrix", textColor: "#92400e", fontSize: 10 },
        { id: "pyr", type: "circle", cx: 90, cy: 155, r: 22, color: "#7c3aed" },
        { id: "pyrl", type: "text", x: 90, y: 188, label: "Pyruvate", textColor: "#7c3aed", fontSize: 9 },
        { id: "arrow", type: "line", x1: 114, y1: 155, x2: 165, y2: 155, color: "#6b7280" },
        { id: "pdh", type: "text", x: 140, y: 145, label: "PDH", textColor: "#6b7280", fontSize: 9 },
        { id: "acetyl", type: "circle", cx: 220, cy: 140, r: 22, color: "#22c55e" },
        { id: "acetyll", type: "text", x: 220, y: 143, label: "Acetyl-CoA", textColor: "#14532d", fontSize: 9 },
        { id: "co2", type: "circle", cx: 200, cy: 200, r: 14, color: "#94a3b8" },
        { id: "co2l", type: "text", x: 200, y: 230, label: "CO₂ released", textColor: "#94a3b8", fontSize: 9 },
        { id: "nadh", type: "circle", cx: 310, cy: 155, r: 18, color: "#3b82f6" },
        { id: "nadhl", type: "text", x: 310, y: 182, label: "NADH", textColor: "#3b82f6", fontSize: 9 },
      ],
      highlight: ["acetyl", "co2", "nadh"],
    }),
  },
  {
    order: 3,
    titleHe: "מחזור קרבס — ייצור NADH ו-FADH₂",
    titleEn: "Krebs Cycle — Generating NADH and FADH₂",
    descHe: "Acetyl-CoA (2C) נכנס למחזור קרבס ומתחבר ל-Oxaloacetate (4C) → Citrate (6C). מחזור של 8 שלבים: 2 CO₂ משתחררים, 3 NADH + 1 FADH₂ + 1 ATP מיוצרים לכל מחזור. סה\"כ לגלוקוז (×2): 6 NADH + 2 FADH₂ + 2 ATP.",
    descEn: "Acetyl-CoA (2C) enters the cycle, combining with Oxaloacetate (4C) → Citrate (6C). 8-step cycle: releases 2 CO₂, generates 3 NADH + 1 FADH₂ + 1 ATP. Per glucose (×2 turns): 6 NADH + 2 FADH₂ + 2 ATP.",
    svgData: JSON.stringify({
      elements: [
        { id: "circle", type: "circle", cx: 200, cy: 155, r: 70, color: "#fde68a", opacity: 0.4 },
        { id: "citrate", type: "text", x: 200, y: 100, label: "Citrate", textColor: "#92400e", fontSize: 10 },
        { id: "isocitrate", type: "text", x: 260, y: 130, label: "Isocitrate", textColor: "#92400e", fontSize: 9 },
        { id: "akg", type: "text", x: 270, y: 170, label: "α-KG", textColor: "#92400e", fontSize: 9 },
        { id: "oaa", type: "text", x: 140, y: 130, label: "OAA", textColor: "#92400e", fontSize: 10 },
        { id: "acetyl", type: "text", x: 200, y: 155, label: "Acetyl-CoA →", textColor: "#22c55e", fontSize: 9 },
        { id: "nadh", type: "text", x: 320, y: 120, label: "×3 NADH", textColor: "#3b82f6", fontSize: 11 },
        { id: "fadh2", type: "text", x: 320, y: 170, label: "×1 FADH₂", textColor: "#7c3aed", fontSize: 11 },
        { id: "atp", type: "text", x: 320, y: 200, label: "×1 ATP", textColor: "#22c55e", fontSize: 11 },
        { id: "co2", type: "text", x: 80, y: 180, label: "×2 CO₂", textColor: "#94a3b8", fontSize: 10 },
      ],
      highlight: ["nadh", "fadh2", "atp"],
    }),
  },
  {
    order: 4,
    titleHe: "שרשרת הנשימה + ATP Synthase — 28-32 ATP",
    titleEn: "Electron Transport Chain + ATP Synthase — 28-32 ATP",
    descHe: "NADH ו-FADH₂ מעבירים אלקטרונים לקומפלקסים I-IV בקרום הפנימי של המיטוכונדריה. הגרדיאנט H⁺ שנוצר מניע את ATP Synthase. O₂ הוא הקולט הסופי → נוצר H₂O. תשואה: ~28-32 ATP.",
    descEn: "NADH and FADH₂ donate electrons to Complexes I–IV in the inner mitochondrial membrane. The resulting H⁺ gradient drives ATP Synthase (chemiosmosis). O₂ is the final electron acceptor → H₂O. Yield: ~28-32 ATP.",
    svgData: JSON.stringify({
      elements: [
        { id: "membrane", type: "rect", x: 30, y: 120, width: 340, height: 18, color: "#f59e0b" },
        { id: "membl", type: "text", x: 200, y: 112, label: "Inner Mitochondrial Membrane", textColor: "#92400e", fontSize: 9 },
        { id: "c1", type: "circle", cx: 80, cy: 129, r: 16, color: "#3b82f6" },
        { id: "c1l", type: "text", x: 80, y: 160, label: "Cplx I", textColor: "#3b82f6", fontSize: 8 },
        { id: "c3", type: "circle", cx: 180, cy: 129, r: 16, color: "#7c3aed" },
        { id: "c3l", type: "text", x: 180, y: 160, label: "Cplx III", textColor: "#7c3aed", fontSize: 8 },
        { id: "c4", type: "circle", cx: 270, cy: 129, r: 16, color: "#ec4899" },
        { id: "c4l", type: "text", x: 270, y: 160, label: "Cplx IV", textColor: "#ec4899", fontSize: 8 },
        { id: "atps", type: "circle", cx: 340, cy: 129, r: 18, color: "#22c55e" },
        { id: "atpsl", type: "text", x: 340, y: 160, label: "ATP\nSynth", textColor: "#22c55e", fontSize: 8 },
        { id: "hplus", type: "text", x: 200, y: 90, label: "H⁺ gradient →→→", textColor: "#f59e0b", fontSize: 10 },
        { id: "atp", type: "circle", cx: 340, cy: 215, r: 26, color: "#22c55e" },
        { id: "atpl", type: "text", x: 340, y: 219, label: "~30 ATP", textColor: "#14532d", fontSize: 11 },
        { id: "h2o", type: "text", x: 270, y: 195, label: "O₂+H⁺→H₂O", textColor: "#6b7280", fontSize: 9 },
      ],
      highlight: ["c1", "c3", "c4", "atps", "atp", "hplus"],
    }),
  },
];

async function main() {
  console.log("🌱 Adding Translation and Cellular Respiration processes...");

  const molBio = await prisma.topic.findUnique({ where: { slug: "molecular-biology" } });
  const biochem = await prisma.topic.findUnique({ where: { slug: "biochemistry" } });

  if (molBio) {
    const exists = await prisma.process.findFirst({ where: { slug: "translation" } });
    if (!exists) {
      await prisma.process.create({
        data: {
          slug: "translation",
          topicId: molBio.id,
          nameHe: "תרגום",
          nameEn: "Translation",
          descHe: "תהליך קריאת ה-mRNA וסינתזת חלבון בריבוזומים",
          descEn: "Reading mRNA and synthesizing a protein at the ribosome",
          steps: { create: translationSteps },
        },
      });
      // Link to central dogma subtopic
      await prisma.subtopic.updateMany({
        where: { slug: "central-dogma" },
        data: { relatedProcessSlug: "transcription" },
      });
      console.log("  ✓ Translation added");
    }
  }

  if (biochem) {
    const exists = await prisma.process.findFirst({ where: { slug: "cellular-respiration" } });
    if (!exists) {
      await prisma.process.create({
        data: {
          slug: "cellular-respiration",
          topicId: biochem.id,
          nameHe: "נשימה תאית",
          nameEn: "Cellular Respiration",
          descHe: "ייצור ATP מגלוקוז: גליקוליזה → מחזור קרבס → שרשרת הנשימה",
          descEn: "ATP production from glucose: glycolysis → Krebs cycle → electron transport chain",
          steps: { create: cellularRespirationSteps },
        },
      });
      // Link ATP subtopic to cellular respiration
      await prisma.subtopic.updateMany({
        where: { slug: "atp-energy" },
        data: { relatedProcessSlug: "cellular-respiration" },
      });
      console.log("  ✓ Cellular Respiration added");
    }
  }

  const counts = {
    processes: await prisma.process.count(),
    steps: await prisma.processStep.count(),
  };
  console.log(`✅ Done! Processes: ${counts.processes}, Steps: ${counts.steps}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
