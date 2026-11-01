# Calibration — what the skill missed on 30 Technion courses (2026-11-01)

Avichai supplied a student Drive (exams 2007-2025, HW, summaries) and official syllabi for the
Technion biology courses already on BioLearn. Each course's units were compared to that material
(full notes: `Project One/drive-audit/report/findings.md`, Hebrew summary: `report/summary-he.md`; the whole story: `Project One/drive-audit/README.md`). Other
universities will never have such a Drive, so the misses below are the reason for steps 2a, 2b
and 5a.4-7 in SKILL.md.

## Misses by cause

| cause | examples | findable without the Drive? | fix in SKILL.md |
|---|---|---|---|
| Assessment unknown | 11/30 courses have no exam (134128, 134140, 134151, 136158, 134141, 134147, 066418, 134155, 136014, …); gene expression, molecular, developmental, biophysics, virology exams are experiment design / data reading / calculation | partly — HUJI/TAU/BIU syllabi state grading; Technion portal does not | 2a |
| Lecturer's research field | muscle atrophy 3 weeks (134117, 134147 — Shenhav Cohen); myoblast fusion full exam question + cell fusion (134069 — Podbilewicz); last virology exam question always a paper from the lecturer's field (134039 — Lindell); single-molecule focus (134156 — Kaplan) | yes — lab pages, papers | 2b |
| Methods not in the topic list | 134082: Western, EMSA, reporter, ChIP, sequencing all 0 (in 19-47% of exams+HW); 134119: qPCR, CRISPR/dCas9, Genome Browser; 136158: single-cell, microbiome | yes — standard for the course type | 5a.6 + `methods-checklist.md` |
| Own exclusion of a named topic | 136014: portal "therapeutic agents", plan excluded CAR-T → 2025 syllabus had engineered T cells, immunotherapy, Gleevec, Herceptin, Rituximab, personalized medicine (all 0) | yes | 5a.4 |
| Canonical core missing | Hardy–Weinberg 0 (37% of 134020 exams); recombinant DNA/PCR 0 in Biology 1 (~76%); speciation + Hamilton 0 in evolution; apoptosis 0 in cell biology; virus origins (134039) | yes — any same-name course | 5a.5 |
| Another course's material | photosynthesis in 134113 (0% of exams; taught in 134040); operons in 134119; immunology + clinical in 134121; interferon cascade in 134039 | yes — faculty course list | 5a.7 |
| Lecturer-specific depth in a named topic | beam theory / nucleosome bending energy = half of the 2020 biophysics exam; partition-function tables in every HW | partly — course books + lecturer focus | 2a.4 (practice in exam format) |
| Only insiders know | real lecture order (134128 reversed), Technion grading, which old-exam topics are still taught | no | step 7 (students) |

## What already worked
- Topic match was good or excellent for most courses (134019, 134082 order, 134111, 136088, 134113,
  276413). Following the official topic text is right — the misses are around it, not in it.
- Scope labels (core / likely / extension) were the right idea; they lacked the inputs above.

## Rule of thumb
Old exams can describe an older course (2007-2019); weigh 2022+ and current syllabi higher.
A regex count over exam text is coarse — spot-check important hits by reading.
