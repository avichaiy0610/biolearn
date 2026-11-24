# ארכיון איורים — 2026-11-24 (סבב הווירולוגיה, p2p + p2q)

שמונת האיורים שנותרו בתור "ציור מחדש" — כולם וירולוגיה/פתוגנים, ולכן נדחו לסשן Opus 5.
צוירו מחדש ע"י Codex (אצוות `p2p` ו-`p2q` במעבדה `visual-lab/textbook-redraws-2`):

אצווה p2p — ספר הקורס 134039, Flint, *Principles of Virology* Vol I 5e (2020):
- `virologyFigures.tsx`: EntrySteps (`vr-entry-steps`, יחידה vr-attachment-entry)
- `virologyFigures.tsx`: RnaTranslationSwitch (`vr-rna-translation`, יחידה vr-rna-expression)
- `virologyFigures.tsx`: ReplicationOrigin (`vr-replication`, יחידה vr-genome-replication)
- `virologyFigures.tsx`: ExitRoutes (`vr-exit-routes`, יחידה vr-exit)

אצווה p2q:
- `bio1Figures.tsx`: Virus (`b1-virus`, יחידה b1-cells) — 134058, Life 12e + Alberts 7e
- `drugsFigures.tsx`: PhageDisplay (`dg-phage`, יחידה dg-display) — 136014, Alberts 7e (אין רשימת ספרים רשמית לקורס)
- `neuroFigures.tsx`: ProteinAggregation (`nb-protein-aggregation`, יחידה nb-neurodegeneration) — 134157, Bear 5e + Alberts 7e
- `plantFigures.tsx`: PlantImmunity (`plant-immunity`, יחידה pp-biotic-stress) — 134040, Taiz 7e

`code/<Name>.tsx.txt` — הפונקציה הישנה בדיוק כפי שהייתה; `svg/` — רינדור בהיר/כהה.
שחזור: להחזיר את הפונקציה לקובץ המקור, למחוק את שורת `import { <Name> } from "./redraws/<Name>"`
ואת `components/lesson/redraws/<Name>.tsx`.

התיקייה נקראת `2026-11-24-viro` ולא `2026-11-24` משום ששם התאריך כבר שימש את סבב היוביקוויטין
והחד-תאיים של אותו יום.
