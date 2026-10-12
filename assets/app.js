/* ============================================================
   EC²-Bench — interactive trade-off plot + page i18n
   ============================================================ */

const state = {
  results: [],
  points: [],
  suite: "glm",          // cloud-model setting: "glm" (Table 2) | "dsflash" (Table 11)
  xAxis: "cost",         // plot x-axis: "cost" | "exposure"
  plotEdge: "all"        // plot highlight: "all" | edge model name
};

const dataVersion = "20261012-ec2d";

/* ============================================================
   i18n — bilingual EN / 中文
   English lives in the HTML (data-i18n marks each node, original
   cached on first switch); Chinese lives here. JS-generated text
   (leaderboard tags, canvas labels, tooltip) uses t().
   ============================================================ */
let currentLang = document.documentElement.getAttribute("data-lang") || "en";

const I18N_ZH = {
  "nav.problem": "动机",
  "nav.benchmark": "基准",
  "nav.strategies": "策略",
  "nav.results": "主实验",
  "nav.findings": "发现",
  "nav.code": "代码",

  "hero.venue": "基准与实证研究 · 2026",
  "hero.titleMain": "赋能端侧智能体",
  "hero.titleSub": `大模型智能体执行中<span class="title-accent">端云协同</span>的系统性分析`,
  "hero.tagline": "128 个可执行任务 · 4 种协同策略 · 任务表现、资源用量与隐私暴露",
  "hero.btnCode": "代码与数据",
  "hero.btnPaper": "论文 (PDF)",
  "hero.btnResults": "主实验结果",
  "hero.btnBibtex": "BibTeX",
  "hero.caption": `<strong>总览。</strong>一个代表性的长程工作流，端侧与云端智能体在同一条轨迹上交替参与；我们研究的四种协同策略，区别在于<em>由谁</em>决定云端何时加入、以及云端被调用后<em>做什么</em>；以及三个研究问题。`,

  "takeaways.kicker": "要点",
  "takeaways.h2": "核心要点",
  "takeaways.c1h": "端云协同对长程智能体有效",
  "takeaways.c1p": `部分云端参与就能补回大部分能力差距。以 Qwen3.5-2B 为端侧时，逐步路由把完成度从 <strong>12.75 提升到 39.97</strong>，云成本仅为纯云端的 <strong>22.7%</strong>；多个配置都高于端侧与云端之间的线性插值。`,
  "takeaways.c2h": "端侧越强，性能趋同，隐私不趋同",
  "takeaways.c2p": `各策略之间的完成度差距从 <strong>25.22</strong> 分（2B）降到 5 分以内（27B 为 4.60，Qwen3.7-Plus 为 <strong>4.76</strong>）。隐私暴露却依然分化：在 27B 上，各策略完成度只差 4.60 分，隐私暴露却相差 <strong>35.93</strong> 分。`,
  "takeaways.c3h": "最优协同方式随之转移",
  "takeaways.c3p": `端侧较弱时，外部路由与云端直接执行效果最好（2B：逐步路由 <strong>39.97</strong>，端侧控制委托仅 15.86）。端侧变强后则转向端侧自主调用与云端<strong>建议</strong>（Qwen3.7-Plus：<strong>76.84</strong>）。`,
  "takeaways.c4h": "两项端侧能力是关键",
  "takeaways.c4p": `一是知道<strong>何时调用</strong>云端（端侧控制委托比相同调用率的随机调用基线最多高 +4.4）；二是<strong>用好云端的指导</strong>（指令遵循训练使建议模式下的完成度从 24.8 提升到 28.8）。`,


  "problem.kicker": "动机",
  "problem.h2": "从一次性路由，到穿插于轨迹的协同。",
  "problem.lede": `端侧设备运行小模型（通常 ≤10B 参数），数据留在本地，却难以胜任复杂的规划与工具使用；云端前沿大模型能力强得多，但成本高，而且能看到发给它的一切。以往的端云系统<em>每个查询只协调一次</em>。而在长程智能体执行中，云端会在轨迹的不同位置参与：每一次参与决策都会影响后续步骤、累积成本，并决定有多少工作区信息离开设备。`,
  "problem.c1tag": "仅端侧",
  "problem.c1h": "本地，但能力有限",
  "problem.c1p": `每个动作都由端侧模型生成。没有任何暴露，但长程工作区任务会撞上能力瓶颈：Qwen3.5-2B 完成度仅 12.75%，Qwen3.5-9B 为 39.12%。`,
  "problem.c1pillA": "0% 暴露",
  "problem.c1pillB": "完成度 12.75%（2B）",
  "problem.c2tag": "仅云端",
  "problem.c2h": "强大，但暴露",
  "problem.c2p": `GLM-5.3 驱动每一步，完成度最高；但 87% 的标注敏感单元会到达云端，云成本也是所有设置中最高的（$56.42）。`,
  "problem.c2pillA": "完成度 82.70%",
  "problem.c2pillB": "暴露 87.01%",
  "problem.c3tag": "此前缺失的",
  "problem.c3h": "评估停留在查询层面",
  "problem.c3p": `RouterBench、LLMRouterBench、LLMSwitchBench、M4A1 等现有基准，评估的是单个查询或对话轮次上的路由决策，任务也多是独立推理任务。轨迹级的成本与隐私效应因此一直没有被度量。`,
  "problem.c3pill": "需要轨迹级评估",

  "bench.kicker": "基准",
  "bench.h2": "EC²-Bench：在整条轨迹上评估端云协同。",
  "bench.lede": `EC²-Bench（<strong>E</strong>dge–<strong>C</strong>loud <strong>C</strong>ollaborative Agent Benchmark，端云协同智能体基准）。128 个可执行的数字工作区任务，整理自六个智能体基准，统一适配到同一个 OpenClaw 运行时，并经过筛选，确保仅端侧、仅云端与协同执行之间确实会拉开差距。其中 100 个任务带有细粒度敏感信息标注，轨迹上云端看到的每一段上下文都可以被审计。`,
  "bench.m1": "可执行任务",
  "bench.m2": "隐私标注任务",
  "bench.m3": "敏感信息单元",
  "bench.m4": "协同策略",
  "bench.tBench": "基准",
  "bench.tScenario": "评估场景",
  "bench.tModes": "协同模式",
  "bench.tDims": "评估维度",
  "bench.r1s": "通用 LLM 任务",
  "bench.r1d": "任务表现 / 成本",
  "bench.r2s": "通用 LLM 与工具使用任务",
  "bench.r2d": "任务表现 / 成本",
  "bench.r3s": "单轮查询",
  "bench.r3d": "任务表现 / 成本",
  "bench.r4s": "多轮对话",
  "bench.r4d": "任务表现 / 成本 / 延迟",
  "bench.r5s": "<strong>长程智能体执行</strong>",
  "bench.r5d": "<strong>任务表现 / 资源 / 隐私</strong>",
  "bench.tCaption": `R<sub>q</sub> / R<sub>s</sub>：查询级 / 逐步路由；D / A：端侧控制的云端委托 / 云端建议。`,
  "bench.a1h": "任务表现",
  "bench.a1p": `任务完成了吗？由任务专属的加权检查项（基于规则的校验、环境状态审计、基于评分细则的 LLM 评判）得到完成度分数；Pass<sup>3</sup> 要求三次运行全部成功。`,
  "bench.a2h": "资源用量",
  "bench.a2p": `代价几何？云端输入、缓存读取与输出 token 及其美元费用，加上端侧 FLOPs（2·N<sub>act</sub>·T），以一组画像呈现，不压缩成单一数字。`,
  "bench.a3h": "隐私暴露",
  "bench.a3p": `什么到达了云端？在任一云端可见上下文中被披露的标注<em>敏感单元</em>（个人与组织两大类，共 12 个子类）所占比例。LLM 评判器能识别改写后的泄露，相对人工标注的 F1 为 96.9%。`,
  "bench.coverage": "任务类别",
  "bench.cov1": "办公与日常 · 36",
  "bench.cov2": "信息检索与收集 · 34",
  "bench.cov3": "安全与防护 · 21",
  "bench.cov4": "开发与运维 · 14",
  "bench.cov5": "数据分析 · 13",
  "bench.cov6": "自动化 · 10",
  "bench.sources": "任务来源",
  "bench.srcCurated": "自建 · 7",

  "strat.kicker": "协同策略",
  "strat.h2": "把云端引入智能体轨迹的四种方式。",
  "strat.lede": `两个单侧基线，加上四种代表性的端云协同策略。它们沿两个维度区分：<strong>由谁决定</strong>云端何时参与（外部路由器，还是端侧智能体自己），以及云端被调用后<strong>做什么</strong>（直接生成动作，还是向端侧提供建议）。`,
  "strat.col1": "单侧基线",
  "strat.s1tag": "仅端侧",
  "strat.s1p": "每个动作都由端侧模型生成。无暴露；能力受限于端侧模型。",
  "strat.s2tag": "仅云端",
  "strat.s2p": "每个动作都由云端模型生成。是能力参照点，也是成本 / 暴露的上限。",
  "strat.col2": `外部路由 <small>由路由器决定</small>`,
  "strat.s3tag": "查询路由",
  "strat.s3p": "RouteLLM 矩阵分解路由器在执行前读一次任务指令，把整条轨迹交给端侧或云端。",
  "strat.s4tag": "逐步路由",
  "strat.s4p": "每一步生成前，依据端侧模型下一个 token 的熵（GlimpRouter 风格）决定这一步由端侧还是云端生成。",
  "strat.col3": `端侧控制 <small>由端侧智能体决定</small>`,
  "strat.s5tag": "端侧控制的云端委托",
  "strat.s5p": "默认在端侧执行。端侧智能体通过委托工具把当前步交给云端，由云端生成下一个动作，随后控制权交回端侧。",
  "strat.s6tag": "端侧控制的云端建议",
  "strat.s6p": "默认在端侧执行。端侧智能体向云端请求计划、建议或纠错，然后自己生成动作。",

  "results.kicker": "主实验结果",
  "results.h2": "EC²-Bench 上的任务表现、资源用量与隐私暴露。",
  "results.caption": `<strong>主实验结果（论文表 2）。</strong>云端模型为 GLM-5.3，每个配置取 3 次运行的平均。Cloud Tok. (R/C/O) 为原始输入 / 缓存读取 / 输出 token（百万）；云成本单位为美元；端侧 FLOPs 单位为 PetaFLOPs。隐私暴露指对云端可见的标注敏感单元占比（越低越好）。以 DeepSeek-V4.1-Flash 为云端模型的结果见论文附录 A.8。`,

  "find.kicker": "关键发现",
  "find.h2": "三个研究问题，同一张图。",
  "find.lede": `所有配置都画在同一张图里。<strong>越靠上</strong>完成度越高；x 轴可在云成本与隐私暴露之间切换（两者都是<strong>越靠左</strong>越好）。虚线连接每个端侧模型的仅端侧点与仅云端点：位于虚线上方的点，优于两端按比例的简单混合。`,
  "find.xCost": "云成本",
  "find.xExposure": "隐私暴露",
  "find.edgeAll": "全部端侧",
  "find.f1tag": "RQ1 · 有效性",
  "find.f1h": "协同位于两端之间，且常常更优。",
  "find.f1p": `协同执行在完成度上优于仅端侧，同时相比仅云端显著减少对云端的依赖。在成本–性能与隐私–性能两个空间里，都有多个配置位于端云线性插值之上。`,
  "find.f2tag": "RQ2 · 端侧能力",
  "find.f2h": "端侧变强，缩小的是性能差距，而非隐私差距。",
  "find.f2p": `最优协同配置的完成度从 <strong>39.97</strong>（2B）升至 <strong>76.84</strong>（Qwen3.7-Plus），逼近仅云端的 82.70。各策略的完成度趋于一致，但隐私暴露仍高度依赖所选策略。`,
  "find.f3tag": "RQ3 · 协同方式转移",
  "find.f3h": "从路由器主导的执行，转向端侧主导的建议。",
  "find.f3p": `端侧较弱时，外部路由与云端直接执行占优；随着端侧能力增强，排序发生反转，更适合端侧自主调用、由云端<em>出主意</em>而非<em>直接动手</em>。`,
  "find.fig3cap": `<strong>RQ2：性能趋同，隐私不趋同。</strong>每个端侧模型下，各协同策略的均值（圆点）与范围（竖条）。(a) 完成度范围从 25.22 分（2B）收窄到 27B 与 Qwen3.7-Plus 的 5 分以内；(b) 隐私暴露的范围依然很宽（32.87–66.23 分）。`,
  "find.fig4cap": `<strong>RQ3：转移背后的端侧能力。</strong>(a) 端侧控制委托 vs. 相同云调用率的随机调用基线：2B 提升 +1.2，更强的端侧提升 +3.0 至 +4.4。(b) 在固定云端建议设置下，对 Qwen3.5-2B 做指令遵循强化学习，完成度从 24.8 升至 28.8，而仅端侧表现基本不变。`,
  "find.footnote": `结论：未来的端侧模型不仅要优化独立能力，还要优化<em>协同本身</em>，即判断何时调用云端，并用好云端返回的内容。由于性能趋同而暴露不趋同，隐私成为区分各协同策略的关键维度。`,

  "res.kicker": "资源与引用",
  "res.h2": "复现、扩展、引用。",
  "res.c1h": "代码与数据集",
  "res.c1p": "任务、可执行工作区、验证器、敏感信息标注与评测框架。",
  "res.c2h": "完整论文",
  "res.c2p": "问题形式化、任务构建、隐私标注与验证，以及完整的实证研究。",
  "res.c2go": "阅读 PDF",
  "res.copy": "复制",

  "authors.h": "作者",
  "authors.affil1": `<sup>1</sup> 东北大学，沈阳`,
  "authors.affil2": `<sup>2</sup> 清华大学，北京`,
  "authors.affil3": `<sup>3</sup> 中国移动在线服务有限公司，北京`,
  "authors.corr": `<span>*</span> 通讯作者`,

  "footer.tagline": "长程大模型智能体执行中的端云协同。"
};

/* JS-generated strings (both languages, since the source is JS not the DOM). */
const JS_STR = {
  en: {
    tipCompletion: "Completion", tipCost: "Cloud cost", tipExposure: "Privacy exp.",
    copied: "Copied!", copyFail: "Press Ctrl+C", copy: "Copy",
    axXcost: "Cloud cost (USD)  ·  left is cheaper",
    axXexposure: "Privacy exposure (%)  ·  left is more private",
    axY: "Completion (%)  ·  up is better",
    legEdge: "Edge-only", legCloud: "Cloud-only", legInterp: "Linear interp.",
    loadErr: m => `Couldn't load plot data (${m}). Open this page over http(s), or see Table 2 in the Main Results section.`
  },
  zh: {
    tipCompletion: "完成度", tipCost: "云成本", tipExposure: "隐私暴露",
    copied: "已复制！", copyFail: "请按 Ctrl+C", copy: "复制",
    axXcost: "云成本（美元） ·  越靠左越省",
    axXexposure: "隐私暴露（%） ·  越靠左越私密",
    axY: "完成度（%） ·  越靠上越好",
    legEdge: "仅端侧", legCloud: "仅云端", legInterp: "线性插值",
    loadErr: m => `图表数据加载失败（${m}）。请通过 http(s) 打开本页，或查看上方“主实验结果”中的表 2。`
  }
};

const METHOD_ZH = {
  "Edge-only": "仅端侧",
  "Cloud-only": "仅云端",
  "Query Routing": "查询路由",
  "Per-step Routing": "逐步路由",
  "Edge-Ctrl. Delegation": "端侧控制委托",
  "Edge-Ctrl. Advisory": "端侧控制建议"
};

function t(key) {
  const pack = JS_STR[currentLang] || JS_STR.en;
  return key in pack ? pack[key] : JS_STR.en[key];
}

function methodLabel(name) {
  return currentLang === "zh" && METHOD_ZH[name] ? METHOD_ZH[name] : name;
}

function applyLang(lang) {
  currentLang = lang;
  const root = document.documentElement;
  root.setAttribute("data-lang", lang);
  root.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");

  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (el.dataset.enHtml == null) el.dataset.enHtml = el.innerHTML;  // cache original EN
    if (lang === "zh") {
      const zh = I18N_ZH[el.dataset.i18n];
      el.innerHTML = zh != null ? zh : el.dataset.enHtml;
    } else {
      el.innerHTML = el.dataset.enHtml;
    }
  });

  document.title = lang === "zh"
    ? "EC²-Bench · 长程大模型智能体的端云协同基准"
    : "EC²-Bench · Edge-Cloud Collaboration for Long-Horizon LLM Agents";
  const lbl = document.getElementById("lang-toggle-label");
  if (lbl) lbl.textContent = lang === "zh" ? "EN" : "中文";

  try { localStorage.setItem("ec2bench-lang", lang); } catch (e) {}

  // Re-render JS-driven content in the new language.
  if (state.results && state.results.length) renderTradeoff();
}

function bindLangToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => applyLang(currentLang === "zh" ? "en" : "zh"));
}


/* Execution-family colors (edge = blue, cloud = red, collaboration = violet) */
const groupColors = {
  "Edge-only":  "#2563eb",
  "Edge-Cloud": "#7c3aed",
  "Cloud-only": "#dc2626"
};

/* Collaboration-strategy colors (plot points + legend) */
const methodColors = {
  "Query Routing":         "#e8820e",
  "Per-step Routing":      "#8b5cf6",
  "Edge-Ctrl. Delegation": "#1f9d57",
  "Edge-Ctrl. Advisory":   "#2f7fe0",
  "Edge-only":             "#2563eb",
  "Cloud-only":            "#dc2626"
};

const shortNames = {
  "Query Routing": "Query",
  "Per-step Routing": "Per-step",
  "Edge-Ctrl. Delegation": "Delegation",
  "Edge-Ctrl. Advisory": "Advisory"
};

const shortNamesZh = {
  "Query Routing": "查询路由",
  "Per-step Routing": "逐步路由",
  "Edge-Ctrl. Delegation": "委托",
  "Edge-Ctrl. Advisory": "建议"
};

/* Main cloud model per suite (anchor for the interpolation lines). */
const SUITE_CLOUD = { glm: "GLM-5.3", dsflash: "DeepSeek-v4.1-Flash" };

const EDGE_ORDER = ["Qwen3.5-2B", "Qwen3.5-9B", "Qwen3.5-27B", "Qwen3.7-Plus"];

function edgeShort(name) {
  if (!name) return "";
  if (name === "Qwen3.7-Plus") return "Plus";
  return name.replace(/^Qwen3\.\d+-/, "");
}

const format = {
  percent: value => `${Number(value).toFixed(2)}`,
  money: value => value === 0 ? "$0.00" : `$${Number(value).toFixed(2)}`
};

async function init() {
  // Wire up data-independent UI first so it works even if the fetch fails.
  bindActiveNavigation();
  bindCopyButtons();
  bindLangToggle();
  applyLang(currentLang);
  try {
    const response = await fetch(`data/results.json?v=${dataVersion}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.results = data.results || [];
    hydrateStats(data.metrics || {});
    bindControls();
    renderTradeoff();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderTradeoff, 120);
    });
  } catch (err) {
    const plot = document.querySelector(".plot-card");
    if (plot) {
      plot.insertAdjacentHTML("beforeend", `<p style="padding:12px 4px 0;color:var(--muted);font-size:14px">${t("loadErr")(err.message)}</p>`);
    }
  }
}

function hydrateStats(metrics) {
  const set = (id, value) => { const el = document.getElementById(id); if (el && value != null) el.textContent = value; };
  set("task-count", metrics.tasks);
  set("privacy-task-count", metrics.privacyAnnotatedTasks);
  set("unit-count", metrics.sensitivityUnits != null ? metrics.sensitivityUnits.toLocaleString("en-US") : null);
  set("strategy-count", metrics.collaborationStrategies);
}

function suiteRows() {
  return state.results.filter(item => item.suite === "both" || item.suite === state.suite);
}

function setSuite(suite) {
  state.suite = suite;
  syncTabs("#plot-suite-tabs", "suite", suite);
  renderTradeoff();
}

function bindControls() {
  document.querySelectorAll("#plot-x-tabs button[data-x]").forEach(button => {
    button.addEventListener("click", () => {
      state.xAxis = button.dataset.x;
      syncTabs("#plot-x-tabs", "x", state.xAxis);
      renderTradeoff();
    });
  });
  document.querySelectorAll("#plot-edge-tabs button[data-edge]").forEach(button => {
    button.addEventListener("click", () => {
      state.plotEdge = button.dataset.edge;
      syncTabs("#plot-edge-tabs", "edge", state.plotEdge);
      renderTradeoff();
    });
  });
  document.querySelectorAll("#plot-suite-tabs button[data-suite]").forEach(button => {
    button.addEventListener("click", () => setSuite(button.dataset.suite));
  });

  const canvas = document.getElementById("tradeoff-canvas");
  if (!canvas) return;
  canvas.addEventListener("mousemove", handlePlotHover);
  canvas.addEventListener("mouseleave", hideTooltip);
}

function bindCopyButtons() {
  document.querySelectorAll(".copy-btn[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const target = document.querySelector(btn.dataset.copy);
      if (!target) return;
      const text = target.textContent;
      let ok = true;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
        document.body.removeChild(ta);
      }
      const label = btn.querySelector("span");
      const prev = label ? label.textContent : "";
      if (label) label.textContent = ok ? t("copied") : t("copyFail");
      btn.classList.add("copied");
      setTimeout(() => {
        if (label) label.textContent = prev || t("copy");
        btn.classList.remove("copied");
      }, 1600);
    });
  });
}

function syncTabs(scope, attr, value) {
  document.querySelectorAll(`${scope} button[data-${attr}]`).forEach(button => {
    const isActive = button.dataset[attr] === value;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function bindActiveNavigation() {
  const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!navLinks.length || !sections.length) return;

  const setActive = id => {
    navLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${id}`;
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const updateActive = () => {
    const probeY = window.scrollY + Math.min(window.innerHeight * 0.42, 360);
    const current = sections.reduce((active, section) =>
      section.offsetTop <= probeY ? section : active, sections[0]);
    setActive(current.id);
  };

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("href").slice(1);
      if (target) setActive(target);
    });
  });

  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
}

/* ---------------------- Trade-off plot ---------------------- */

function niceStep(span, target) {
  const raw = span / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return step * mag;
}

function xValue(item) {
  return state.xAxis === "exposure" ? item.privacyExposure : item.cloudCost;
}

/* In cost mode, a secondary cloud-only baseline (e.g. DeepSeek-v4-Pro under the
   DeepSeek-V4.1-Flash setting) can sit far right of everything else; keep it out of
   the range and pin it to the right edge instead. */
function inRange(item) {
  return state.xAxis !== "cost" || item.group !== "Cloud-only" || item.cloudModel === SUITE_CLOUD[state.suite];
}

function plotRanges(rows) {
  const xs = rows.filter(inRange).map(xValue);
  const ys = rows.map(r => r.completion);
  const xMaxRaw = state.xAxis === "exposure" ? 100 : Math.max(...xs);
  const xStep = niceStep(xMaxRaw, 5);
  const xMax = Math.ceil(xMaxRaw / xStep) * xStep;
  const yStep = 10;
  const yMin = Math.max(0, Math.floor((Math.min(...ys) - 4) / yStep) * yStep);
  const yMax = Math.min(100, Math.ceil((Math.max(...ys) + 4) / yStep) * yStep);
  return { xMin: -xMax * 0.035, xMax: xMax * 1.02, xStep, xTop: xMax, yMin, yMax, yStep };
}

function renderTradeoff() {
  const canvas = document.getElementById("tradeoff-canvas");
  if (!canvas || !state.results.length) return;
  const ratio = window.devicePixelRatio || 1;

  // Display size tracks container width; logical size == display size (clean hover math)
  canvas.style.width = "100%";
  const displayW = canvas.getBoundingClientRect().width || 760;
  const W = Math.max(560, displayW);
  const H = Math.round(W * 0.62);
  canvas.style.height = `${H}px`;
  canvas.width = W * ratio;
  canvas.height = H * ratio;
  state.plotW = W;
  state.plotH = H;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const rows = suiteRows();
  const margin = { top: 56, right: 28, bottom: 64, left: 64 };
  const plot = { x: margin.left, y: margin.top, w: W - margin.left - margin.right, h: H - margin.top - margin.bottom };
  const R = plotRanges(rows);
  const pos = item => ({
    x: Math.min(plot.x + ((xValue(item) - R.xMin) / (R.xMax - R.xMin)) * plot.w, plot.x + plot.w - 10),
    y: plot.y + (1 - ((item.completion - R.yMin) / (R.yMax - R.yMin))) * plot.h
  });

  drawPlotFrame(ctx, plot, R);
  drawInterpolation(ctx, rows, pos);

  const radius = (W < 640) ? 12 : 14;
  const dimmed = item => state.plotEdge !== "all" && item.edgeModel && item.edgeModel !== state.plotEdge;
  // Draw dimmed points first so highlighted ones sit on top; cloud-only last.
  const order = [...rows].sort((a, b) =>
    (dimmed(b) - dimmed(a)) || ((a.group === "Cloud-only") - (b.group === "Cloud-only")));
  state.points = order.map(item => {
    const { x, y } = pos(item);
    drawPoint(ctx, x, y, radius, item, dimmed(item));
    return { x, y, radius, item };
  });

  drawCloudLabels(ctx, state.points);
  drawLegend(ctx, plot);
}

function drawPlotFrame(ctx, plot, R) {
  ctx.save();
  ctx.strokeStyle = "#eef2ee";
  ctx.fillStyle = "#8a958f";
  ctx.lineWidth = 1;
  ctx.font = "12px JetBrains Mono, ui-monospace, monospace";
  const sx = v => plot.x + ((v - R.xMin) / (R.xMax - R.xMin)) * plot.w;
  const sy = v => plot.y + (1 - ((v - R.yMin) / (R.yMax - R.yMin))) * plot.h;

  for (let v = 0; v <= R.xTop + 1e-9; v += R.xStep) {
    const x = sx(v);
    ctx.beginPath();
    ctx.moveTo(x, plot.y);
    ctx.lineTo(x, plot.y + plot.h);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText(state.xAxis === "exposure" ? `${v}%` : `$${v}`, x, plot.y + plot.h + 22);
  }

  ctx.textAlign = "right";
  for (let v = R.yMin; v <= R.yMax + 1e-9; v += R.yStep) {
    const y = sy(v);
    ctx.beginPath();
    ctx.moveTo(plot.x, y);
    ctx.lineTo(plot.x + plot.w, y);
    ctx.stroke();
    ctx.fillText(`${v}`, plot.x - 12, y + 4);
  }

  // Axis titles
  ctx.fillStyle = "#3c4742";
  ctx.font = "700 13px Inter, 'Noto Sans SC', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(state.xAxis === "exposure" ? t("axXexposure") : t("axXcost"), plot.x + plot.w / 2, plot.y + plot.h + 46);
  ctx.save();
  ctx.translate(18, plot.y + plot.h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(t("axY"), 0, 0);
  ctx.restore();
  ctx.restore();
}

/* Dashed line from each edge-only point to the suite's main cloud-only point. */
function drawInterpolation(ctx, rows, pos) {
  const cloud = rows.find(r => r.group === "Cloud-only" && r.cloudModel === SUITE_CLOUD[state.suite]);
  if (!cloud) return;
  const c = pos(cloud);
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 1.4;
  rows.filter(r => r.group === "Edge-only").forEach(edge => {
    const active = state.plotEdge === "all" || state.plotEdge === edge.edgeModel;
    const e = pos(edge);
    ctx.strokeStyle = active ? "rgba(60, 71, 66, 0.42)" : "rgba(60, 71, 66, 0.10)";
    ctx.beginPath();
    ctx.moveTo(e.x, e.y);
    ctx.lineTo(c.x, c.y);
    ctx.stroke();
  });
  ctx.restore();
}

function drawPoint(ctx, x, y, radius, item, dim) {
  ctx.save();
  ctx.globalAlpha = dim ? 0.16 : 1;
  const color = methodColors[item.method] || groupColors[item.group];
  if (item.group === "Cloud-only") {
    drawStar(ctx, x, y, radius + 4, color);
  } else if (item.group === "Edge-only") {
    const s = radius * 1.7;
    roundedRect(ctx, x - s / 2, y - s / 2, s, s, 5);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.globalAlpha = dim ? 0.16 : 0.95;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = dim ? 0.16 : 1;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }
  if (item.group !== "Cloud-only") {
    const label = edgeShort(item.edgeModel);
    ctx.fillStyle = item.group === "Edge-only" ? color : "#ffffff";
    ctx.font = `800 ${label.length > 3 ? 9.5 : 11}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 0.5);
  }
  ctx.restore();
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function drawStar(ctx, x, y, radius, color) {
  const spikes = 5;
  const outerRadius = radius;
  const innerRadius = radius * 0.46;
  let rotation = Math.PI / 2 * 3;
  ctx.beginPath();
  ctx.moveTo(x, y - outerRadius);
  for (let i = 0; i < spikes; i += 1) {
    ctx.lineTo(x + Math.cos(rotation) * outerRadius, y + Math.sin(rotation) * outerRadius);
    rotation += Math.PI / spikes;
    ctx.lineTo(x + Math.cos(rotation) * innerRadius, y + Math.sin(rotation) * innerRadius);
    rotation += Math.PI / spikes;
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

function drawCloudLabels(ctx, points) {
  ctx.save();
  ctx.font = "600 11.5px Inter, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(60, 71, 66, 0.82)";
  points.filter(p => p.item.group === "Cloud-only").forEach(({ item, x, y, radius }) => {
    const right = x > (state.plotW || 800) * 0.8;
    const label = inRange(item) ? item.cloudModel : `${item.cloudModel} (${format.money(item.cloudCost)}) →`;
    ctx.textAlign = right ? "right" : "left";
    ctx.fillText(label, right ? x - radius - 10 : x + radius + 10, y);
  });
  ctx.restore();
}

function drawLegend(ctx, plot) {
  ctx.save();
  let x = plot.x + 4;
  const y = 24;  // above the grid (in the top margin), not inside the plot area
  ctx.textBaseline = "middle";
  ctx.font = "700 11px Inter, 'Noto Sans SC', system-ui, sans-serif";
  const names = currentLang === "zh" ? shortNamesZh : shortNames;

  // Colour = collaboration strategy (filled points); label inside = edge model.
  ["Query Routing", "Per-step Routing", "Edge-Ctrl. Delegation", "Edge-Ctrl. Advisory"].forEach(method => {
    const label = names[method];
    ctx.beginPath();
    ctx.arc(x + 6, y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = methodColors[method];
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.fillStyle = "rgba(60, 71, 66, 0.9)";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 15, y);
    x += 15 + ctx.measureText(label).width + 14;
  });

  // Shape = single-side reference points.
  roundedRect(ctx, x + 1, y - 5, 10, 10, 2.5);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 1.6;
  ctx.setLineDash([2.5, 2.5]);
  ctx.strokeStyle = groupColors["Edge-only"];
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(60, 71, 66, 0.9)";
  ctx.fillText(t("legEdge"), x + 15, y);
  x += 15 + ctx.measureText(t("legEdge")).width + 14;

  drawStar(ctx, x + 6, y, 6, groupColors["Cloud-only"]);
  ctx.fillStyle = "rgba(60, 71, 66, 0.9)";
  ctx.fillText(t("legCloud"), x + 15, y);
  x += 15 + ctx.measureText(t("legCloud")).width + 14;

  ctx.strokeStyle = "rgba(60, 71, 66, 0.55)";
  ctx.lineWidth = 1.4;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 20, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillText(t("legInterp"), x + 26, y);

  ctx.restore();
}

function handlePlotHover(event) {
  const canvas = document.getElementById("tradeoff-canvas");
  const rect = canvas.getBoundingClientRect();
  const dispX = event.clientX - rect.left;
  const dispY = event.clientY - rect.top;
  // Map display px -> logical px (they differ below 560px where logical width is clamped).
  const sx = (state.plotW || rect.width) / rect.width;
  const sy = (state.plotH || rect.height) / rect.height;
  const mx = dispX * sx;
  const my = dispY * sy;
  // Last-drawn point is on top, so search from the end.
  const hit = [...state.points].reverse()
    .find(point => Math.hypot(mx - point.x, my - point.y) <= Math.max(point.radius, 13) + 3);
  if (!hit) { hideTooltip(); return; }
  const tooltip = document.getElementById("plot-tooltip");
  const item = hit.item;
  tooltip.style.display = "block";
  tooltip.style.left = `${Math.min(dispX + 16, rect.width - 230)}px`;
  tooltip.style.top = `${Math.max(dispY - 10, 8)}px`;
  tooltip.innerHTML = `
    <strong>${methodLabel(item.method)}</strong><br>
    <span style="opacity:.75">${item.model}</span><br>
    ${t("tipCompletion")}: ${format.percent(item.completion)}% &nbsp;·&nbsp; Pass³: ${format.percent(item.pass3)}%<br>
    ${t("tipCost")}: ${item.group === "Edge-only" ? "–" : format.money(item.cloudCost)} &nbsp;·&nbsp; ${t("tipExposure")}: ${format.percent(item.privacyExposure)}%
  `;
}

function hideTooltip() {
  const tooltip = document.getElementById("plot-tooltip");
  if (tooltip) tooltip.style.display = "none";
}

/* Scroll-triggered reveal: elements fade/slide in as they enter the viewport.
   Degrades gracefully — without JS or IntersectionObserver, content stays visible,
   because the hiding rule only applies to .reveal (added here) under html.js-reveal. */
function setupReveal() {
  const selectors = [
    ".section-head", ".tldr-card", ".metric-band", ".compare-shell", ".axis-card",
    ".taxonomy", ".problem-card", ".strategy-col", ".plot-card", ".finding", ".fig-pair",
    ".findings-footnote", ".table-shell", ".wide-figure",
    ".resource-card", ".citation-card", ".authors-block"
  ];
  const els = [];
  selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => {
    if (!els.includes(el)) els.push(el);
  }));
  if (!els.length) return;

  els.forEach(el => el.classList.add("reveal"));

  // Stagger siblings within the same parent so grids cascade in.
  const groupCount = new Map();
  els.forEach(el => {
    const parent = el.parentElement;
    const n = groupCount.get(parent) || 0;
    el.style.transitionDelay = `${Math.min(n * 70, 320)}ms`;
    groupCount.set(parent, n + 1);
  });

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }

  // Re-fire every time an element enters the viewport (and reset when it leaves),
  // so the float-in animation always plays, not just on first scroll.
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach(el => io.observe(el));
}

init();
setupReveal();
