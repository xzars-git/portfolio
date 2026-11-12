(() => {
  const T = window.I18N, LANGS = ["en", "id", "ja"];
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = { get() { try { return localStorage.getItem("lang"); } catch { return null; } },
                  set(v) { try { localStorage.setItem("lang", v); } catch {} } };
  const params = new URLSearchParams(location.search);

  let lang = LANGS.includes(params.get("lang")) ? params.get("lang") : store.get();
  if (!LANGS.includes(lang)) lang = (navigator.language || "en").slice(0, 2);
  if (!LANGS.includes(lang)) lang = "en";
  const t = k => T[lang][k] ?? "";

  const pdfName = l => `pdf/arsenius-purbandono-portfolio-${l}.pdf`;
  const stamp = s => `<span class="stamp ${s}">${esc(t("status." + s))}</span>`;
  const icon = (a, cls = "sq") => `<span class="${cls}" style="background:${a.color};color:${a.ink}"><img src="${a.logo}" alt="" loading="lazy"></span>`;

  function render() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    document.querySelectorAll("[data-i18n]").forEach(el => { const v = t(el.dataset.i18n); if (typeof v === "string") el.textContent = v; });
    document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    ["pdfTop", "pdfHero", "pdfFoot"].forEach(id => { $("#" + id).href = pdfName(lang); });

    $("#icons").innerHTML = APPS.map((a, i) => `
      <button class="icon" data-i="${i}" aria-label="${esc(a.name)}">${icon(a)}
        <span>${esc(a.name)}</span>${a.status === "proto" ? `<span class="badge">${esc(t("status.proto"))}</span>` : ""}
      </button>`).join("");

    $("#printApps").innerHTML = APPS.map(a => `
      <div class="papp"><h4>${esc(a.name)}</h4><div class="st">${esc(t("status." + a.status))} · ${a.stack.map(esc).join(" · ")}</div>
      <div>${esc(a[lang].what)}</div><ul>${a[lang].role.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>`).join("");

    $("#models").innerHTML = MODELS.map(m => `
      <div class="model">${stamp(m.status)}<h4>${esc(m.name)}</h4><div class="arch">${esc(m.arch)}</div>
      <div class="metric">${esc(m.metric)}</div><p>${esc(m[lang])}</p></div>`).join("");

    $("#sandbox").innerHTML = SANDBOX.map(s => `
      <div class="sand"><h4>${esc(s.name)}</h4><div class="metric">${esc(s.metric)}</div>
      <div class="st">${esc(s.stack)}</div><p>${esc(s[lang])}</p></div>`).join("");

    if (!deck.hidden) buildSlides();
  }

  function setLang(l) {
    lang = l; store.set(l); render();
    const u = new URL(location); u.searchParams.set("lang", l); history.replaceState(null, "", u);
  }
  document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  // ---------- app window ----------
  const win = $("#appwin");
  let lastIcon = null;
  $("#icons").addEventListener("click", e => {
    const b = e.target.closest(".icon"); if (!b) return;
    const a = APPS[+b.dataset.i]; lastIcon = b;
    $("#awBar").style.background = a.color; $("#awBar").style.color = a.ink;
    $("#awStatus").textContent = `${a.name.toUpperCase()} · ${t("status." + a.status)}`;
    $("#awIcon").outerHTML = icon(a, "aw-icon").replace('class="aw-icon"', 'class="aw-icon" id="awIcon"');
    $("#awPh").textContent = a.ph ? "* " + t("apps.ph") : "";
    $("#awTitle").textContent = a.name;
    $("#awWhat").textContent = a[lang].what;
    $("#awRole").innerHTML = a[lang].role.map(r => `<li>${esc(r)}</li>`).join("");
    $("#awStack").innerHTML = a.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("");
    win.hidden = false; $("#awClose").focus();
  });
  const closeWin = () => { win.hidden = true; lastIcon && lastIcon.focus(); };
  $("#awClose").addEventListener("click", closeWin);
  win.addEventListener("click", e => { if (e.target === win) closeWin(); });

  // ---------- clock ----------
  const tick = () => { $("#clock").textContent = "BDG " + new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" }) + " WIB"; };
  tick(); setInterval(tick, 15000);

  // ---------- face "scan": type out an unsure verdict, cycle through variants ----------
  const out = $("#ocrOut"), ok = $(".sheet-ok");
  let v = 0, k = 0;
  setInterval(() => {
    const res = t("phone.res"), s = res[v % res.length];
    k++;
    out.textContent = s.slice(0, Math.min(k, s.length)) + (k < s.length ? "_" : "");
    ok.classList.toggle("on", k >= s.length);
    if (k > s.length + 9) { k = 0; v++; }
  }, 150);

  // detection boxes flash once when scrolled into view (touch screens have no hover)
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("flash"); setTimeout(() => e.target.classList.remove("flash"), 1600); io.unobserve(e.target);
  }), { threshold: .6 });
  document.querySelectorAll(".det").forEach(el => io.observe(el));

  // bottom-nav active section
  const links = [...document.querySelectorAll(".bottomnav a")];
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["home", "apps", "lab", "about", "contact"].forEach(id => so.observe(document.getElementById(id)));

  // ---------- slideshow ----------
  const deck = $("#deck"), stage = $("#stage");
  let cur = 0, slides = [];

  const S = {
    title: () => `<div class="sl sl-title">
      <div><p class="kicker mono">${esc(t("hero.kicker"))}</p>
        <div class="name"><span class="plate plate-xl">ARSENIUS</span><span class="plate plate-xl plate-y">PURBANDONO</span></div>
        <p class="lead">${esc(t("hero.lead"))}</p><p class="where mono">${esc(t("hero.where"))}</p></div>
      <div class="sl-photo"><img src="me.jpg" alt=""><i><b>${esc(t("phone.box"))}</b></i></div></div>`,
    stats: () => `<div class="sl"><h2 class="h2">${esc(t("stats.title"))}</h2><div class="stats">
      ${[["3+", 1], ["56→76%", 2], ["−30MB", 3], ["4×", 4], ["1.1M", 5], ["494", 6]].map(([n, i]) =>
        `<div class="stat ${i === 2 ? "stat-y" : i === 5 ? "stat-k" : ""}"><b>${n}</b><span>${esc(t("stats." + i))}</span></div>`).join("")}</div></div>`,
    pipe: () => `<div class="sl sl-k"><h2 class="h2 h2-y">${esc(t("pipe.title"))}</h2><p class="sub">${esc(t("pipe.sub"))}</p><ol class="pipe">
      ${[1, 2, 3, 4, 5, 6].map(i => `<li class="${i === 5 ? "hot" : ""}"><i>0${i}</i><b>${esc(t(`pipe.${i}t`))}</b><span>${esc(t(`pipe.${i}d`))}</span></li>`).join("")}</ol></div>`,
    app: a => `<div class="sl sl-app"><div class="sl-app-l">${icon(a, "sl-icon")}${a.ph ? `<small class="mono">* ${esc(t("apps.ph"))}</small>` : ""}</div>
      <div><p class="mono sl-tag">${esc(t("apps.title"))} · ${stamp(a.status)}</p><h2 class="h2">${esc(a.name)}</h2>
        <p class="sl-what">${esc(a[lang].what)}</p><h4 class="mono">${esc(t("apps.role"))}</h4>
        <ul>${a[lang].role.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
        <div class="chips">${a.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></div></div>`,
    story: () => `<div class="sl sl-y"><h2 class="h2">${esc(t("lab.story.t"))}</h2><div class="sl-story">
      <div class="vs"><div class="vs-a"><small>Google ML Kit</small><b>56%</b><div class="bar"><i style="width:56%"></i></div></div>
        <div class="vs-b"><small>CNN+CTC</small><b>76%</b><div class="bar"><i style="width:76%"></i></div></div></div>
      <div>${["p1", "p2", "p3"].map(p => `<p>${esc(t("lab.story." + p))}</p>`).join("")}</div></div></div>`,
    models: () => `<div class="sl"><h2 class="h2">${esc(t("lab.title"))}</h2><div class="sl-grid4">${MODELS.map(m =>
      `<div class="model">${stamp(m.status)}<h4>${esc(m.name)}</h4><div class="arch">${esc(m.arch)}</div><div class="metric">${esc(m.metric)}</div><p>${esc(m[lang])}</p></div>`).join("")}</div></div>`,
    sandbox: () => `<div class="sl sl-k"><h2 class="h2 h2-y">${esc(t("lab.sandbox"))}</h2><p class="sub">${esc(t("lab.sandbox.sub"))}</p><div class="sandbox">${SANDBOX.map(s =>
      `<div class="sand"><h4>${esc(s.name)}</h4><div class="metric">${esc(s.metric)}</div><div class="st">${esc(s.stack)}</div><p>${esc(s[lang])}</p></div>`).join("")}</div></div>`,
    log: () => `<div class="sl"><h2 class="h2">${esc(t("about.title"))}</h2><div class="sl-log">
      <div class="log mono">${[1, 2].map(i => `<div class="commit"><div class="c-head"><b>${esc(t(`about.job${i}`))}</b></div>
        <div class="c-meta">${esc(t(`about.org${i}`))} · ${esc(t(`about.when${i}`))}</div><p>${esc(t(`about.job${i}d`))}</p></div>`).join("")}</div>
      <div><div class="card card-y"><h3>${esc(t("about.lang"))}</h3><ul><li>${esc(t("about.ja"))}</li><li>${esc(t("about.en"))}</li></ul></div>
        <p class="avail">${esc(t("about.avail"))}</p></div></div></div>`,
    end: () => `<div class="sl sl-k sl-end"><h2 class="h2 h2-y">${esc(t("sl.thanks"))}</h2><p class="sub">${esc(t("sl.thanks2"))}</p>
      <span class="plate plate-xl mail">xzars009@gmail.com</span>
      <p class="mono sl-links"><a href="https://www.linkedin.com/in/arsenius-purbandono-a05a65212/" target="_blank" rel="noopener">linkedin.com/in/arsenius-purbandono-a05a65212</a> · <a href="https://github.com/xzars-git" target="_blank" rel="noopener">github.com/xzars-git</a></p></div>`
  };

  function buildSlides() {
    slides = [S.title(), S.stats(), S.pipe(), ...APPS.map(S.app), S.story(), S.models(), S.sandbox(), S.log(), S.end()];
    stage.innerHTML = slides.map((h, i) => `<section class="slide" data-n="${i}" aria-hidden="true">${h}</section>`).join("");
    $("#deckHint").textContent = t("sl.hint");
    go(Math.min(cur, slides.length - 1));
  }
  function go(n) {
    cur = Math.max(0, Math.min(slides.length - 1, n));
    stage.querySelectorAll(".slide").forEach((s, i) => { s.classList.toggle("on", i === cur); s.setAttribute("aria-hidden", i !== cur); });
    $("#deckCount").textContent = `${cur + 1} / ${slides.length}`;
    $("#deckProg").style.width = ((cur + 1) / slides.length * 100) + "%";
    const u = new URL(location); u.searchParams.set("slides", cur + 1); history.replaceState(null, "", u);
  }
  function fit() { const s = Math.min(innerWidth / 1600, (innerHeight - 56) / 900); stage.style.transform = `translate(-50%,-50%) scale(${s})`; }
  function openDeck(n = 0) { cur = n; deck.hidden = false; buildSlides(); fit(); $("#deckNext").focus(); }
  function closeDeck() {
    deck.hidden = true; if (document.fullscreenElement) document.exitFullscreen();
    const u = new URL(location); u.searchParams.delete("slides"); history.replaceState(null, "", u);
  }
  const fullscreen = () => document.fullscreenElement ? document.exitFullscreen() : deck.requestFullscreen?.();

  document.querySelectorAll("[data-slides]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openDeck(0); }));
  $("#deckPrev").addEventListener("click", () => go(cur - 1));
  $("#deckNext").addEventListener("click", () => go(cur + 1));
  $("#deckClose").addEventListener("click", closeDeck);
  $("#deckFull").addEventListener("click", fullscreen);
  stage.addEventListener("click", e => { if (!e.target.closest("a,button")) go(cur + 1); });
  addEventListener("resize", () => { if (!deck.hidden) fit(); });
  let tx = null;
  deck.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener("touchend", e => { if (tx === null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(cur + (d < 0 ? 1 : -1)); tx = null; });

  addEventListener("keydown", e => {
    if (!deck.hidden) {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); go(cur + 1); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(cur - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key === "f" || e.key === "F") fullscreen();
      else if (e.key === "Escape" && !document.fullscreenElement) closeDeck();
    } else if (e.key === "Escape" && !win.hidden) closeWin();
  });

  render();
  const sp = parseInt(params.get("slides"), 10);
  if (sp > 0) openDeck(sp - 1);
})();
