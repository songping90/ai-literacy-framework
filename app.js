/* 中小學 AI 素養框架：路由與畫面 */
(function () {
  "use strict";
  const DATA = window.AILIT;
  const RM = matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (s, r) => (r || document).querySelector(s);
  const app = $("#app"), pop = $("#pop");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 無痕或封鎖時略過 */ } },
  };

  const UI = {
    zh: {
      brandT: "中小學 AI 素養框架", brandS: "OECD × 歐盟・2026", other: "EN",
      rail: [["", "🏠", "首頁", "回到首頁"], ["domains", "🧭", "領域", "領域與素養能力"], ["ksa", "📚", "知識技能<br>態度", "知識・技能・態度"], ["matrix", "📊", "總表", "對照總表"]],
      railPrint: ["🖨️", "列印", "列印本頁"], railTheme: ["🌗", "深淺", "切換深淺色"], railLang: "切換成英文",
      nav: [["", "首頁"], ["domains", "領域與素養能力"], ["ksa", "知識・技能・態度"], ["matrix", "對照總表"]],
      kick: "OECD × 歐盟・2026", h1: '賦能學習者迎向 <span class="ai">AI</span> 時代', sub: "中小學 AI 素養框架",
      defT: "AI 素養的定義", cta1: "看四個領域", cta2: "開啟對照總表",
      stats: ["個領域", "項素養能力", "條知識", "項技能", "種態度", "個進程等級"],
      domainsH: "四個領域", domainsSub: "依序呈現，代表一種可能的學習方式",
      structH: "框架如何組成", kT: "知識", sT: "技能", aT: "態度",
      kD: "4 個主題、17 條陳述", sD: "7 項應用於 AI 情境的人類能力", aD: "6 種面對 AI 的心態",
      compsWord: "項素養能力", see: "看詳細 →",
      domPage: "領域與素養能力", lvAll: "三級並列", dIntro: "領域介紹", howRead: "關於素養能力與學習者期望", prev: "上一項", next: "下一項", lvLabel: "顯示等級",
      exp: "學習者期望", scn: "課堂應用",
      tK: "知識", tS: "技能", tA: "態度",
      ksaPage: "知識・技能・態度", side: "延伸閱讀",
      gq: "引導問題", elab: "展開說明", usedby: "對應素養能力：",
      mxPage: "對照總表", mxLead: "依領域、知識、技能、態度與等級篩選全部 19 項素養能力。",
      fD: "領域", fK: "知識", fS: "技能", fA: "態度", fL: "等級", all: "全部", print: "列印", rows: "項",
      cols: ["編號", "領域", "素養能力", "知識", "技能", "態度"],
      gotoK: "到知識頁查看", home: "首頁",
      foot: [
        '<b class="copy">© 2026 陳佩英教授計畫團隊</b>引用時請註明出處；轉載或改作請先徵得計畫團隊同意。',
        '框架內容出處：OECD / European Union (2026). <i>Empowering learners for the age of AI: An AI literacy framework for primary and secondary education.</i> OECD Publishing, Paris. <a href="https://doi.org/10.1787/65cd27d4-en" target="_blank" rel="noopener">https://doi.org/10.1787/65cd27d4-en</a>。依 <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> 授權使用，本站版面為重新編排。',
      ],
    },
    en: {
      brandT: "AI Literacy Framework", brandS: "OECD × European Union · 2026", other: "中文",
      rail: [["", "🏠", "Home", "Home"], ["domains", "🧭", "Domains", "Domains & Competences"], ["ksa", "📚", "KSA", "Knowledge · Skills · Attitudes"], ["matrix", "📊", "Table", "Overview Table"]],
      railPrint: ["🖨️", "Print", "Print this page"], railTheme: ["🌗", "Theme", "Toggle light / dark"], railLang: "Switch to Chinese",
      nav: [["", "Home"], ["domains", "Domains & Competences"], ["ksa", "Knowledge · Skills · Attitudes"], ["matrix", "Overview Table"]],
      kick: "OECD × European Union · 2026", h1: 'Empowering Learners for the Age of <span class="ai">AI</span>', sub: "An AI Literacy Framework for Primary and Secondary Education",
      defT: "Definition of AI Literacy", cta1: "Explore the four domains", cta2: "Open the overview table",
      stats: ["Domains", "Competences", "Knowledge statements", "Skills", "Attitudes", "Levels"],
      domainsH: "Four Domains", domainsSub: "Presented sequentially to reflect a potential learning approach",
      structH: "How the Framework Fits Together", kT: "Knowledge", sT: "Skills", aT: "Attitudes",
      kD: "4 themes, 17 statements", sD: "7 human skills applied to an AI context", aD: "6 mindsets for approaching AI",
      compsWord: "competences", see: "See details →",
      domPage: "Domains & Competences", lvAll: "All levels", dIntro: "About this domain", howRead: "About competences and learner expectations", prev: "Previous", next: "Next", lvLabel: "Show level",
      exp: "Learner Expectation", scn: "In the Classroom",
      tK: "Knowledge", tS: "Skills", tA: "Attitudes",
      ksaPage: "Knowledge · Skills · Attitudes", side: "Sidebar",
      gq: "Guiding questions", elab: "Read more", usedby: "Used in competences: ",
      mxPage: "Overview Table", mxLead: "Filter all 19 competences by domain, knowledge, skill, attitude and level.",
      fD: "Domain", fK: "Knowledge", fS: "Skill", fA: "Attitude", fL: "Level", all: "All", print: "Print", rows: "competences",
      cols: ["Code", "Domain", "Competence", "Knowledge", "Skills", "Attitudes"],
      gotoK: "View on Knowledge page", home: "Home",
      foot: [
        '<b class="copy">© 2026 Professor Pei-Ying Chen’s Project Team</b>Please cite the source when quoting; obtain the project team’s permission before republishing or adapting this site’s content.',
        'Framework source: OECD / European Union (2026). <i>Empowering learners for the age of AI: An AI literacy framework for primary and secondary education.</i> OECD Publishing, Paris. <a href="https://doi.org/10.1787/65cd27d4-en" target="_blank" rel="noopener">https://doi.org/10.1787/65cd27d4-en</a>. Used under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>; layout adapted for this site.',
      ],
    },
  };

  let lang = "zh";
  let level = -1; // -1 = 三級並列
  const D = () => DATA[lang], T = () => UI[lang];
  const skillName = (key) => (D().skills.find((s) => s.key === key) || { name: key }).name;
  const attName = (key) => (D().attitudes.find((a) => a.key === key) || { name: key }).name;
  const allComps = () => D().domains.flatMap((d) => d.comps.map((c) => Object.assign({ d }, c)));
  const kText = (code) => (D().knowledge.find((k) => k.code === code) || {}).text || "";
  const link = (p) => "#/" + lang + "/" + p;

  /* ---------- 共用片段 ---------- */
  function tagRow(c) {
    const t = T();
    const k = c.k.map((x) => `<button class="tbtn kc" type="button" data-k="${x}">${x}</button>`).join("");
    const s = c.s.map((x) => `<button class="tbtn sc" type="button" data-s="${esc(x)}">${esc(skillName(x))}</button>`).join("");
    const a = c.a.map((x) => `<button class="tbtn ac" type="button" data-a="${esc(x)}">${esc(attName(x))}</button>`).join("");
    return `<div class="tags"><span class="tg"><span class="tl">${t.tK}</span>${k}</span><span class="tg"><span class="tl">${t.tS}</span>${s}</span><span class="tg"><span class="tl">${t.tA}</span>${a}</span></div>`;
  }
  function bars(i) { return `<span class="bar">${[0, 1, 2].map((j) => `<i class="${j <= i ? "f" : ""}"></i>`).join("")}</span>`; }

  /* ---------- 首頁 ---------- */
  function home() {
    const d = D(), t = T();
    const counts = [d.domains.length, allComps().length, d.knowledge.length, d.skills.length, d.attitudes.length, d.levels.length];
    const cols = ["d1", "d2", "d3", "d4", "d1", "d2"];
    const tile = (dm, cls) => `<a class="ptile tilt d${dm.n} ${cls || ""}" href="${link("domains/" + dm.n)}"><span class="cnt">${dm.comps.length}</span><span class="no">${dm.n}</span><b>${esc(dm.name)}${dm.short ? `<small style="display:inline;margin-left:6px">${esc(dm.short)}</small>` : ""}</b><small>${esc(dm.tagline)}</small></a>`;
    const [d1, d2, d3, d4] = d.domains;
    app.innerHTML = `
    <section class="hero"><div class="wrap">
      <div>
        <span class="kick">${t.kick}</span>
        <h1>${t.h1}</h1>
        <p class="sub">${t.sub}</p>
        <div class="defcard"><b>${t.defT}</b><p>${esc(d.definition)}</p></div>
        <div class="cta-row"><a class="playbtn" href="${link("domains")}">${t.cta1}</a><a class="ghostbtn" href="${link("matrix")}">${t.cta2}</a></div>
      </div>
      <div class="pyramid" aria-label="${t.domainsH}">
        ${tile(d4, "top")}
        <div class="conn" data-conn="merge" aria-hidden="true"></div>
        <div class="row two">${tile(d2)}${tile(d3)}</div>
        <div class="conn" data-conn="split" aria-hidden="true"></div>
        ${tile(d1)}
      </div>
    </div></section>
    <section class="block"><div class="wrap"><div class="stats">
      ${counts.map((n, i) => `<div class="stat ${cols[i]}"><b data-count="${n}">${n}</b><span>${t.stats[i]}</span></div>`).join("")}
    </div></div></section>
    <section class="block"><div class="wrap">
      <div class="sec-h"><h2>${t.domainsH}</h2><span class="sub">${t.domainsSub}</span></div>
      <div class="grid g2">${d.domains.map((dm) => `
        <a class="card tilt d${dm.n}" href="${link("domains/" + dm.n)}">
          <span class="chip">${dm.n}｜${dm.comps.length} ${t.compsWord}</span>
          <h3>${esc(dm.name)}${dm.short ? `（${esc(dm.short)}）` : ""}</h3>
          <p><b>${esc(dm.tagline)}</b></p>
          <blockquote class="q">${esc(dm.quote)}<cite>${esc(dm.quoteBy)}</cite></blockquote>
          <p style="margin-top:10px"><span class="more">${t.see}</span></p>
        </a>`).join("")}</div>
    </div></section>
    <section class="block"><div class="wrap">
      <div class="sec-h"><h2>${t.structH}</h2></div>
      <p class="intro">${esc(d.compIntro)}</p>
      <div class="grid g3">
        <a class="card tilt kc" href="${link("ksa")}#k"><span class="chip">${d.knowledge.length}</span><h3>${t.kT}</h3><p>${t.kD}</p><span class="more">${t.see}</span></a>
        <a class="card tilt sc" href="${link("ksa")}#s"><span class="chip">${d.skills.length}</span><h3>${t.sT}</h3><p>${t.sD}</p><span class="more">${t.see}</span></a>
        <a class="card tilt ac" href="${link("ksa")}#a"><span class="chip">${d.attitudes.length}</span><h3>${t.aT}</h3><p>${t.aD}</p><span class="more">${t.see}</span></a>
      </div>
    </div></section>`;
    drawConns(); countUp();
  }

  /* 結構圖連線：由下往上流動的虛線與小圓點 */
  function drawConns() {
    document.querySelectorAll(".conn").forEach((el) => {
      const W = el.clientWidth, H = el.clientHeight; if (!W) return;
      const cL = (W - 12) / 4, cR = W - cL, m = W / 2;
      const split = el.dataset.conn === "split";
      const paths = split
        ? [[`M${m} ${H} C${m} ${H / 2},${cL} ${H / 2},${cL} 0`, "d2"], [`M${m} ${H} C${m} ${H / 2},${cR} ${H / 2},${cR} 0`, "d3"]]
        : [[`M${cL} ${H} C${cL} ${H / 2},${m} ${H / 2},${m} 0`, "d4"], [`M${cR} ${H} C${cR} ${H / 2},${m} ${H / 2},${m} 0`, "d4"]];
      el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${paths.map(([d, c], i) =>
        `<path d="${d}"/><circle r="4.5" class="${c}" style="fill:var(--c)"><animateMotion dur="2.2s" begin="${i * 0.5}s" repeatCount="indefinite" path="${d}"/></circle>`).join("")}</svg>`;
    });
  }
  /* 數字條：捲進畫面才從 0 累加（以 setTimeout 推進，背景分頁節流時仍會停在正確數字） */
  function countUp() {
    const els = [...document.querySelectorAll("[data-count]")];
    if (!els.length || RM.matches) return;
    const run = (el) => {
      if (el.dataset.done) return; el.dataset.done = 1;
      const n = +el.dataset.count, t0 = Date.now(), dur = 900;
      el.textContent = "0";
      const step = () => { const p = Math.min(1, (Date.now() - t0) / dur); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) setTimeout(step, 30); };
      step();
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- 領域與素養能力 ---------- */
  function levelsHTML(c) {
    const t = T(), d = D(), idx = level < 0 ? [0, 1, 2] : [level];
    return idx.map((i) => `
        <div class="lv"><h4>${bars(i)}${esc(d.levels[i])}</h4>
          <p class="exp">${esc(c.exp[i])}</p>
          <div class="scn"><b>${t.scn}</b>${esc(c.sc[i])}</div></div>`).join("");
  }
  function placeSeg(instant) {
    const seg = document.getElementById("lvseg"); if (!seg) return;
    const on = seg.querySelector("button.on"), ind = seg.querySelector(".seg-ind");
    if (!on || !ind) return;
    if (instant) ind.style.transition = "none";
    ind.style.left = on.offsetLeft + "px"; ind.style.width = on.offsetWidth + "px";
    if (instant) { void ind.offsetWidth; ind.style.transition = ""; }
  }
  /* 寬螢幕：左清單＋右內容；窄螢幕：折疊卡片 */
  const WIDE = matchMedia("(min-width: 1000px)");
  let selCode = "1.1";
  function compBody(c) {
    return `${tagRow(c)}
      <div class="levels ${level < 0 ? "" : "one"}">${levelsHTML(c)}</div>`;
  }
  function domIntro(dm, open) {
    const t = T();
    return `<details class="dintro d${dm.n}" ${open ? "open" : ""}><summary>${t.dIntro}</summary>
      <p class="desc">${esc(dm.desc)}</p>
      <blockquote class="q">${esc(dm.quote)}<cite>${esc(dm.quoteBy)}</cite></blockquote></details>`;
  }
  function detailHTML(code, dir) {
    const t = T(), list = allComps(), i = list.findIndex((c) => c.code === code), c = list[i], dm = c.d;
    const prev = list[i - 1], next = list[i + 1];
    const nav = (x, cls, arrow) => x
      ? `<button type="button" class="pn ${cls} d${x.d.n}" data-sel="${x.code}"><small>${arrow === "←" ? "← " + t.prev : t.next + " →"}</small><span><b>${x.code}</b> ${esc(x.statement)}</span></button>`
      : `<span class="pn ${cls} empty"></span>`;
    return `<div class="dhead d${dm.n}"><span class="no">${dm.n}</span><div><b>${esc(dm.name)}${dm.short ? `<small>${esc(dm.short)}</small>` : ""}</b><span>${esc(dm.tagline)}</span></div><span class="pos">${i + 1} / ${list.length}</span></div>
      ${domIntro(dm, false)}
      <article class="comp d${dm.n} ${dir && !RM.matches ? "enter-" + dir : ""}" data-code="${c.code}">
        <div class="comp-h"><div class="code">${c.code}</div><div><div class="lbl">${esc(c.label)}</div><h3>${esc(c.statement)}</h3></div></div>
        ${compBody(c)}
      </article>
      <div class="pnrow">${nav(prev, "prev", "←")}${nav(next, "next", "→")}</div>`;
  }
  function select(code, dir) {
    const list = allComps(); if (!list.some((c) => c.code === code)) return;
    selCode = code;
    const det = document.getElementById("mdDetail"); if (!det) return;
    det.innerHTML = detailHTML(code, dir);
    document.querySelectorAll("#mdList [data-sel]").forEach((a) => {
      const on = a.dataset.sel === code; a.classList.toggle("on", on); a.toggleAttribute("aria-current", on);
      if (on) { const L = document.getElementById("mdList"), r = a.getBoundingClientRect(), lr = L.getBoundingClientRect();
        if (r.top < lr.top || r.bottom > lr.bottom) L.scrollTop += r.top - lr.top - lr.height / 3; }
    });
    const dn = code.split(".")[0];
    document.querySelectorAll(".stickybar .pill").forEach((p) => p.classList.toggle("on", p.dataset.dom === dn));
    history.replaceState(null, "", "#/" + lang + "/domains#c" + code);
    const top = 66 + document.querySelector(".stickybar").offsetHeight;
    const g = document.getElementById("md"); const gt = g.getBoundingClientRect().top;
    if (gt < top - 2) window.scrollTo({ top: window.scrollY + gt - top, behavior: "instant" });
  }
  function openAcc(code, scroll) {
    const it = document.querySelector(`.acc[data-code="${code}"]`); if (!it) return;
    it.classList.add("open"); it.querySelector(".acc-h").setAttribute("aria-expanded", "true");
    if (scroll) jump("a" + code);
  }
  function domains(focus) {
    const d = D(), t = T(), wide = WIDE.matches;
    if (focus && /^c\d\.\d$/.test(focus)) selCode = focus.slice(1);
    else if (focus && /^d\d$/.test(focus)) selCode = focus.slice(1) + ".1";
    const head = `
    <div class="pagehead"><div class="wrap">
      <div class="crumb"><a href="${link("")}">${t.home}</a> ／ ${t.domPage}</div>
      <h1>${t.domPage}</h1>
      <details class="leadmore"><summary>${t.howRead}</summary><p class="lead">${esc(d.compIntro)}</p></details>
    </div></div>
    <div class="stickybar"><div class="wrap">
      <div class="pills">${d.domains.map((dm) => `<button type="button" class="pill d${dm.n}" data-dom="${dm.n}">${dm.n}　${esc(dm.name)}</button>`).join("")}</div>
      <span class="seg-l">${t.lvLabel}</span>
      <div class="seg" id="lvseg"><i class="seg-ind"></i>${[t.lvAll].concat(d.levels).map((l, i) => `<button type="button" data-lv="${i - 1}" class="${level === i - 1 ? "on" : ""}">${esc(l)}</button>`).join("")}</div>
    </div></div>`;
    if (wide) {
      app.innerHTML = head + `
      <div class="wrap md" id="md">
        <nav class="mdlist" id="mdList" aria-label="${t.domPage}">${d.domains.map((dm) => `
          <div class="mdgrp d${dm.n}"><div class="mdg-h"><span class="no">${dm.n}</span>${esc(dm.name)}</div>
            ${dm.comps.map((c) => `<a href="#c${c.code}" data-sel="${c.code}" class="d${dm.n}"><b>${c.code}</b><span>${esc(c.statement)}</span></a>`).join("")}
          </div>`).join("")}</nav>
        <section class="mddetail" id="mdDetail" aria-live="polite"></section>
      </div>`;
      select(selCode);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      app.innerHTML = head + `
      <div class="wrap" id="acclist">${d.domains.map((dm) => `
        <section class="block accgrp" id="d${dm.n}">
          <div class="dhead d${dm.n}"><span class="no">${dm.n}</span><div><b>${esc(dm.name)}${dm.short ? `<small>${esc(dm.short)}</small>` : ""}</b><span>${esc(dm.tagline)}</span></div></div>
          ${domIntro(dm, false)}
          ${dm.comps.map((c) => `<div class="acc d${dm.n}" id="a${c.code}" data-code="${c.code}">
            <button type="button" class="acc-h" aria-expanded="false"><span class="code">${c.code}</span><span class="st">${esc(c.statement)}</span><span class="chev" aria-hidden="true">⌄</span></button>
            <div class="acc-b"><div class="acc-in">${compBody(c)}</div></div>
          </div>`).join("")}
        </section>`).join("")}</div>`;
      if (focus && /^c\d\.\d$/.test(focus)) openAcc(focus.slice(1), true);
      else if (focus) jump(focus);
    }
    placeSeg(true);
    const stick = app.querySelector(".stickybar");
    stick.addEventListener("click", (e) => {
      const p = e.target.closest("[data-dom]");
      if (p) { if (WIDE.matches) select(p.dataset.dom + ".1"); else jump("d" + p.dataset.dom); return; }
      const b = e.target.closest("button[data-lv]"); if (!b) return;
      const next = +b.dataset.lv; if (next === level) return;
      const dir = next > level ? "slide-r" : "slide-l";
      const top = 66 + stick.offsetHeight;
      const anchor = [...document.querySelectorAll("[data-code]")].find((el) => el.getBoundingClientRect().bottom > top + 20);
      const before = anchor ? anchor.getBoundingClientRect().top : 0;
      level = next; store.set("ailit-level", String(level));
      document.querySelectorAll("#lvseg button").forEach((x) => x.classList.toggle("on", x === b));
      placeSeg();
      const byCode = Object.fromEntries(allComps().map((c) => [c.code, c]));
      document.querySelectorAll("[data-code]").forEach((el) => {
        const lv = el.querySelector(".levels"); if (!lv) return;
        lv.className = "levels " + (level < 0 ? "" : "one ") + (RM.matches ? "" : dir);
        lv.innerHTML = levelsHTML(byCode[el.dataset.code]);
      });
      if (anchor && !WIDE.matches) window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: "instant" });
    });
    app.querySelector(wide ? "#md" : "#acclist").addEventListener("click", (e) => {
      const s = e.target.closest("[data-sel]");
      if (s) { e.preventDefault(); const list = allComps().map((c) => c.code);
        select(s.dataset.sel, list.indexOf(s.dataset.sel) > list.indexOf(selCode) ? "r" : "l"); return; }
      const h = e.target.closest(".acc-h");
      if (h) { const it = h.parentElement, open = !it.classList.contains("open");
        it.classList.toggle("open", open); h.setAttribute("aria-expanded", String(open)); }
    });
  }
  /* 鍵盤左右鍵切換上一項／下一項（寬螢幕） */
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("mdDetail") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test((e.target.tagName || ""))) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const list = allComps().map((c) => c.code), i = list.indexOf(selCode);
    const j = e.key === "ArrowRight" ? i + 1 : i - 1;
    if (j >= 0 && j < list.length) { e.preventDefault(); select(list[j], e.key === "ArrowRight" ? "r" : "l"); }
  });
  /* 跨越斷點時改用另一種版面 */
  WIDE.addEventListener("change", () => { if (document.getElementById("lvseg")) domains("c" + selCode); });

  /* ---------- 知識・技能・態度 ---------- */
  function ksa(focus) {
    const d = D(), t = T(), comps = allComps();
    const used = (pred) => comps.filter(pred).map((c) => `<a href="${link("domains")}#c${c.code}" class="dlink d${c.d.n}">${c.code}</a>`).join(lang === "en" ? ", " : "、");
    const themes = Object.keys(d.themes);
    app.innerHTML = `
    <div class="pagehead"><div class="wrap">
      <div class="crumb"><a href="${link("")}">${t.home}</a> ／ ${t.ksaPage}</div>
      <h1>${t.ksaPage}</h1>
    </div></div>
    <div class="stickybar"><div class="wrap"><div class="pills">
      <a class="pill kc" href="#k" data-jump="k">${t.kT}</a><a class="pill sc" href="#s" data-jump="s">${t.sT}</a><a class="pill ac" href="#a" data-jump="a">${t.aT}</a>
    </div></div></div>
    <div class="wrap">
      <section class="block kc" id="k"><div class="sec-h"><h2>${t.kT}</h2><span class="sub">${t.kD}</span></div>
        <p class="intro">${esc(d.kIntro)}</p>
        ${themes.map((th) => `<div class="kgrp kc"><h3><span class="n">${th}</span>${esc(d.themes[th])}</h3>
          ${d.knowledge.filter((k) => k.theme === th).map((k) => `<div class="kitem kc" id="k${k.code}"><span class="k">${k.code}</span><div><p>${esc(k.text)}</p>
            <div class="usedby">${t.usedby}${used((c) => c.k.includes(k.code)) || "－"}</div></div></div>`).join("")}</div>`).join("")}
        <aside class="side"><h4>${esc(d.sidebar.title)}</h4><p>${esc(d.sidebar.text)}</p></aside>
      </section>
      <section class="block sc" id="s"><div class="sec-h"><h2>${t.sT}</h2><span class="sub">${t.sD}</span></div>
        <p class="intro">${esc(d.sIntro)}</p>
        <div class="grid g2">${d.skills.map((s) => `<div class="card sc" id="s-${s.key.replace(/\s/g, "")}">
          <h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p>
          <ul class="qs">${s.qs.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
          <details class="el"><summary>${t.elab}</summary><p>${esc(s.elab)}</p></details>
          <div class="usedby">${t.usedby}${used((c) => c.s.includes(s.key))}</div></div>`).join("")}</div>
      </section>
      <section class="block ac" id="a"><div class="sec-h"><h2>${t.aT}</h2><span class="sub">${t.aD}</span></div>
        <p class="intro">${esc(d.aIntro)}</p>
        <div class="grid g3">${d.attitudes.map((a) => `<div class="card ac" id="a-${a.key}">
          <h3>${esc(a.name)}</h3><p>${esc(a.desc)}</p>
          <div class="usedby">${t.usedby}${used((c) => c.a.includes(a.key))}</div></div>`).join("")}</div>
      </section>
    </div>`;
    if (focus) jump(focus, focus.startsWith("k") && focus.length > 1);
  }

  /* ---------- 對照總表 ---------- */
  const F = { d: "", k: "", s: "", a: "", l: "0" };
  function matrix() {
    const d = D(), t = T();
    const opt = (v, txt, cur) => `<option value="${esc(v)}" ${v === cur ? "selected" : ""}>${esc(txt)}</option>`;
    app.innerHTML = `
    <div class="pagehead"><div class="wrap">
      <div class="crumb"><a href="${link("")}">${t.home}</a> ／ ${t.mxPage}</div>
      <h1>${t.mxPage}</h1><p class="lead">${t.mxLead}</p>
    </div></div>
    <div class="wrap">
      <div class="filters" id="filters">
        <label>${t.fD}<select data-f="d">${opt("", t.all, F.d)}${d.domains.map((dm) => opt(String(dm.n), dm.n + " " + dm.name, F.d)).join("")}</select></label>
        <label>${t.fK}<select data-f="k">${opt("", t.all, F.k)}${d.knowledge.map((k) => opt(k.code, k.code + " " + d.themes[k.theme], F.k)).join("")}</select></label>
        <label>${t.fS}<select data-f="s">${opt("", t.all, F.s)}${d.skills.map((s) => opt(s.key, s.name, F.s)).join("")}</select></label>
        <label>${t.fA}<select data-f="a">${opt("", t.all, F.a)}${d.attitudes.map((a) => opt(a.key, a.name, F.a)).join("")}</select></label>
        <label>${t.fL}<select data-f="l">${d.levels.map((l, i) => opt(String(i), l, F.l)).join("")}</select></label>
        <span class="cnt" id="mxcnt"></span>
        <button class="ghostbtn" type="button" id="printBtn">🖨 ${t.print}</button>
      </div>
      <div class="tblwrap"><table class="mx"><thead><tr>${t.cols.map((c) => `<th>${c}</th>`).join("")}<th>${t.exp}</th><th>${t.scn}</th></tr></thead><tbody id="mxbody"></tbody></table></div>
    </div>`;
    const draw = () => {
      const li = +F.l;
      const rows = allComps().filter((c) => (!F.d || String(c.d.n) === F.d) && (!F.k || c.k.includes(F.k)) && (!F.s || c.s.includes(F.s)) && (!F.a || c.a.includes(F.a)));
      let last = 0;
      $("#mxbody").innerHTML = rows.map((c) => {
        const start = c.d.n !== last; last = c.d.n;
        return `<tr class="d${c.d.n} ${start ? "dstart" : ""}">
          <td class="cd"><a href="${link("domains")}#c${c.code}" style="color:inherit">${c.code}</a></td>
          <td class="dm" data-h="${t.cols[1]}">${esc(c.d.name)}</td>
          <td class="st" data-h="${t.cols[2]}">${esc(c.statement)}</td>
          <td class="sm" data-h="${t.cols[3]}">${c.k.map((x) => `<button class="tbtn kc" type="button" data-k="${x}">${x}</button>`).join(" ")}</td>
          <td class="sm" data-h="${t.cols[4]}">${c.s.map((x) => esc(skillName(x))).join(lang === "en" ? ", " : "、")}</td>
          <td class="sm" data-h="${t.cols[5]}">${c.a.map((x) => esc(attName(x))).join(lang === "en" ? ", " : "、")}</td>
          <td class="lg" data-h="${t.exp}（${esc(d.levels[li])}）">${esc(c.exp[li])}</td>
          <td class="lg" data-h="${t.scn}（${esc(d.levels[li])}）">${esc(c.sc[li])}</td></tr>`;
      }).join("");
      $("#mxcnt").textContent = rows.length + " " + t.rows;
    };
    const tb = $("#mxbody"), clearX = () => document.querySelectorAll(".mx .xh, .mx .xc").forEach((x) => x.classList.remove("xh", "xc"));
    tb.addEventListener("mouseover", (e) => {
      const td = e.target.closest("td"); if (!td || !matchMedia("(min-width: 1101px)").matches) return;
      clearX(); const ci = td.cellIndex;
      tb.querySelectorAll("tr").forEach((tr) => tr.cells[ci] && tr.cells[ci].classList.add("xh"));
      const th = document.querySelectorAll(".mx thead th")[ci]; if (th) th.classList.add("xh");
      td.classList.add("xc");
    });
    tb.addEventListener("mouseleave", clearX);
    $("#filters").addEventListener("change", (e) => { const s = e.target.closest("select[data-f]"); if (!s) return; F[s.dataset.f] = s.value; draw(); });
    $("#printBtn").addEventListener("click", () => window.print());
    draw();
  }

  /* ---------- 彈出說明（知識代碼／技能／態度） ---------- */
  function showPop(btn) {
    const d = D(), t = T();
    let html = "", cls = "kc";
    if (btn.dataset.k) {
      const code = btn.dataset.k, th = code.split(".")[0];
      html = `<b>${t.kT} ${code}｜${esc(d.themes[th])}</b>${esc(kText(code))}<br><a href="${link("ksa")}#k${code}">${t.gotoK} →</a>`;
    } else if (btn.dataset.s) {
      const s = d.skills.find((x) => x.key === btn.dataset.s); cls = "sc";
      html = `<b>${t.sT}｜${esc(s.name)}</b>${esc(s.desc)}`;
    } else if (btn.dataset.a) {
      const a = d.attitudes.find((x) => x.key === btn.dataset.a); cls = "ac";
      html = `<b>${t.aT}｜${esc(a.name)}</b>${esc(a.desc)}`;
    }
    pop.className = "pop " + cls; pop.innerHTML = html; pop.hidden = false;
    const r = btn.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    let x = Math.min(Math.max(16, r.left), window.innerWidth - pw - 16);
    let y = r.bottom + 8; if (y + ph > window.innerHeight - 10) y = Math.max(76, r.top - ph - 8);
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".tbtn");
    if (b) { e.preventDefault(); showPop(b); return; }
    if (!e.target.closest("#pop")) pop.hidden = true;
    const j = e.target.closest("[data-jump]");
    if (j) { e.preventDefault(); jump(j.dataset.jump); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") pop.hidden = true; });
  window.addEventListener("scroll", () => { pop.hidden = true; $("#totop").classList.toggle("show", window.scrollY > 600); }, { passive: true });
  $("#totop").addEventListener("click", () => window.scrollTo({ top: 0 }));

  function jump(id, highlight) {
    const el = document.getElementById(id); if (!el) return;
    const sb = document.querySelector(".stickybar");
    const off = 66 + (sb ? sb.offsetHeight : 0) + 12;
    const y = el.getBoundingClientRect().top + window.scrollY - off;
    window.scrollTo({ top: y, behavior: "instant" });
    if (highlight) { el.classList.add("hl"); setTimeout(() => el.classList.remove("hl"), 1800); }
  }

  /* ---------- 外框：導覽、語言、主題 ---------- */
  function chrome(page) {
    const t = T();
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    $("#brandT").textContent = t.brandT; $("#brandS").textContent = t.brandS;
    $("#brandLink").href = link("");
    $("#langBtn").textContent = t.other;
    $("#navlinks").innerHTML = t.nav.map(([p, n]) => `<a href="${link(p)}" class="${p === page ? "on" : ""}">${n}</a>`).join("");
    $("#foot").innerHTML = t.foot.map((x) => `<p>${x}</p>`).join("");
    renderRail(page);
    document.title = (page ? t.nav.find((n) => n[0] === page)[1] + "｜" : "") + t.brandT;
  }
  /* 左側浮動工具列：上圖示、下文字；底色滑塊跟著游標移動，離開時回到目前頁 */
  function renderRail(page) {
    const t = T(), rail = $("#rail");
    rail.innerHTML = `<i class="rail-ind"></i>` + t.rail.map(([p, ic, lb, tip]) =>
      `<a href="${link(p)}" class="${p === page ? "on" : ""}" data-tip="${esc(tip)}"${p === page ? ' aria-current="page"' : ""}><span>${ic}</span><em>${esc(lb).replace("&lt;br&gt;", "<br>")}</em></a>`).join("")
      + `<i class="sep"></i>`
      + `<button type="button" data-act="print" data-tip="${esc(t.railPrint[2])}"><span>${t.railPrint[0]}</span><em>${esc(t.railPrint[1])}</em></button>`
      + `<button type="button" data-act="theme" data-tip="${esc(t.railTheme[2])}"><span>${t.railTheme[0]}</span><em>${esc(t.railTheme[1])}</em></button>`
      + `<button type="button" data-act="lang" data-tip="${esc(t.railLang)}"><span>🌐</span><em>${esc(t.other)}</em></button>`;
    moveRailInd(rail.querySelector("a.on"));
  }
  function moveRailInd(el) {
    const ind = document.querySelector("#rail .rail-ind"); if (!ind) return;
    if (!el) { ind.style.opacity = 0; return; }
    ind.style.top = el.offsetTop + "px"; ind.style.height = el.offsetHeight + "px"; ind.style.opacity = 1;
  }
  $("#rail").addEventListener("mouseover", (e) => { const it = e.target.closest("#rail a, #rail button"); if (it) moveRailInd(it); });
  $("#rail").addEventListener("mouseleave", () => moveRailInd($("#rail a.on")));
  $("#rail").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    if (b.dataset.act === "print") window.print();
    else if (b.dataset.act === "theme") $("#themeBtn").click();
    else if (b.dataset.act === "lang") $("#langBtn").click();
  });

  /* 卡片 3D 傾斜（僅滑鼠裝置、未要求減少動態時） */
  let tiltEl = null;
  const canTilt = () => matchMedia("(hover: hover) and (pointer: fine)").matches && !RM.matches;
  document.addEventListener("pointermove", (e) => {
    if (!canTilt()) return;
    const el = e.target.closest && e.target.closest(".tilt");
    if (tiltEl && tiltEl !== el) { tiltEl.classList.remove("tilting"); tiltEl = null; }
    if (!el) return;
    tiltEl = el; el.classList.add("tilting");
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", ((x - 0.5) * 9).toFixed(2) + "deg");
    el.style.setProperty("--rx", ((0.5 - y) * 7).toFixed(2) + "deg");
    el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
  });
  document.addEventListener("pointerleave", () => { if (tiltEl) { tiltEl.classList.remove("tilting"); tiltEl = null; } });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeSeg(true); drawConns(); moveRailInd($("#rail a.on")); });
  let rsz;
  window.addEventListener("resize", () => { clearTimeout(rsz); rsz = setTimeout(() => { drawConns(); placeSeg(true); moveRailInd($("#rail a.on")); }, 120); });

  function route() {
    const h = location.hash || "#/zh/";
    const m = h.match(/^#\/(zh|en)\/?([^#]*)(?:#(.*))?$/);
    if (!m) { location.replace("#/zh/"); return; }
    lang = m[1];
    const parts = m[2].split("/").filter(Boolean);
    const page = ["domains", "ksa", "matrix"].includes(parts[0]) ? parts[0] : "";
    pop.hidden = true; $("#navlinks").classList.remove("open");
    chrome(page);
    let focus = m[3] || (page === "domains" && parts[1] ? "d" + parts[1] : "");
    if (page === "domains") domains(focus);
    else if (page === "ksa") ksa(focus);
    else if (page === "matrix") matrix();
    else home();
    if (!focus) window.scrollTo({ top: 0, behavior: "instant" });
    store.set("ailit-lang", lang);
  }
  $("#langBtn").addEventListener("click", () => {
    const h = location.hash.replace(/^#\/(zh|en)/, "#/" + (lang === "zh" ? "en" : "zh"));
    location.hash = h.startsWith("#/") ? h : "#/" + (lang === "zh" ? "en" : "zh") + "/";
  });
  $("#menuBtn").addEventListener("click", () => {
    const n = $("#navlinks"); n.classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", n.classList.contains("open"));
  });
  (function theme() {
    const saved = store.get("ailit-theme");
    if (saved) document.documentElement.dataset.theme = saved;
    $("#themeBtn").addEventListener("click", () => {
      const dark = document.documentElement.dataset.theme
        ? document.documentElement.dataset.theme === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches;
      const next = dark ? "light" : "dark";
      document.documentElement.dataset.theme = next; store.set("ailit-theme", next);
    });
  })();
  const lv = store.get("ailit-level"); if (lv !== null && /^-?[0-2]$/.test(lv)) level = +lv;
  if (!location.hash) { const l = store.get("ailit-lang"); if (l === "en") location.replace("#/en/"); }
  window.addEventListener("hashchange", route);
  route();
})();
