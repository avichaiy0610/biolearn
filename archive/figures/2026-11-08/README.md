# גיבוי איורים — 2026-11-08

3 איורי אימונולוגיה הוחלפו בגרסת ספר לימוד של Codex (סבב 2 של הציור מחדש, אושר ע"י אביחי 8.11): AntigenProcessing, AntibodyStructure (עכשיו `ImmunologyAntibodyStructure`, כדי לא להתנגש בשם של microFigures), LeukocyteMigration. במחשב — תמונה אחת; בטלפון (עד 600px) — פריסה נפרדת.

- `code/<Name>.tsx.txt` — הפונקציה הישנה כפי שנחתכה מ-`components/lesson/immunologyFigures.tsx`.
- `svg/` — צילומי SVG של הגרסאות הישנות (בהיר וכהה).
- ההשוואה ישן/חדש: `visual-lab/textbook-redraws-2/compare.html`.

**סבב נוסף (אותו יום):** AntibodyStructure (מ-`microFigures.tsx`), BrainRegions, VesicleRelease, LtpNmda (מ-`neuroFigures.tsx`). אותו מבנה: `code/` ו-`svg/`; הרכיבים החדשים ב-`components/lesson/redraws/` עם `geometry/six.tsx`.

**שחזור:** להדביק את הפונקציה בחזרה לקובץ המקור (`immunologyFigures.tsx` / `microFigures.tsx` / `neuroFigures.tsx`), למחוק את שורת ה-import של `./redraws/<Name>`, ובמקרה של הנוגדן להחזיר את `el: AntibodyStructure` ב-registry.
