---
name: animation-standard
description: >-
  How a BioLearn animation must look and how to get it there — the visual and scientific
  bar (meiosis and PCR are the reference), the step-by-step build with the scene kit, and
  the checks before publishing. Use whenever creating, rebuilding, polishing, reviewing or
  publishing an animation or process scene (content/process-scenes, admin drafts), and
  for animated figures inside study units.
---

# Animation Standard

**The bar:** every animation must be as good as **meiosis** (`content/process-scenes/meiosis.ts`,
live `/he/topics/genetics/meiosis`) and **PCR** (`pcr.ts`, `/he/topics/molecular-biology/pcr`).
Open one of them before you start and compare against it at the end. Avichai judges the site
by how invested the visuals look: flowcharts, abstract shapes or crowded frames read as cheap.

## What a good animation looks like

**1. Real biology, drawn**
- Real structures drawn as paths: chromosomes with chromatids and a centromere, double-stranded
  DNA with 5'/3' ends, a ribosome with subunits, a bilayer, a mitochondrion with cristae.
  Use the kit (`kit.ts`: `dsDNA`, `chromosome`, `ribosome`, `trna`, `mrna`, `bilayer`,
  `mitochondrion`, …) before drawing your own. Never a scene of only circles and boxes.
- Accurate stage order, causal movement and terminology per Campbell/Alberts (or the course
  textbook). Write the chapters in `meta.source`.
- Real details that teach: temperatures in PCR, strand direction, which enzyme and where.

**2. One scene that carries through the steps**
- The same elements (same ids, same place, same colors) persist across all steps; each step
  changes only what the process changes. The student should feel one thing evolving, not a
  slideshow of unrelated pictures.
- Colors from the shared palette `C` (template strand `dnaA`, partner `dnaB`, maternal/paternal,
  energy, redox…), with the same meaning in every animation on the site.

**3. Clean, not cluttered ("beautiful design")**
- One idea per step. 2–4 labels per step, with plenty of empty space.
- An element that is no longer part of the current step is removed (`gone()`), not left faint.
- A crowded step becomes two steps. (The two-route PEPCK frame was rejected as too busy.)
- 3–8 steps is typical; the automated check warns above 12.

**4. Labels**
- Callout labels with leader lines (`label(..., to)`) pointing at the structure, placed clear
  of the drawing, never on top of it.
- Lay out at the real size: labels render at a minimum font of 16.5 in a 400×300 viewBox.
- Long labels (>18 chars) get `short`/`shortHe` variants for 390px mobile.
- Specific wording, 2–3 words: "זיקה גבוהה לחמצן", not "זיקה גבוהה".
- Pure Latin text (5'/3', codons, dNTPs, °C) is `ltr`; Hebrew labels need real Hebrew (`labelHe`).

**5. The frame**
- A legend of at least 2 items, covering every color that carries meaning.
- The note "סכמטי — לא בקנה מידה" (`NOTE`) when relevant.
- Step titles and descriptions in Hebrew and English. A description explains *why* and
  *how*, not just what you see (at least ~60 characters, usually 2–3 sentences).
- Works in RTL (he) and LTR (en), at desktop and 390px, with reduced motion. The player
  already provides prev/next/autoplay/pause, so don't build controls.

## How to build one

1. Read the reference (meiosis/PCR) and the textbook section. Write in one line per step what
   changes in it. If a step has two ideas, split it.
2. Write the scene in its own file `content/process-scenes/<name>.ts`: constants for shared
   geometry at the top, functions that draw the persistent parts, then `stepN: El[]`. Add
   `meta` (topic, names, description, source) for a scene authored directly, and register it
   in `content/process-scenes/index.ts`.
3. Look at it. Run `npx next dev -p 3200`, then
   `node scripts/scene-shots.mjs <slug> he 900`, `... he 390`, `... en 900`, and look at
   **every** montage (Read the PNGs in `.shots/`). Fix overlaps, labels on the drawing, empty
   or crowded steps. Compare side by side with the meiosis/PCR shots.
4. Run the checks:
   - `node scripts/label-clipping.mjs http://localhost:3200 900` (and `390`) → must be 0.
   - `npx tsx scripts/animation-drafts.ts check <slug>` → no errors (`lib/animation-standards.ts`
     catches only the mechanical part; the biology and the look are your job).
5. Publish: the live site reads from the DB, not from the code.
   `npx tsx scripts/animation-drafts.ts publish-scene <slug>` (a backup goes to `.backups/`).
   For an admin draft, follow "Animation drafts workflow" in `CLAUDE.md` (`publish <id>`).
6. Commit, push, check the live page at desktop and 390px in he/en.

Optional: for a demanding scene, ask Codex (`ask-codex` skill, read-only) for an independent
critique of the montages against the reference before publishing.

## Before saying "done", check:

- [ ] Would it sit next to meiosis/PCR without looking cheaper?
- [ ] Real structures, same elements across the steps, palette colors?
- [ ] One idea per step, few labels, empty space, nothing faint left over?
- [ ] Every label has a leader, sits off the drawing, reads at 390px, and is specific?
- [ ] Legend, note, he+en texts, source in `meta`?
- [ ] 0 clipped labels, `check` with no errors, montages viewed at he 900 / he 390 / en 900?
- [ ] Published with `publish-scene` and verified on the live site?
