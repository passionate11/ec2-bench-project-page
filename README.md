# EC²-Bench — Project Page

Academic project page for **“Empowering Edge Agents: A Systematic Analysis of
Edge-Cloud Collaboration in LLM Agent Execution”** (EC²-Bench).

Live at **https://passionate11.github.io/ec2-bench-project-page/**.

The page is a single static `index.html` that tells the paper's story top to bottom:

1. **Hero** — title (main + subtitle), a one-line tagline, action buttons, and the overview figure (Figure 1).
2. **Takeaways** — four key findings.
3. **Motivation** — why one-shot query routing is not enough for long-horizon agents.
4. **Benchmark** — what EC²-Bench is, the comparison with prior benchmarks (Table 1),
   the three evaluation axes, task categories and sources.
5. **Strategies** — the two baselines and four collaboration strategies, grouped by
   *who decides* when the cloud participates.
6. **Main Results** — a screenshot of the paper's Table 2.
7. **Findings** — an interactive completion vs. cost / privacy-exposure plot, the three
   RQ findings, and Figures 3–4 from the paper.
8. **Resources & Citation**, then **Authors** at the bottom.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080          (English by default; append ?lang=zh for Chinese)
```

## Editing content

- **Main results** — `assets/figures/table2-main-results.png` is cropped from the paper PDF
  (`tools/crop_table.py` in the build folder); re-crop it whenever Table 2 changes.
- **Trade-off plot** — driven by `data/results.json`. Each row has a `suite` (`glm` = paper
  Table 2, `dsflash` = Table 11, `both` = shared rows such as edge-only).
  `privacyExposure` is the share of sensitive units exposed to the cloud (**lower is better**).
  Axis ranges update automatically.
- **Figures** — `assets/figures/` holds PNGs rendered from the paper's figure PDFs:
  `fig1-overview.png` (Figure 1), `fig2a-cost.png` (Figure 2a, no-JS fallback),
  `fig3a/b-*-v2.png` (Figure 3, redrawn from the Table 2 numbers), `fig4a/b-*.png` (Figure 4).
- **Copy / narrative** — edit `index.html` sections directly. Every translatable node has
  a `data-i18n` key; its Chinese text lives in `I18N_ZH` in `assets/app.js` — update both.
- **Design tokens** — colors, spacing, and fonts live in the `:root` block of
  `assets/styles.css`. The three axes are color-coded consistently
  (performance = green, resource = amber, privacy = indigo).
- **Cache busting** — after editing CSS / JS / data, bump the `?v=` query strings in
  `index.html` and `dataVersion` in `assets/app.js`.

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
