# גיבוי איורים — 2026-11-08

3 איורי אימונולוגיה הוחלפו בגרסת ספר לימוד של Codex (סבב 2 של הציור מחדש, אושר ע"י אביחי 8.11): AntigenProcessing, AntibodyStructure (עכשיו `ImmunologyAntibodyStructure`, כדי לא להתנגש בשם של microFigures), LeukocyteMigration. במחשב — תמונה אחת; בטלפון (עד 600px) — פריסה נפרדת.

- `code/<Name>.tsx.txt` — הפונקציה הישנה כפי שנחתכה מ-`components/lesson/immunologyFigures.tsx`.
- `svg/` — צילומי SVG של הגרסאות הישנות (בהיר וכהה).
- ההשוואה ישן/חדש: `visual-lab/textbook-redraws-2/compare.html`.

**שחזור:** להדביק את הפונקציה בחזרה ל-`immunologyFigures.tsx`, למחוק את שורת ה-import של `./redraws/<Name>`, ובמקרה של הנוגדן להחזיר את `el: AntibodyStructure` ב-registry.
