@AGENTS.md

## Animation standards
Every SVG/animation on this site must meet the scientific-fidelity standard already used in the mitosis and DNA-replication animations: real biological structures (not generic circles/ellipses), accurate stage order and causal movement per Campbell/Alberts, correct terminology in Hebrew and English, a "schematic, not to scale" note where relevant, a full visual legend, readable labels with leader lines on desktop and 390px mobile, prev/next + autoplay + pause controls, reduced-motion support, and RTL/LTR support. When creating a NEW animation, build it to this standard from the start. When editing existing ones, preserve their style and only refine fidelity.

## Animation drafts workflow
The admin panel never publishes AI animations directly. "Generate animation", "rebuild" and syllabus uploads save a `ProcessDraft` (the live animation stays untouched); the upgraded prompt (`lib/generate-animation-steps.ts`) makes the AI emit v2 scenes with composites (`content/process-scenes/composites.ts`) and bilingual labels, and `lib/animation-draft.ts` normalises them and records automated findings. Admins see drafts at `/[lang]/admin/drafts`. When asked to polish and publish a draft:
1. `npx tsx scripts/animation-drafts.ts list`, then `show <id>` to read the draft (texts, elements, findings).
2. Write the polished scene in `content/process-scenes/<name>.ts` with the kit, `slug` = the draft's target slug (rebuild) or proposed slug (new), and register it in `content/process-scenes/index.ts`. Fix the biology against Campbell/Alberts; keep the draft's idea but redraw to the standard above.
3. Visual check: `npx next dev -p 3200`, then `node scripts/scene-shots.mjs <slug> he 900`, `... he 390` and `... en 900` (preview route `/[lang]/dev-scenes/<slug>` exists only in development; `draft-<id>` previews the raw draft). Look at every montage; fix overlaps, clipped or unreadable labels.
4. `npx tsx scripts/animation-drafts.ts publish <id>` — refuses without a polished scene or when `lib/animation-standards.ts` reports errors; writes a backup (`--rollback <file>` restores). `check --all` audits every published animation.
5. Commit the scene, push, verify the live page (desktop + 390px, he/en).
