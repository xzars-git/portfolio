(() => {
  const T = window.I18N, LANGS = ["en", "id", "ja"];
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = { get() { try { return localStorage.getItem("lang"); } catch { return null; } },
                  set(v) { try { localStorage.setItem("lang", v); } catch {} } };

  const q = new URLSearchParams(location.search).get("lang");
  let lang = LANGS.includes(q) ? q : store.get();
  if (!LANGS.includes(lang)) lang = (navigator.language || "en").slice(0, 2);
  if (!LANGS.includes(lang)) lang = "en";

  const pdfName = l => `pdf/arsenius-purbandono-portfolio-${l}.pdf`;
  const stamp = s => `<span class="stamp ${s}">${esc(T[lang]["status." + s])}</span>`;

  function render() {
    const t = T[lang];
    document.documentElement.lang = lang;
    document.title = t["meta.title"];
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t[el.dataset.i18n] ?? ""; });
    document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    ["pdfTop", "pdfHero", "pdfFoot"].forEach(id => { $("#" + id).href = pdfName(lang); });

    $("#icons").innerHTML = APPS.map((a, i) => `
      <button class="icon" data-i="${i}" aria-label="${esc(a.name)}">
        <span class="sq" style="background:${a.color};color:${a.ink}">${a.abbr}</span>
        <span>${esc(a.name)}</span>${a.status === "proto" ? `<span class="badge">${esc(t["status.proto"])}</span>` : ""}
      </button>`).join("");

    $("#printApps").innerHTML = APPS.map(a => `
      <div class="papp"><h4>${esc(a.name)}</h4><div class="st">${esc(t["status." + a.status])} · ${a.stack.map(esc).join(" · ")}</div>
      <div>${esc(a[lang].what)}</div><ul>${a[lang].role.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>`).join("");

    $("#models").innerHTML = MODELS.map(m => `
      <div class="model">${stamp(m.status)}<h4>${esc(m.name)}</h4><div class="arch">${esc(m.arch)}</div>
      <div class="metric">${esc(m.metric)}</div><p>${esc(m[lang])}</p></div>`).join("");

    $("#sandbox").innerHTML = SANDBOX.map(s => `
      <div class="sand"><h4>${esc(s.name)}</h4><div class="metric">${esc(s.metric)}</div>
      <div class="st">${esc(s.stack)}</div><p>${esc(s[lang])}</p></div>`).join("");
  }

  function setLang(l) {
    lang = l; store.set(l); render();
    const u = new URL(location); u.searchParams.set("lang", l); history.replaceState(null, "", u);
  }
  document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  // app window
  const win = $("#appwin");
  let lastIcon = null;
  $("#icons").addEventListener("click", e => {
    const b = e.target.closest(".icon"); if (!b) return;
    const a = APPS[+b.dataset.i], t = T[lang]; lastIcon = b;
    $("#awBar").style.background = a.color; $("#awBar").style.color = a.ink;
    $("#awStatus").textContent = `${a.name.toUpperCase()} · ${t["status." + a.status]}`;
    const ic = $("#awIcon"); ic.textContent = a.abbr; ic.style.background = a.color; ic.style.color = a.ink;
    $("#awTitle").textContent = a.name;
    $("#awWhat").textContent = a[lang].what;
    $("#awRole").innerHTML = a[lang].role.map(r => `<li>${esc(r)}</li>`).join("");
    $("#awStack").innerHTML = a.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("");
    win.hidden = false; $("#awClose").focus();
  });
  const close = () => { win.hidden = true; lastIcon && lastIcon.focus(); };
  $("#awClose").addEventListener("click", close);
  win.addEventListener("click", e => { if (e.target === win) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !win.hidden) close(); });

  // clock (Bandung = WIB)
  const tick = () => { $("#clock").textContent = "BDG " + new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" }) + " WIB"; };
  tick(); setInterval(tick, 15000);

  // fake OCR typing in the phone
  const PLATE = "D 2023 AI", out = $("#ocrOut"), ok = $(".sheet-ok");
  let k = 0;
  setInterval(() => {
    k = (k + 1) % (PLATE.length + 8);
    out.textContent = PLATE.slice(0, Math.min(k, PLATE.length)) + (k < PLATE.length ? "_" : "");
    ok.classList.toggle("on", k >= PLATE.length);
  }, 260);

  // detection boxes flash once when scrolled into view (works on touch screens too)
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

  render();
})();
