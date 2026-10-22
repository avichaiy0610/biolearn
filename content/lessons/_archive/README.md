# Archive — content kept for later, not shown on the site

Files here are full copies of units **before** they were narrowed to a course's real scope.
Nothing here is imported by `content/lessons/index.ts` or by a course plan, so it is not shown.
To reuse a section, copy it from the `.full.ts` file into the unit that needs it (and add a scope entry).

## technion-gene-expression (134119) — narrowed 2026-10-22

Reason: Avichai — the course is "what its name says": regulation of expression. Its regulatory RNA is
miRNA/siRNA (+ Drosha, Dicer); core = writers/erasers (HDACs, DNMTs), methylation/acetylation, DNA-binding
motifs. The first version filled every syllabus heading with whole textbook chapters.

| Unit (`*.full.ts`) | Removed sections / items | Where it may belong |
|---|---|---|
| gx-ncrna | riboswitches; bacterial sRNA, Hfq; CRISPR; piRNA; RNAi-directed heterochromatin (S. pombe); lncRNA; riboswitch worked problem; Hfq/RITS/CRISPR questions | riboswitches, lncRNA, piRNA → 134151 "העולם המודרני של הרנ\"א"; CRISPR → 134082 (added to mol-repair) |
| gx-operons | stringent response (ppGpp), r-protein autoregulation (`#more`) | microbiology |
| gx-alternative-splicing | RNA editing (`#editing`), apoB question | 134151 |
| gx-epigenetics | yeast/mammalian prions paragraph, [PSI⁺] question | — |
| gx-genome-structure | prokaryotic genomes (`#prokaryotes`), organelle genomes (`#organelles`) | genomics / microbiology |
| gx-gene-families | operons in eukaryotes, trans-splicing (`#eukaryotic-operons`) | — |
| gx-repeats-mobile | satellites/mini/microsatellites (`#tandem`; FMR1 kept in the unit), IS elements and DNA transposons, P elements (`#dna-transposons`), domestication (`#domestication`) | genetics / evolution |
| gx-genome-wide | mitotic silencing (`#mitosis`), transcriptome (`#transcriptome`) | — |
| gx-integration | gene-expression noise (`#noise`) | 136037 systems biology |

Units that were not changed are archived too (identical copies), so every 134119 unit has a reference copy.
Figures used only by removed sections stay in `components/lesson/geneExpressionFigures.tsx`.
