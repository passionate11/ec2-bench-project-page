# EC²-Bench — Project Page

Academic project page for **“Empowering Edge Agents: A Systematic Analysis of
Edge-Cloud Collaboration in LLM Agent Execution”** (EC²-Bench).

Live at **https://passionate11.github.io/ec2-bench-project-page/**.

The page is a single static `index.html` that follows the paper's order:

1. **Hero** — title, one-paragraph summary, buttons, benchmark-at-a-glance numbers, and the
   overview figure (Figure 1).
2. **Takeaways** — four headline findings in plain language.
3. **Motivation** — edge-only vs. cloud-only vs. what prior benchmarks missed, followed by
   the three research questions.
4. **Strategies** — the two baselines and four collaboration strategies, grouped by *who
   decides* (router vs. edge agent), each tagged with when the cloud joins and what it does.
5. **Benchmark** — what EC²-Bench is, the three evaluation dimensions, task categories and
   sources, and the comparison with prior benchmarks (paper Table 1).
6. **Main Results** — a screenshot of paper Table 2.
7. **Findings** — RQ1–RQ3, each next to its paper figure (Figures 2–4).
8. **Resources & Citation**, then **Authors**.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080          (English by default; append ?lang=zh for Chinese)
```

## Editing content

- **Main results** — `assets/figures/table2-main-results.png` is cropped from the paper PDF
  (`tools/crop_table.py` in the build folder); re-crop it whenever Table 2 changes.
- **Figures 2 and 3** — `assets/figures/fig2*-v2.png` and `fig3*-v2.png` are redrawn from the
  Table 2 numbers (`tools/build.sh` in the build folder regenerates them). Figures 1 and 4
  are rendered from the paper's figure PDFs.
- **Copy / narrative** — edit `index.html` directly. Every translatable node has a
  `data-i18n` key; its Chinese text lives in `I18N_ZH` in `assets/app.js` — update both.
- **Design tokens** — colors, spacing, and fonts live in the `:root` block of
  `assets/styles.css`.
- **Cache busting** — after editing CSS / JS, bump the `?v=` query strings in `index.html`.

## Notes before publishing

- `paper.pdf` is the full paper. Remove it (and the “Paper (PDF)” links in `index.html`)
  if you do not want the PDF public.
- The hero tag reads “Benchmark & Empirical Study · 2026”; update it to the venue once accepted.
- `index.html` `<head>` sets `canonical` / `og:image` / `twitter:image` to the GitHub Pages
  URL above — update them if the repo is renamed again.
- The `<a href="https://github.com/OpenBMB/EC2-Bench">` links and the BibTeX `url` point at
  the public repo — update if the canonical location changes.

## Deployment (GitHub Pages)

Push to GitHub, then enable Pages from the repository settings with the default branch
as the source. A `.nojekyll` file is included so all assets are served as-is.
