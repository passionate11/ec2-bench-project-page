/* ============================================================
   EC²-Bench — page i18n + small UI behaviors
   (language toggle, BibTeX copy, active nav, scroll reveal)
   ============================================================ */

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
  "hero.lede": `当大模型智能体在本地工作区执行长程任务时，云端协助不再是一次性的路由决策，而是穿插在整条执行轨迹之中。<strong>EC²-Bench</strong> 在 128 个可执行任务上评估四种端云协同策略，同时衡量任务表现、资源用量与隐私暴露。`,
  "hero.s1": "可执行任务",
  "hero.s2": "隐私标注任务",
  "hero.s3": "敏感信息单元",
  "hero.s4": "协同策略",
  "hero.note": `端侧模型：Qwen3.5-2B / 9B / 27B、Qwen3.7-Plus · 云端模型：GLM-5.3 · 智能体框架：OpenClaw`,
  "hero.btnCode": "代码与数据",
  "hero.btnPaper": "论文 (PDF)",
  "hero.btnResults": "主实验结果",
  "hero.btnBibtex": "BibTeX",
  "hero.caption": `<strong>总览。</strong>一个代表性的长程工作流，端侧与云端智能体在同一条轨迹上交替参与；我们研究的四种协同策略，区别在于<em>由谁</em>决定云端何时加入、以及云端被调用后<em>做什么</em>；以及三个研究问题。`,

  "takeaways.kicker": "要点",
  "takeaways.h2": "核心要点",
  "takeaways.c1h": "端云协同对长程智能体有效",
  "takeaways.c1p": `只在部分时候引入云端，就能以很小的成本补回可观的能力：以 Qwen3.5-2B 为端侧时，逐步路由把完成度从 <strong>12.75 提升到 39.97</strong>，云成本只有仅云端的 <strong>22.7%</strong>。`,
  "takeaways.c2h": "端侧越强，性能趋同，隐私不趋同",
  "takeaways.c2p": `各策略之间的完成度差距从 <strong>25.22</strong> 分（Qwen3.5-2B）收窄到 <strong>4.76</strong> 分（Qwen3.7-Plus）。隐私暴露却没有趋同：以 Qwen3.7-Plus 为端侧时，各策略完成度只差 4.76 分，隐私暴露却相差 <strong>66.23</strong> 分。`,
  "takeaways.c3h": "最优协同方式随之转移",
  "takeaways.c3p": `端侧较弱时，最好由<strong>路由器</strong>把步骤交给云端执行（2B：逐步路由 39.97，端侧控制委托仅 15.86）；端侧变强后，最好由端侧<strong>自己</strong>决定何时调用云端，并只采纳它的<strong>建议</strong>（Qwen3.7-Plus：端侧控制建议 76.84）。`,
  "takeaways.c4h": "两项端侧能力是关键",
  "takeaways.c4p": `一是知道<strong>何时调用</strong>云端（端侧控制委托比相同调用率的随机调用基线最多高 +4.4）；二是<strong>用好云端的指导</strong>（指令遵循训练使建议模式下的完成度从 24.8 提升到 28.8）。`,


  "problem.kicker": "动机",
  "problem.h2": "从一次性路由，到穿插于轨迹的协同。",
  "problem.lede": `端侧设备运行小模型（通常 ≤10B 参数），数据留在本地，却难以胜任复杂的规划与工具使用；云端前沿大模型能力强得多，但成本高，而且能看到发给它的一切。以往的端云系统<em>每个查询只协调一次</em>。而在长程智能体执行中，云端会在轨迹的不同位置参与：每一次参与决策都会影响后续步骤、累积成本，并决定有多少工作区信息离开设备。`,
  "problem.c1tag": "仅端侧",
  "problem.c1h": "本地，但能力有限",
  "problem.c1p": `每个动作都由端侧模型生成。数据不出设备，但长程工作区任务很快就会撞上能力瓶颈。`,
  "problem.c1pillA": "0% 暴露",
  "problem.c1pillB": "完成度 12.75%（2B）",
  "problem.c2tag": "仅云端",
  "problem.c2h": "强大，但暴露",
  "problem.c2p": `前沿大模型执行每一步，完成的任务最多，但大部分敏感的工作区数据都会到达云端，成本也最高。`,
  "problem.c2pillA": "完成度 82.70%",
  "problem.c2pillB": "暴露 87.01%",
  "problem.c3tag": `以往基准`,
  "problem.c3h": `只评查询，不评轨迹`,
  "problem.c3p": `RouterBench、M4A1 等只对单个查询或单轮对话做路由，整条智能体轨迹上累积的成本与泄露没有被度量。`,
  "problem.c3pill": "需要轨迹级评估",
  "problem.rqH": `我们提出三个研究问题`,
  "problem.rq1": `端云协同在真实的长程智能体执行中是否依然有效？`,
  "problem.rq2": `端侧能力的提升如何影响端云协同执行？`,
  "problem.rq3": `随着端侧能力的提升，端云协同应如何演进？`,

  "bench.kicker": "基准",
  "bench.h2": "EC²-Bench：在整条轨迹上评估端云协同。",
  "bench.lede": `EC²-Bench（<strong>E</strong>dge–<strong>C</strong>loud <strong>C</strong>ollaborative Agent Benchmark，端云协同智能体基准）。128 个可执行的数字工作区任务，改编自六个智能体基准并新建了 7 个，统一在 OpenClaw 运行时中执行，并经过筛选，确保仅端侧、仅云端与协同执行之间确实会拉开差距。每次运行都记录云端在每一步看到的内容；其中 100 个任务带有细粒度敏感信息标注，用于审计隐私暴露。`,
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
  "bench.cmpH": `EC²-Bench 与以往基准的区别`,

  "strat.kicker": "所评估的协同策略",
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
  "strat.s3when": `执行前一次`,
  "strat.s4tag": "逐步路由",
  "strat.s4p": "每一步生成前，依据端侧模型下一个 token 的熵（GlimpRouter 风格）决定这一步由端侧还是云端生成。",
  "strat.s4when": `每一步`,
  "strat.col3": `端侧控制 <small>由端侧智能体决定</small>`,
  "strat.s5tag": "端侧控制的云端委托",
  "strat.s5p": "默认在端侧执行。端侧智能体通过委托工具把当前步交给云端，由云端生成下一个动作，随后控制权交回端侧。",
  "strat.s5when": `端侧请求时`,
  "strat.s6tag": "端侧控制的云端建议",
  "strat.s6p": "默认在端侧执行。端侧智能体向云端请求计划、建议或纠错，然后自己生成动作。",
  "strat.s6when": `端侧请求时`,
  "strat.roleExec": `云端执行`,
  "strat.roleAdv": `云端建议`,

  "results.kicker": "主实验结果",
  "results.h2": "所有配置的主实验结果。",
  "results.caption": `<strong>主实验结果（论文表 2）。</strong>云端模型为 GLM-5.3，每个配置取 3 次运行的平均。Cloud Tok. (R/C/O) 为原始输入 / 缓存读取 / 输出 token（百万）；云成本单位为美元；端侧 FLOPs 单位为 PetaFLOPs。隐私暴露指对云端可见的标注敏感单元占比（越低越好）。以 DeepSeek-V4.1-Flash 为云端模型的结果见论文附录 A.8。`,

  "find.kicker": "关键发现",
  "find.h2": "三个研究问题的答案。",
  "find.lede": `每个研究问题都配有论文中对应的图。`,
  "find.f1tag": "RQ1 · 有效性",
  "find.f1q": `端云协同在长程智能体执行中是否依然有效？`,
  "find.f1h": `是。协同位于两个端点之间，而且常常优于两者。`,
  "find.f1p": `仅云端表现最好，但云成本与隐私暴露最高；仅端侧两者皆无，却牺牲了表现。协同填补了两者之间的空间：以 Qwen3.5-2B 为端侧时，逐步路由把完成度从 12.75 提升到 39.97，云成本只有仅云端的 22.7%。多个配置位于仅端侧与仅云端的连线（虚线）之上，即优于两者的按比例混合。`,
  "find.f2tag": "RQ2 · 端侧能力",
  "find.f2q": `端侧能力的提升如何影响协同执行？`,
  "find.f2h": "端侧变强，缩小的是性能差距，而非隐私差距。",
  "find.f2p": `最优协同配置的完成度从 <strong>39.97</strong>（2B）升至 <strong>76.84</strong>（Qwen3.7-Plus），接近仅云端的 82.70；各策略之间的完成度差距也从 25.22 分收窄到 4.76 分。隐私暴露却没有趋同：以 Qwen3.7-Plus 为端侧时，各策略完成度只差 4.76 分，隐私暴露却相差 66.23 分。`,
  "find.f3tag": "RQ3 · 协同方式转移",
  "find.f3q": `随着端侧能力的提升，端云协同应如何演进？`,
  "find.f3h": `从路由器控制的云端执行，转向端侧控制的云端建议。`,
  "find.f3p": `以 Qwen3.5-2B 为端侧时，外部路由策略占优（逐步路由 39.97，端侧控制委托仅 15.86），且让云端<em>执行</em>优于让云端<em>建议</em>。随着端侧能力增强，这两个排序都发生反转：从 9B 起，端侧控制建议表现最好，在 Qwen3.7-Plus 上达到 76.84。这一转变背后是两项端侧能力：判断<strong>何时</strong>调用云端，以及<strong>用好</strong>云端的指导。`,
  "find.fig2cap": `<strong>图 2.</strong> 以 GLM-5.3 为云端时 Qwen3.5-2B（绿）与 Qwen3.5-9B（蓝）的权衡：(a) 云成本–完成度，(b) 隐私暴露–完成度。方块为仅端侧，圆点为四种协同策略，星形为仅云端；越靠左上越好。`,
  "find.fig3cap": `<strong>图 3.</strong> 每个端侧模型下，各协同策略的均值（圆点）与范围（竖条）。(a) 完成度范围从 25.22 分（Qwen3.5-2B）收窄到 4.76 分（Qwen3.7-Plus）；(b) 隐私暴露的范围依然很宽，在 Qwen3.7-Plus 上达到 66.23 分。`,
  "find.fig4cap": `<strong>图 4.</strong> (a) 端侧控制委托 vs. 相同云调用率的随机调用基线：2B 提升 +1.2，更强的端侧提升 +3.0 至 +4.4。(b) 在固定云端建议设置下，对 Qwen3.5-2B 做指令遵循强化学习，完成度从 24.8 升至 28.8，而仅端侧表现基本不变。`,
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
  en: { copied: "Copied!", copyFail: "Press Ctrl+C", copy: "Copy" },
  zh: { copied: "已复制！", copyFail: "请按 Ctrl+C", copy: "复制" }
};

function t(key) {
  const pack = JS_STR[currentLang] || JS_STR.en;
  return key in pack ? pack[key] : JS_STR.en[key];
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

}

function bindLangToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => applyLang(currentLang === "zh" ? "en" : "zh"));
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
      if (label) label.textContent = ok ? t("copied") : t("copyFail");
      btn.classList.add("copied");
      setTimeout(() => {
        if (label) label.textContent = t("copy");
        btn.classList.remove("copied");
      }, 1600);
    });
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

/* Scroll-triggered reveal: elements fade/slide in as they enter the viewport.
   Degrades gracefully — without JS or IntersectionObserver, content stays visible,
   because the hiding rule only applies to .reveal (added here) under html.js-reveal. */
function setupReveal() {
  const selectors = [
    ".section-head", ".tldr-card", ".hstat", ".compare-shell", ".axis-card",
    ".taxonomy", ".problem-card", ".rq-items li", ".strategy-col", ".rq-row",
    ".findings-footnote", ".wide-figure",
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

bindActiveNavigation();
bindCopyButtons();
bindLangToggle();
applyLang(currentLang);
setupReveal();
