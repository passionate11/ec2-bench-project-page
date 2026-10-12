# EC²-Bench — Project Page

Academic project page for **“Empowering Edge Agents: A Systematic Analysis of
Edge-Cloud Collaboration in LLM Agent Execution”** (EC²-Bench).

Live at **https://passionate11.github.io/ec2-bench-project-page/**.

The page is a single static `index.html` that tells the paper's story top to bottom:

1. **Hero** — title, authors, action buttons, one-paragraph thesis, and the overview
   figure (Figure 1 from the paper).
2. **Takeaways** — four key findings.
3. **Leaderboard** — sortable / filterable results table (main GLM-5.3 setting and the
   DeepSeek-V4.1-Flash appendix setting).
4. **Motivation** — why one-shot query routing is not enough for long-horizon agents.
5. **Benchmark** — what EC²-Bench is, the comparison with prior benchmarks (Table 1),
   the three evaluation axes, task categories and sources.
6. **Strategies** — the two baselines and four collaboration strategies, grouped by
   *who decides* when the cloud participates.
7. **Findings** — an interactive completion vs. cost / privacy-exposure plot, the three
   RQ findings, and Figures 3–4 from the paper.
8. **Resources & Citation**.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080          (append ?lang=en or ?lang=zh to force a language)
```

## Editing content

- **Results / leaderboard / plot** — all driven by `data/results.json`. Each row has a
  `suite` (`glm` = paper Table 2, `dsflash` = Table 11, `both` = shared rows such as
  edge-only). `privacyExposure` is the share of sensitive units exposed to the cloud
  (**lower is better**). The table and plot (axis ranges included) update automatically.
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
