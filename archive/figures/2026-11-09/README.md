# גיבוי איורים — 2026-11-09

שני איורי וירולוגיה צוירו מחדש ברמת ספר לימוד (Codex), ושולבו באישור אביחי.

- `Architecture` → `vr-architecture` (ביחידה `vr-properties`)
- `PackagingMotor` → `vr-packaging` (ביחידה `vr-assembly-packaging`)

- `code/<Name>.tsx.txt` — הפונקציה הישנה כפי שנחתכה מ-`components/lesson/virologyFigures.tsx`.
- `svg/` — ה-SVG הישנים (בהיר וכהה).
- המקור המוקפא והצילומים הישנים נמצאים גם ב-`visual-lab/textbook-redraws-2/old/`.

**שחזור:** להדביק את הפונקציה בחזרה לקובץ ה-registry ולמחוק את שורת ה-import של `./redraws/<Name>`.

## סבב נוסף — אישור אביחי 9.11
הגרסאות הישנות של איורים שצוירו מחדש (Codex, textbook-redraws-2) ואושרו ע"י אביחי:
- `ubiquitinFigures.tsx`: E3Classes (`ub-e3-classes`), ProteasomeCycle (`ub-proteasome-cycle`)
- `zoologyFigures.tsx`: Sponge (`z-sponge`), Cnidocyte (`z-cnidocyte`), BirdLung (`z-bird-lung`), HairCell (`z-hair-cell`)
`code/<Name>.tsx.txt` — הפונקציה הישנה בדיוק כפי שהייתה; `svg/` — רינדור בהיר/כהה.
שחזור: להחזיר את הפונקציה לקובץ המקור, למחוק את שורת `import { <Name> } from "./redraws/<Name>"` ואת `components/lesson/redraws/<Name>.tsx`.

## סבב 5 (עדיפות 2) — אישור אביחי 9.11
- `bio1Figures.tsx`: ProteinLevels (`b1-protein-levels`)
- `bio1Figures.tsx`: EnzymeRegulation (`b1-enzyme-regulation`)
- `bio1Figures.tsx`: ProkEuk (`b1-prok-euk`)
- `bio1Figures.tsx`: AnimalPlantCell (`b1-animal-plant-cell`)
- `bio1Figures.tsx`: TransportModes (`b1-transport-modes`)
- `biochemFigures.tsx`: Polysaccharides (`polysaccharides`)
אותו מבנה ואותו שחזור כמו למעלה.
