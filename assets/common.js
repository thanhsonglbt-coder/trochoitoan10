"use strict";
/* Thư viện dùng chung cho các trò chơi Games Toán 10 */
const SM = (() => {
  const $ = id => document.getElementById(id);
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = a => a[rand(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (n, d = 2) => n.toLocaleString("vi-VN", { maximumFractionDigits: d });
  const parse = s => parseFloat(String(s).trim().replace(",", "."));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };

  /* ---- lưu điểm trên máy học sinh ---- */
  const KEY = "smath10:";
  const load = id => { try { return JSON.parse(localStorage.getItem(KEY + id)) || {}; } catch (e) { return {}; } };
  function save(id, score, stars) {
    const o = load(id), best = Math.max(o.best || 0, score);
    try { localStorage.setItem(KEY + id, JSON.stringify({ best, stars: Math.max(o.stars || 0, stars), plays: (o.plays || 0) + 1 })); } catch (e) {}
    return { best, isNew: score > (o.best || 0) };
  }
  const starsFor = (ratio, t = [0.4, 0.7, 0.9]) => ratio >= t[2] ? 3 : ratio >= t[1] ? 2 : ratio >= t[0] ? 1 : 0;

  /* ---- âm thanh ---- */
  let soundOn = true, ctx;
  try { soundOn = localStorage.getItem(KEY + "sound") !== "off"; } catch (e) {}
  function tone(f, start, dur, type = "sine", vol = 0.07) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime + start;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function beep(ok) {
    if (!soundOn) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ok) { tone(660, 0, 0.12); tone(880, 0.1, 0.18); } else { tone(220, 0, 0.22, "triangle", 0.09); }
    } catch (e) {}
  }
  function initSound() {
    const b = $("snd"); if (!b) return;
    const show = () => { b.textContent = soundOn ? "🔊" : "🔇"; b.setAttribute("aria-pressed", String(soundOn)); };
    b.onclick = () => { soundOn = !soundOn; try { localStorage.setItem(KEY + "sound", soundOn ? "on" : "off"); } catch (e) {} show(); if (soundOn) beep(true); };
    show();
  }

  /* ---- pháo giấy ---- */
  function confetti() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = el("canvas", "confetti"); document.body.append(c);
    const w = c.width = innerWidth, h = c.height = innerHeight, g = c.getContext("2d");
    const cols = ["#efc565", "#17483c", "#286c89", "#b36520", "#d9efde"];
    const ps = Array.from({ length: 90 }, () => ({ x: Math.random() * w, y: -20 - Math.random() * h * 0.4, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, s: 5 + Math.random() * 6, c: pick(cols), r: Math.random() * 6 }));
    let t0 = performance.now();
    (function tick(t) {
      g.clearRect(0, 0, w, h);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += 0.15; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); g.restore(); });
      if (t - t0 < 1900) requestAnimationFrame(tick); else c.remove();
    })(t0);
  }

  /* ---- thanh bước D-K-G ---- */
  function steps(container, labels, active) {
    container.className = "steps"; container.replaceChildren();
    labels.forEach((l, i) => container.append(el("b", i < active ? "done" : i === active ? "on" : "", (i + 1) + ". " + l)));
  }

  /* ---- màn kết thúc ---- */
  function end(o) { // {id,title,score,max,stars,mistakes,again,unit}
    const r = save(o.id, o.score, o.stars);
    const ov = el("div", "overlay"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    const m = el("div", "modal");
    const stars = [1, 2, 3].map(i => `<span class="${i <= o.stars ? "" : "off"}">⭐</span>`).join("");
    const msg = o.stars === 3 ? "Xuất sắc! Em làm chủ phần này rồi." : o.stars === 2 ? "Rất tốt! Chơi lại để đủ 3 sao nhé." : o.stars === 1 ? "Khá lắm! Xem lại các lỗi bên dưới rồi thử lại." : "Đừng nản! Đọc lời giải từng câu rồi chơi lại.";
    m.innerHTML = `<h2>${o.title || "Hoàn thành!"}</h2><div class="stars" aria-label="${o.stars} trên 3 sao">${stars}</div>
      <div class="big">${o.score}${o.max ? " / " + o.max : ""} ${o.unit || "điểm"}</div>
      <p class="muted">Kỷ lục của em: <b>${r.best}</b>${r.isNew ? " 🎉 mới!" : ""}</p><p>${msg}</p>`;
    if (o.mistakes && o.mistakes.length) {
      m.append(el("p", "", "<b>Cần ôn lại:</b>"));
      const ul = el("ul", "review"); o.mistakes.slice(0, 6).forEach(t => ul.append(el("li", "", t))); m.append(ul);
    }
    const row = el("div", "row"); row.style.justifyContent = "center";
    const again = el("button", "btn", "Chơi lại"); again.onclick = () => { ov.remove(); o.again(); };
    const home = el("a", "btn ghost", "Về trang chủ"); home.href = "../index.html"; home.style.textDecoration = "none"; home.style.display = "inline-flex"; home.style.alignItems = "center";
    row.append(again, home); m.append(row); ov.append(m); document.body.append(ov); again.focus();
    if (o.stars >= 2) confetti();
    return r;
  }

  /* ---- ngân hàng mệnh đề P ⇒ Q (kiểm tra tự động trên n = 1..120) ---- */
  const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const PROPS = [
    { p: "n là bội của 6", q: "n là số chẵn", P: n => n % 6 === 0, Q: n => n % 2 === 0 },
    { p: "n là bội của 9", q: "n là bội của 3", P: n => n % 9 === 0, Q: n => n % 3 === 0 },
    { p: "n chia hết cho 4", q: "n là số chẵn", P: n => n % 4 === 0, Q: n => n % 2 === 0 },
    { p: "n chia hết cho 10", q: "n chia hết cho 5", P: n => n % 10 === 0, Q: n => n % 5 === 0 },
    { p: "n² là số chẵn", q: "n là số chẵn", P: n => (n * n) % 2 === 0, Q: n => n % 2 === 0 },
    { p: "n chia hết cho 15", q: "n chia hết cho cả 3 và 5", P: n => n % 15 === 0, Q: n => n % 3 === 0 && n % 5 === 0 },
    { p: "n là số nguyên tố lớn hơn 2", q: "n là số lẻ", P: n => n > 2 && isPrime(n), Q: n => n % 2 === 1 },
    { p: "n là bội của 3", q: "n là bội của 6", P: n => n % 3 === 0, Q: n => n % 6 === 0 },
    { p: "n là số lẻ", q: "n là số nguyên tố", P: n => n % 2 === 1, Q: n => isPrime(n) },
    { p: "n là số chẵn", q: "n chia hết cho 4", P: n => n % 2 === 0, Q: n => n % 4 === 0 },
    { p: "n chia hết cho cả 2 và 3", q: "n chia hết cho 6", P: n => n % 2 === 0 && n % 3 === 0, Q: n => n % 6 === 0 },
    { p: "n chia hết cho 5", q: "n chia hết cho 10", P: n => n % 5 === 0, Q: n => n % 10 === 0 },
    { p: "n chia hết cho 8", q: "n chia hết cho 4", P: n => n % 8 === 0, Q: n => n % 4 === 0 },
    { p: "n tận cùng bằng 5", q: "n chia hết cho 5", P: n => n % 10 === 5, Q: n => n % 5 === 0 }
  ];
  const holds = (P, Q) => { for (let n = 1; n <= 120; n++) if (P(n) && !Q(n)) return false; return true; };

  return { $, rand, pick, shuffle, fmt, parse, el, load, save, starsFor, beep, initSound, confetti, steps, end, PROPS, holds };
})();
