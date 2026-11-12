// "Line of the day": a case-opening style reel, themed as a plate scanner.
(() => {
  // r = rarity 0..4 (common → legendary)
  const LINES = {
    id: [
      { r: 4, a: "Langganan AI udah bayar mahal.", b: "Limitnya nggak pernah abis. Halo?" },
      { r: 4, a: "Diet mulai Senin.", b: "Senin yang mana, nggak pernah dibilang." },
      { r: 4, a: "Gue nggak males.", b: "Gue lagi mode hemat energi." },
      { r: 3, a: "Di laptop gue jalan kok.", b: "Ya udah, laptopnya aja yang kita kirim." },
      { r: 3, a: "Bug-nya udah gue fix.", b: "Sekarang jadi dua, tapi lebih rapi." },
      { r: 3, a: "Ditanya \"udah sampe mana?\"", b: "Jawab \"otw\". Padahal baru mandi." },
      { r: 3, a: "Buka kulkas, nggak ada yang baru. Tutup.", b: "Lima menit kemudian buka lagi." },
      { r: 2, a: "Kami nggak skip testing.", b: "User yang nge-test. Gratis pula." },
      { r: 2, a: "Bayar gym setahun.", b: "Yang rajin olahraga cuma notifikasinya." },
      { r: 2, a: "Gajian tanggal 25.", b: "Tanggal 27 udah nanya \"kapan gajian?\"" },
      { r: 2, a: "Niat tidur jam 10.", b: "Jam 2 masih nonton \"cara cepat tidur\"." },
      { r: 2, a: "Grup WA keluarga rame banget.", b: "Isinya stiker selamat pagi sama hoaks." },
      { r: 1, a: "\"Lima menit lagi kelar.\"", b: "— gue, tiga jam yang lalu." },
      { r: 1, a: "Storage HP penuh. Isinya screenshot \"buat nanti\".", b: "Nantinya nggak pernah dateng." },
      { r: 1, a: "Rapat sejam buat bahas kenapa kerjaan telat.", b: "Sekarang telatnya nambah sejam." },
      { r: 1, a: "Bukan telat bales chat.", b: "Gue masih loading." },
      { r: 1, a: "Masuk kamar mau ambil sesuatu. Lupa.", b: "Inget lagi pas udah duduk." },
      { r: 0, a: "Wi-Fi kantor sinyalnya full.", b: "Internetnya? Belum kenalan." },
      { r: 0, a: "Keranjang belanja online udah penuh.", b: "Checkout-nya nunggu tanggal kembar." }
    ],
    en: [
      { r: 4, a: "Paying for the premium AI plan.", b: "Never once hit the limit. Hello?" },
      { r: 4, a: "Diet starts Monday.", b: "Never said which Monday." },
      { r: 4, a: "I'm not lazy.", b: "I'm in power-saving mode." },
      { r: 3, a: "Works on my laptop.", b: "Fine. We ship the laptop." },
      { r: 3, a: "Fixed the bug.", b: "Now there are two, but they're organized." },
      { r: 3, a: "\"Where are you?\"", b: "\"On my way.\" Still in the shower." },
      { r: 3, a: "Opened the fridge. Nothing new. Closed it.", b: "Opened it again five minutes later." },
      { r: 2, a: "We never skip testing.", b: "Our users do it for free." },
      { r: 2, a: "Paid for a year of gym.", b: "Only the notifications work out." },
      { r: 2, a: "Payday on the 25th.", b: "By the 27th: \"when's payday?\"" },
      { r: 2, a: "Planned to sleep at 10.", b: "2 a.m.: watching \"how to fall asleep fast\"." },
      { r: 2, a: "The family group chat is busy again.", b: "Good-morning stickers and fake news." },
      { r: 1, a: "\"Five more minutes.\"", b: "— me, three hours ago." },
      { r: 1, a: "Phone storage full of screenshots \"for later\".", b: "Later never came." },
      { r: 1, a: "An hour-long meeting about why we're late.", b: "Now we're an hour later." },
      { r: 1, a: "Not ignoring your text.", b: "Still loading." },
      { r: 1, a: "Walked into a room to get something. Forgot.", b: "Remembered the moment I sat down." },
      { r: 0, a: "Office Wi-Fi: full bars.", b: "Internet: never met it." },
      { r: 0, a: "Online cart is full.", b: "Waiting for the next big sale." }
    ],
    ja: [
      { r: 4, a: "AIのサブスクは高いプラン。", b: "上限まで使ったことは一度もない。もしもし？" },
      { r: 4, a: "ダイエットは月曜から。", b: "どの月曜かは言ってない。" },
      { r: 4, a: "怠けてるんじゃない。", b: "省エネモードです。" },
      { r: 3, a: "僕のPCでは動きます。", b: "じゃあPCごと本番に出しましょう。" },
      { r: 3, a: "バグを直しました。", b: "2つに増えたけど、きれいに並んでいます。" },
      { r: 3, a: "「今どこ？」", b: "「向かってる」。まだシャワー中。" },
      { r: 3, a: "冷蔵庫を開ける。何もない。閉める。", b: "5分後、また開ける。" },
      { r: 2, a: "テストは省略していません。", b: "ユーザーが無料でやってくれます。" },
      { r: 2, a: "ジムを1年分払った。", b: "運動してるのは通知だけ。" },
      { r: 2, a: "給料日は25日。", b: "27日にはもう「次の給料日いつ？」" },
      { r: 2, a: "10時に寝るつもりだった。", b: "2時、「すぐ眠れる方法」の動画を見てる。" },
      { r: 2, a: "家族のグループLINEがにぎやか。", b: "おはようスタンプとデマばかり。" },
      { r: 1, a: "「あと5分で終わります」", b: "— 3時間前の僕。" },
      { r: 1, a: "スマホの容量は「あとで見る」スクショでいっぱい。", b: "「あとで」は来なかった。" },
      { r: 1, a: "遅れの理由を話す1時間の会議。", b: "おかげでさらに1時間遅れた。" },
      { r: 1, a: "既読スルーじゃない。", b: "まだ読み込み中。" },
      { r: 1, a: "何かを取りに部屋に入った。忘れた。", b: "座った瞬間に思い出した。" },
      { r: 0, a: "会社のWi-Fi、アンテナは満タン。", b: "ネットとはまだ会ったことがない。" },
      { r: 0, a: "ネットのカートはいっぱい。", b: "セールの日まで待機中。" }
    ]
  };
  const RAR = ["#9AA4AE", "#3E7BFA", "#8A3FFC", "#E2367F", "#F2C200"];
  const WEIGHT = [1, 20, 30, 29, 20]; // generous on purpose: most visitors spin once
  const TILE = 170; // tile width + gap, must match CSS
  const WIN_AT = 34, COUNT = 40;

  const $ = s => document.querySelector(s);
  const lang = () => document.documentElement.lang in LINES ? document.documentElement.lang : "en";
  const t = k => window.I18N[lang()][k];
  const reel = $("#reel"), btn = $("#spinBtn"), card = $("#qcard"), dl = $("#qDl"), mark = $("#caseMark");
  if (!reel) return;

  // the reel shows mostly common/blue so a purple+ hit feels special; the real result uses WEIGHT
  const SHOW = [55, 30, 10, 4, 1];
  const pickRarity = (w = WEIGHT) => { let n = Math.random() * 100; for (let i = 0; i < 5; i++) if ((n -= w[i]) < 0) return i; return 0; };
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
  const idle = () => { reel.innerHTML = Array.from({ length: 12 }, () => tile(pickRarity(SHOW))).join(""); reel.style.transform = "translateX(0)"; };

  function spin() {
    if (spinning) return;
    spinning = true; btn.disabled = true; card.hidden = true; dl.hidden = true;
    mark.dataset.label = t("daily.scanning"); mark.classList.remove("hit");

    const r = pickRarity(), pool = LINES[lang()].filter(l => l.r === r);
    won = pool[Math.random() * pool.length | 0];
    const rs = Array.from({ length: COUNT }, (_, i) => i === WIN_AT ? r : pickRarity(SHOW));
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
    spinning = false;
    btn.textContent = t("daily.again");
    mark.dataset.label = `${t("daily.found")} 0.${90 + (Math.random() * 9 | 0)}`; mark.classList.add("hit");
    reel.children[WIN_AT].classList.add("win");
    $("#qRar").textContent = t("daily.rar")[r]; card.style.setProperty("--rc", RAR[r]);
    $("#qDate").textContent = today();
    $("#qText").textContent = won.a;
    const punch = $("#qPunch"); punch.textContent = won.b; punch.classList.remove("in");
    card.classList.toggle("big", r >= 3);
    card.hidden = false;
    // punchline lands a beat after the setup
    setTimeout(() => { punch.classList.add("in"); landSnd(r); dl.hidden = false; btn.disabled = false; }, 1100);
  }

  const today = () => new Date().toLocaleDateString(lang() === "ja" ? "ja-JP" : lang() === "id" ? "id-ID" : "en-GB",
    { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" });

  // ---------- card → PNG (1080×1350, drawn by hand, no libraries) ----------
  function wrap(ctx, text, maxW) {
    const words = lang() === "ja" ? [...text] : text.split(" "), sep = lang() === "ja" ? "" : " ";
    if (text.includes("\n")) return text.split("\n").flatMap(p => wrap(ctx, p, maxW));
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
    do { x.font = `${lang() === "ja" ? 900 : 400} ${size}px ${disp}`; lines = wrap(x, won.a + "\n" + won.b, W - 260); size -= 4; } while (lines.length * size * 1.2 > 640 && size > 40);
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
