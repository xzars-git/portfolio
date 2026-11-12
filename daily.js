// "Line of the day": a case-opening style reel, themed as a plate scanner.
(() => {
  // r = rarity 0..4 (common → legendary)
  const LINES = {
    id: [
      { r: 4, s: "Langganan doang, limit nggak diabisin. Halo?" },
      { r: 3, s: "Kode jalan di laptop gue. Ya udah, kirim aja laptopnya ke production." },
      { r: 2, s: "Commit pertama: \"fix\". Commit kedua: \"fix beneran\"." },
      { r: 1, s: "Gue nggak nunda kerjaan. Gue async." },
      { r: 2, s: "Gue nggak lupa nge-test. Gue cuma percaya sama user." },
      { r: 0, s: "Meeting sejam buat bahas kenapa kerjaan telat sejam." },
      { r: 0, s: "Sinyal Wi-Fi kantor full. Internetnya? Nggak kenal." },
      { r: 1, s: "Bayar gym setahun. Yang rajin olahraga cuma notifikasinya." },
      { r: 3, s: "Akurasi model gue 100%. Datanya tiga foto." },
      { r: 0, s: "Kata dokter kurangin gula. Kata deadline tambahin kopi." },
      { r: 1, s: "Gajian tanggal 25. Tanggal 26 udah mode hemat." },
      { r: 0, s: "Bukan telat bales chat. Gue lagi loading." },
      { r: 2, s: "Tidur jam 2 bukan begadang. Itu night build." },
      { r: 3, s: "Plat nomor bisa gue baca. Kode gue sendiri setahun lalu? Belum." },
      { r: 1, s: "Storage HP penuh. Isinya screenshot \"buat nanti\"." }
    ],
    en: [
      { r: 4, s: "Paying for the subscription, not using the limit. Hello?" },
      { r: 3, s: "Works on my laptop. Fine, we'll ship the laptop." },
      { r: 2, s: "Commit one: \"fix\". Commit two: \"actual fix\"." },
      { r: 1, s: "I'm not procrastinating. I'm async." },
      { r: 2, s: "I didn't skip testing. I trust our users." },
      { r: 0, s: "An hour-long meeting about why the work is an hour late." },
      { r: 0, s: "Office Wi-Fi: full bars, zero internet." },
      { r: 1, s: "Paid for a year of gym. Only the notifications work out." },
      { r: 3, s: "My model is 100% accurate. On three photos." },
      { r: 0, s: "Doctor says less sugar. Deadline says more coffee." },
      { r: 1, s: "Payday on the 25th. Budget mode on the 26th." },
      { r: 0, s: "I'm not ignoring your message. I'm still loading." },
      { r: 2, s: "It's not staying up late. It's a night build." },
      { r: 3, s: "I can read license plates. My own code from last year? Not yet." },
      { r: 1, s: "Phone storage full. All screenshots \"for later\"." }
    ],
    ja: [
      { r: 4, s: "サブスクは払ってる。上限までは使ってない。もしもし？" },
      { r: 3, s: "僕のPCでは動きます。じゃあPCごと本番に送ります。" },
      { r: 2, s: "1回目のコミット「修正」。2回目「本当に修正」。" },
      { r: 1, s: "先延ばしじゃない。非同期処理です。" },
      { r: 2, s: "テストを忘れたんじゃない。ユーザーを信じてるだけ。" },
      { r: 0, s: "1時間遅れた理由を話す、1時間の会議。" },
      { r: 0, s: "会社のWi-Fi、アンテナは満タン、ネットはゼロ。" },
      { r: 1, s: "ジムを1年分払った。運動してるのは通知だけ。" },
      { r: 3, s: "精度100%のモデルです。データは写真3枚。" },
      { r: 0, s: "医者は「砂糖を減らせ」、締め切りは「コーヒーを増やせ」。" },
      { r: 1, s: "給料日は25日。26日から節約モード。" },
      { r: 0, s: "既読スルーじゃない。まだ読み込み中。" },
      { r: 2, s: "夜更かしじゃない。ナイトビルドです。" },
      { r: 3, s: "ナンバープレートは読める。1年前の自分のコードはまだ読めない。" },
      { r: 1, s: "スマホの容量がいっぱい。中身は「あとで見る」スクショ。" }
    ]
  };
  const RAR = ["#9AA4AE", "#3E7BFA", "#8A3FFC", "#E2367F", "#F2C200"];
  const WEIGHT = [40, 28, 18, 10, 4];
  const TILE = 170; // tile width + gap, must match CSS
  const WIN_AT = 34, COUNT = 40;

  const $ = s => document.querySelector(s);
  const lang = () => document.documentElement.lang in LINES ? document.documentElement.lang : "en";
  const t = k => window.I18N[lang()][k];
  const reel = $("#reel"), btn = $("#spinBtn"), card = $("#qcard"), dl = $("#qDl"), mark = $("#caseMark");
  if (!reel) return;

  const pickRarity = () => { let n = Math.random() * 100; for (let i = 0; i < 5; i++) if ((n -= WEIGHT[i]) < 0) return i; return 0; };
  const plateId = () => "D " + (1000 + Math.floor(Math.random() * 9000)) + " " +
    String.fromCharCode(65 + Math.random() * 26 | 0, 65 + Math.random() * 26 | 0);
  const tile = r => `<div class="tile" style="--rc:${RAR[r]}"><span class="plate plate-sm">${plateId()}</span><i>${t("daily.rar")[r]}</i></div>`;

  // ---------- sound: synthesized, no audio files ----------
  let ac = null;
  function beep(freq, len, vol, type = "square") {
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain(), now = ac.currentTime;
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, now); g.gain.exponentialRampToValueAtTime(.0001, now + len);
    o.connect(g).connect(ac.destination); o.start(now); o.stop(now + len);
  }
  const tickSnd = () => beep(1800 + Math.random() * 200, .035, .05);
  const landSnd = r => [0, 1, 2].forEach(i => setTimeout(() => beep([660, 880, 1320][i] * (1 + r * .06), .25, .08, "triangle"), i * 90));

  let spinning = false, won = null;
  const idle = () => { reel.innerHTML = Array.from({ length: 12 }, () => tile(pickRarity())).join(""); reel.style.transform = "translateX(0)"; };

  function spin() {
    if (spinning) return;
    spinning = true; btn.disabled = true; card.hidden = true; dl.hidden = true;
    mark.dataset.label = t("daily.scanning"); mark.classList.remove("hit");

    const r = pickRarity(), pool = LINES[lang()].filter(l => l.r === r);
    won = pool[Math.random() * pool.length | 0];
    const rs = Array.from({ length: COUNT }, (_, i) => i === WIN_AT ? r : pickRarity());
    reel.innerHTML = rs.map(tile).join("");

    const box = reel.parentElement.clientWidth;
    const end = WIN_AT * TILE + TILE / 2 - box / 2 + (Math.random() - .5) * (TILE - 40);
    // full spin even with reduced motion: the user starts it and it's the whole point. JS-driven so the CSS kill-switch doesn't apply
    const dur = 7000, t0 = performance.now();
    const ease = x => 1 - Math.pow(1 - x, 3);
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch { ac = null; }
    let lastTile = -1;
    (function frame(now) {
      const p = Math.min(1, (now - t0) / dur), x = end * ease(p);
      reel.style.transform = `translateX(${-x}px)`;
      const under = Math.floor((x + box / 2 - 10) / TILE); // tile under the scan line
      if (under !== lastTile) { lastTile = under; tickSnd(); }
      if (p < 1) return requestAnimationFrame(frame);
      done(r);
    })(t0);
  }

  function done(r) {
    spinning = false; btn.disabled = false;
    btn.textContent = t("daily.again");
    mark.dataset.label = `${t("daily.found")} 0.${90 + (Math.random() * 9 | 0)}`; mark.classList.add("hit");
    reel.children[WIN_AT].classList.add("win");
    landSnd(r);
    $("#qRar").textContent = t("daily.rar")[r]; card.style.setProperty("--rc", RAR[r]);
    $("#qDate").textContent = today();
    $("#qText").textContent = won.s;
    card.hidden = false; dl.hidden = false;
  }

  const today = () => new Date().toLocaleDateString(lang() === "ja" ? "ja-JP" : lang() === "id" ? "id-ID" : "en-GB",
    { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" });

  // ---------- card → PNG (1080×1350, drawn by hand, no libraries) ----------
  function wrap(ctx, text, maxW) {
    const words = lang() === "ja" ? [...text] : text.split(" "), sep = lang() === "ja" ? "" : " ";
    const lines = []; let cur = "";
    for (const w of words) {
      const next = cur ? cur + sep + w : w;
      if (ctx.measureText(next).width > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  async function download() {
    if (!won) return;
    await document.fonts.ready;
    const W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d"), rc = RAR[won.r];
    const disp = '"Archivo Black","Noto Sans JP",sans-serif', mono = '"JetBrains Mono",monospace', plate = '"Barlow Condensed","Noto Sans JP",sans-serif';

    x.fillStyle = "#EFEDE6"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#111"; for (let i = 0; i < W; i += 24) for (let j = 0; j < H; j += 24) x.fillRect(i, j, 2, 2); // dot grid
    x.lineWidth = 12; x.strokeStyle = "#111"; x.strokeRect(6, 6, W - 12, H - 12);

    // header plate
    x.fillStyle = "#F2C200"; x.fillRect(70, 80, W - 140, 130); x.lineWidth = 8; x.strokeRect(70, 80, W - 140, 130);
    x.fillStyle = "#111"; x.font = `800 72px ${plate}`; x.textBaseline = "middle"; x.textAlign = "center";
    x.fillText(t("daily.card"), W / 2, 147);

    // rarity strip + meta
    x.fillStyle = rc; x.fillRect(70, 250, W - 140, 22);
    x.textAlign = "left"; x.font = `700 30px ${mono}`; x.fillStyle = "#111";
    x.fillText(t("daily.rar")[won.r].toUpperCase(), 70, 312);
    x.textAlign = "right"; x.fillText(today(), W - 70, 312);

    // the line, inside a detection box
    x.textAlign = "left"; x.textBaseline = "alphabetic";
    let size = 84, lines;
    do { x.font = `${lang() === "ja" ? 900 : 400} ${size}px ${disp}`; lines = wrap(x, won.s, W - 260); size -= 4; } while (lines.length * size * 1.2 > 640 && size > 40);
    const lh = (size + 4) * 1.2, top = 420 + (640 - lines.length * lh) / 2;
    lines.forEach((l, i) => x.fillText(l, 130, top + lh * (i + .8)));
    x.strokeStyle = "#B6FF00"; x.lineWidth = 8;
    x.strokeRect(100, top - 30, W - 200, lines.length * lh + 60);
    x.fillStyle = "#B6FF00"; x.fillRect(100, top - 78, 330, 48);
    x.fillStyle = "#111"; x.font = `700 28px ${mono}`; x.fillText(`joke ${mark.dataset.label.split(" ").pop()}`, 116, top - 44);

    // footer
    x.fillStyle = "#111"; x.fillRect(0, H - 150, W, 150);
    x.fillStyle = "#F2C200"; x.font = `700 32px ${mono}`; x.fillText("arsenius-portfolio.vercel.app", 70, H - 64);
    x.fillStyle = "#E3262E"; x.beginPath(); x.arc(W - 90, H - 75, 16, 0, 7); x.fill();

    c.toBlob(b => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b); a.download = `line-of-the-day-${Date.now()}.png`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  btn.addEventListener("click", spin);
  dl.addEventListener("click", download);
  // language switch: reset to idle so the reel and card match the new language
  new MutationObserver(() => { if (!spinning) { idle(); card.hidden = dl.hidden = true; btn.textContent = t("daily.spin"); mark.dataset.label = ""; mark.classList.remove("hit"); } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  idle();
})();
