import { useEffect, useRef, useCallback } from 'react';

import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.png';

// ── Helpers ──────────────────────────────────────────────────────────────────
function clamp(v) { return Math.min(255, Math.max(0, Math.round(v))); }
function lerp(a, b, t) { return a + (b - a) * t; }

function seededRng(seed) {
  let s = (seed % 2147483647 + 2147483647) % 2147483647 || 1;
  return () => { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
}

function seededNoise(seed) {
  const P = 256, perm = new Uint8Array(P * 2);
  const rng = seededRng(seed);
  for (let i = 0; i < P; i++) perm[i] = i;
  for (let i = P - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < P; i++) perm[P + i] = perm[i];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (h, x, y) => ((h & 1) ? x : -x) + ((h & 2) ? y : -y);
  return (x, y) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = perm[X] + Y, b = perm[X + 1] + Y;
    return ((1 - v) * ((1 - u) * grad(perm[a], x, y) + u * grad(perm[b], x - 1, y)) +
      v * ((1 - u) * grad(perm[a + 1], x, y - 1) + u * grad(perm[b + 1], x - 1, y - 1))) * 0.5 + 0.5;
  };
}

function drawCarpetFrame(ctx, W, H, seed, dirtT) {
  const CR = { r: 148, g: 150, b: 155 };
  const DR = { r: 80, g: 68, b: 55 };
  const base = { r: lerp(CR.r, DR.r, dirtT), g: lerp(CR.g, DR.g, dirtT), b: lerp(CR.b, DR.b, dirtT) };
  const n1 = seededNoise(seed), n2 = seededNoise(seed + 99), n3 = seededNoise(seed + 199);
  const imgData = ctx.createImageData(W, H);
  const d = imgData.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const fine = n1(x * 0.22, y * 0.22);
      const medium = n2(x * 0.06 + 3, y * 0.06 + 3);
      const shimmer = n3(x * 0.30 + 7, y * 0.03 + 7);
      const combined = fine * 0.55 + medium * 0.3 + shimmer * 0.15;
      const vary = (combined - 0.5) * 60;
      const r = clamp(base.r + vary);
      const g = clamp(base.g + vary * 0.97);
      const b = clamp(base.b + vary * 0.92 + shimmer * 8);
      const idx = (y * W + x) * 4;
      d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  if (dirtT > 0.02) {
    const rng = seededRng(seed + 300);
    const count = Math.floor(dirtT * 16);
    for (let i = 0; i < count; i++) {
      const sx = rng() * W, sy = rng() * H, sr = 8 + rng() * 26;
      const alpha = dirtT * (0.28 + rng() * 0.38);
      const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      const sr2 = clamp(base.r * 0.42), sg2 = clamp(base.g * 0.38), sb2 = clamp(base.b * 0.30);
      g2.addColorStop(0, `rgba(${sr2},${sg2},${sb2},${alpha})`);
      g2.addColorStop(1, `rgba(${sr2},${sg2},${sb2},0)`);
      ctx.fillStyle = g2;
      ctx.beginPath();
      const lr = seededRng(seed + i * 53);
      ctx.ellipse(sx, sy, sr, sr * (0.45 + lr() * 0.9), lr() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    const rng2 = seededRng(seed + 500);
    for (let i = 0; i < Math.floor(dirtT * 5); i++) {
      const fx = 15 + rng2() * (W - 30), fy = 15 + rng2() * (H - 30);
      ctx.fillStyle = `rgba(35,25,15,${dirtT * 0.2})`;
      ctx.beginPath();
      ctx.ellipse(fx, fy, 9 + rng2() * 10, 5 + rng2() * 6, rng2() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, `rgba(0,0,0,${0.12 + dirtT * 0.1})`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

// ── Constants ────────────────────────────────────────────────────────────────
const N = 6;
const seeds = [101, 202, 303, 404, 505, 606];

export default function CarpetGame() {
  const containerRef = useRef(null);
  const stateRef = useRef({
    stage: 'idle',
    canvasContent: [0, 1, 2, 3, 4, 5],
    cleanLogical: -1,
    cleanPos: -1,
  });

  const getEl = useCallback((id) => containerRef.current?.querySelector(`#${id}`), []);
  const getCtx = useCallback((i) => getEl('c' + i)?.getContext('2d'), [getEl]);
  const getCanvas = useCallback((i) => getEl('c' + i), [getEl]);

  const initAllDirty = useCallback(() => {
    const s = stateRef.current;
    s.canvasContent = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i < N; i++) {
      drawCarpetFrame(getCtx(i), 200, 200, seeds[i], 1.0);
      getEl('cover' + i)?.classList.remove('visible');
      getEl('reveal' + i)?.classList.remove('visible');
    }
  }, [getCtx, getEl]);

  const setDots = useCallback((active) => {
    for (let i = 0; i < 3; i++) {
      const el = getEl('dot' + i);
      if (el) el.className = 'cg-stage-dot' + (i === active ? ' active' : i < active ? ' done' : '');
    }
  }, [getEl]);

  const setMsg = useCallback((m) => {
    const el = getEl('messageBox');
    if (el) el.innerHTML = m;
  }, [getEl]);

  const launchConfetti = useCallback(() => {
    const wrap = getEl('confettiWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    const cols = ['#1278b4', '#1a92d0', '#f9a825', '#e65100', '#ffffff', '#bbdefb'];
    for (let i = 0; i < 70; i++) {
      const el = document.createElement('div');
      el.className = 'cg-confetti-piece';
      el.style.cssText = `left:${Math.random() * 100}vw;width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;background:${cols[Math.floor(Math.random() * cols.length)]};border-radius:${Math.random() > .5 ? '50%' : '2px'};animation-duration:${1.4 + Math.random() * 2}s;animation-delay:${Math.random() * .8}s;opacity:${0.8 + Math.random() * .2}`;
      wrap.appendChild(el);
    }
    setTimeout(() => { if (wrap) wrap.innerHTML = ''; }, 4000);
  }, [getEl]);

  const highlightTile = useCallback((i, on) => {
    const t = getEl('tile' + i);
    if (!t) return;
    t.style.border = on ? '3px solid #1a92d0' : '3px solid transparent';
    t.style.boxShadow = on ? '0 0 0 4px rgba(26,146,208,0.4)' : 'none';
  }, [getEl]);

  const showBtn = useCallback((label, cls) => {
    const b = getEl('mainBtn');
    if (!b) return;
    b.textContent = label;
    b.className = 'cg-btn ' + cls;
    b.style.display = 'block';
    b.onclick = () => resetGame();
  }, [getEl]);

  const closeVoucher = useCallback(() => {
    getEl('voucherOverlay')?.classList.remove('show');
    // Open Facebook Messenger with pre-filled message
    window.open('https://m.me/WirralCarpetCleaning', '_blank');
  }, [getEl]);

  const handleGuess = useCallback((i) => {
    const s = stateRef.current;
    if (s.stage !== 'guessing') return;
    s.stage = 'result';

    for (let j = 0; j < N; j++) {
      getEl('tile' + j)?.classList.remove('clickable');
      const t = getEl('tile' + j);
      if (t) t.onclick = null;
    }

    getEl('cover' + i)?.classList.remove('visible');

    if (i === s.cleanPos) {
      setTimeout(() => {
        getEl('tile' + i)?.classList.add('correct');
        getEl('reveal' + i)?.classList.add('visible');
      }, 200);
      setDots(2);
      const gt = getEl('gameTitle');
      if (gt) gt.textContent = '\u{1F3C6} You Found It!';
      setMsg('\u{1F389} <strong>Correct!</strong> Just like Wirral Carpet Cleaning \u2014 we find every hidden stain!');
      setTimeout(() => { launchConfetti(); setTimeout(() => getEl('voucherOverlay')?.classList.add('show'), 500); }, 700);
      showBtn('\u{1F504} Play Again', 'cg-btn-green');
    } else {
      getEl('tile' + i)?.classList.add('wrong');
      setTimeout(() => {
        getEl('cover' + s.cleanPos)?.classList.remove('visible');
        setTimeout(() => {
          getEl('tile' + s.cleanPos)?.classList.add('correct');
          getEl('reveal' + s.cleanPos)?.classList.add('visible');
        }, 200);
      }, 700);
      const gt = getEl('gameTitle');
      if (gt) gt.textContent = '\u{1F605} Nearly!';
      setMsg('\u274C Not quite! We\'ve revealed the clean one for you. Try again!');
      showBtn('\u{1F504} Try Again!', 'cg-btn-gold');
    }
  }, [getEl, setDots, setMsg, launchConfetti, showBtn]);

  const startGuessing = useCallback(() => {
    const s = stateRef.current;
    s.stage = 'guessing';
    setDots(2);
    const st = getEl('stageText');
    if (st) st.textContent = 'Find the clean carpet!';
    const gt = getEl('gameTitle');
    if (gt) gt.textContent = '\u{1F50D} Which is Clean?';
    const gd = getEl('gameDesc');
    if (gd) gd.textContent = 'Tap a tile to flip it over \u2014 can you find the freshly cleaned carpet?';
    setMsg('\u{1F446} Tap any tile to reveal what\'s underneath!');

    for (let i = 0; i < N; i++) {
      const t = getEl('tile' + i);
      if (t) {
        t.classList.add('clickable');
        t.onclick = () => handleGuess(i);
      }
    }
  }, [getEl, setDots, setMsg, handleGuess]);

  const animateSwap = useCallback((a, b, cb) => {
    const tA = getEl('tile' + a), tB = getEl('tile' + b);
    if (!tA || !tB) return;
    const rA = tA.getBoundingClientRect(), rB = tB.getBoundingClientRect();
    const dx = rB.left - rA.left, dy = rB.top - rA.top;
    const dur = '0.32s';
    tA.style.transition = `transform ${dur} cubic-bezier(0.4,0,0.2,1)`;
    tB.style.transition = `transform ${dur} cubic-bezier(0.4,0,0.2,1)`;
    tA.style.zIndex = '10';
    tA.style.transform = `translate(${dx}px,${dy}px)`;
    tB.style.transform = `translate(${-dx}px,${-dy}px)`;

    setTimeout(() => {
      const cA = getCanvas(a), cB = getCanvas(b);
      if (cA && cB) {
        const tmp = document.createElement('canvas'); tmp.width = 200; tmp.height = 200;
        tmp.getContext('2d').drawImage(cA, 0, 0);
        getCtx(a).drawImage(cB, 0, 0);
        getCtx(b).drawImage(tmp, 0, 0);
      }
      tA.style.transition = 'none'; tB.style.transition = 'none';
      tA.style.transform = ''; tB.style.transform = '';
      tA.style.zIndex = '';
      if (cb) cb();
    }, 340);
  }, [getEl, getCanvas, getCtx]);

  const coverPhase = useCallback(() => {
    const s = stateRef.current;
    highlightTile(s.cleanPos, false);
    for (let i = 0; i < N; i++) getEl('cover' + i)?.classList.add('visible');

    setDots(1);
    const st = getEl('stageText');
    if (st) st.textContent = 'Shuffling the tiles...';
    const gt = getEl('gameTitle');
    if (gt) gt.textContent = '\u{1F500} Watch the Shuffle!';
    const gd = getEl('gameDesc');
    if (gd) gd.textContent = 'Keep your eye on where the clean tile goes!';
    setMsg('\u{1F440} Follow the clean carpet as we shuffle...');

    const totalSwaps = 8;
    const gap = 5000 / totalSwaps;
    let done = 0;

    function doSwap() {
      const a = Math.floor(Math.random() * N);
      let b; do { b = Math.floor(Math.random() * N); } while (b === a);

      animateSwap(a, b, () => {
        if (s.cleanPos === a) s.cleanPos = b;
        else if (s.cleanPos === b) s.cleanPos = a;
        [s.canvasContent[a], s.canvasContent[b]] = [s.canvasContent[b], s.canvasContent[a]];
        done++;
        if (done < totalSwaps) setTimeout(doSwap, gap - 350);
        else setTimeout(() => setTimeout(startGuessing, 300), 500);
      });
    }
    setTimeout(doSwap, 400);
  }, [getEl, setDots, setMsg, highlightTile, animateSwap, startGuessing]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.stage = 'showing';
    const btn = getEl('mainBtn');
    if (btn) btn.style.display = 'none';
    s.cleanLogical = Math.floor(Math.random() * N);
    s.cleanPos = s.cleanLogical;
    s.canvasContent = [0, 1, 2, 3, 4, 5];

    initAllDirty();
    setDots(0);
    const st = getEl('stageText');
    if (st) st.textContent = 'Watch which carpet is cleaned...';
    const gt = getEl('gameTitle');
    if (gt) gt.textContent = '\u2728 Watch Carefully!';
    const gd = getEl('gameDesc');
    if (gd) gd.textContent = 'One carpet is being professionally cleaned \u2014 remember which one!';
    setMsg('\u{1F9F9} Carpet <strong>#' + (s.cleanPos + 1) + '</strong> is being cleaned...');

    const ctx = getCtx(s.cleanPos);
    const dur = 1800, start = performance.now();
    function anim(now) {
      const t = Math.min((now - start) / dur, 1);
      drawCarpetFrame(ctx, 200, 200, seeds[s.cleanLogical], 1 - t);
      if (t < 1) { requestAnimationFrame(anim); }
      else {
        drawCarpetFrame(ctx, 200, 200, seeds[s.cleanLogical], 0);
        highlightTile(s.cleanPos, true);
        setMsg('\u2705 <strong>Remember this one!</strong> Covering tiles in 2 seconds...');
        setTimeout(coverPhase, 2000);
      }
    }
    requestAnimationFrame(anim);
  }, [getEl, getCtx, initAllDirty, setDots, setMsg, highlightTile, coverPhase]);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.stage = 'idle';
    getEl('voucherOverlay')?.classList.remove('show');
    for (let i = 0; i < N; i++) {
      const t = getEl('tile' + i);
      if (t) { t.className = 'cg-carpet-tile'; t.style.cssText = ''; t.onclick = null; }
      getEl('cover' + i)?.classList.remove('visible');
      getEl('reveal' + i)?.classList.remove('visible');
    }
    initAllDirty();
    const gt = getEl('gameTitle');
    if (gt) gt.textContent = '\u{1F3AF} Spot the Clean Carpet!';
    const gd = getEl('gameDesc');
    if (gd) gd.textContent = 'One carpet will be shown freshly cleaned \u2014 then we cover and shuffle slowly. Find it to win \u00A310 off!';
    setDots(0);
    const st = getEl('stageText');
    if (st) st.textContent = 'Watch the clean carpet...';
    setMsg('Press Start to play!');
    const b = getEl('mainBtn');
    if (b) {
      b.textContent = '\u25B6 Start the Challenge';
      b.className = 'cg-btn cg-btn-green';
      b.style.display = 'block';
      b.onclick = () => startGame();
    }
  }, [getEl, initAllDirty, setDots, setMsg, startGame]);

  // Initialize on mount
  useEffect(() => {
    if (containerRef.current) {
      initAllDirty();
    }
  }, [initAllDirty]);

  const tiles = Array.from({ length: N }, (_, i) => (
    <div className="cg-carpet-tile" id={`tile${i}`} key={i}>
      <canvas className="cg-carpet-canvas" id={`c${i}`} width="200" height="200" />
      <div className="cg-tile-cover" id={`cover${i}`}>{'\u2753'}<div className="cg-tile-cover-hint">Tap me</div></div>
      <div className="cg-tile-reveal" id={`reveal${i}`}><span>{'\u2728'} CLEAN!</span></div>
    </div>
  ));

  return (
    <>
      <Helmet>
        <title>Find the Clean Carpet Game | Wirral Carpet Cleaning</title>
        <meta name="description" content="Play our fun carpet game - spot the clean carpet and win \u00A310 off your next clean! Wirral Carpet Cleaning." />
      </Helmet>
      <div className="cg-page" ref={containerRef}>
        <div className="cg-container">
          <div className="cg-header">
            <div className="cg-logo-row">
              <img src={logo} alt="Wirral Carpet Cleaning" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div className="cg-brand-name">Wirral Carpet<br />Cleaning</div>
                <div className="cg-brand-sub">Professional Service</div>
              </div>
            </div>
            <div className="cg-header-tagline">Your Local Carpet Cleaning Company</div>
          </div>

          <div className="cg-body">
            <div className="cg-game-title" id="gameTitle">{'\u{1F3AF}'} Spot the Clean Carpet!</div>
            <div className="cg-game-desc" id="gameDesc">One carpet will be shown freshly cleaned &mdash; then we cover and shuffle slowly. Find it to win &pound;10 off!</div>

            <div className="cg-stage-indicator">
              <div className="cg-stage-dot active" id="dot0" />
              <div className="cg-stage-dot" id="dot1" />
              <div className="cg-stage-dot" id="dot2" />
              <span id="stageText">Watch the clean carpet...</span>
            </div>

            <div className="cg-grid-wrapper" id="grid">{tiles}</div>

            <div className="cg-message-box" id="messageBox">Press Start to play!</div>
            <button className="cg-btn cg-btn-green" id="mainBtn" onClick={() => startGame()}>{'\u25B6'} Start the Challenge</button>
          </div>
          <div className="cg-footer-strip">{'\u{1F310}'} <a href="https://www.wirralcarpetcleaning.com">wirralcarpetcleaning.com</a></div>
        </div>

        {/* Voucher overlay */}
        <div className="cg-voucher-overlay" id="voucherOverlay">
          <div className="cg-voucher-card">
            <div className="cg-voucher-top">
              <div className="cg-voucher-icon">{'\u{1F389}'}</div>
              <div className="cg-voucher-title">You Found It! Well Done!</div>
              <div className="cg-voucher-subtitle">Just like our experts find every hidden stain</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 24px' }}>
              <div className="cg-voucher-amount-wrap">
                <div className="cg-voucher-off">YOU SAVE</div>
                <div className="cg-voucher-amount">&pound;10</div>
                <div className="cg-voucher-discount">OFF your clean</div>
              </div>
            </div>
            <div className="cg-voucher-body">
              <div className="cg-voucher-code-label">Your Discount Code</div>
              <div className="cg-voucher-code">WIRRAL10</div>
              <div className="cg-voucher-terms">Quote code WIRRAL10 when booking. Valid on first booking only. Cannot be combined with other offers. Subject to minimum booking value.</div>
              <div className="cg-voucher-phone">{'\u{1F4DE}'} 0151 936 9664 / 07724 564683</div>
              <button className="cg-btn-close-voucher" onClick={closeVoucher}>Claim on Messenger &rarr;</button>
            </div>
          </div>
        </div>

        {/* Confetti */}
        <div className="cg-confetti-wrap" id="confettiWrap" />
      </div>

      <style>{`
        .cg-page {
          font-family: 'Open Sans', sans-serif;
          background: linear-gradient(135deg, #0d4f7a 0%, #1278b4 50%, #0d4f7a 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .cg-container {
          background: white;
          border-radius: 24px;
          max-width: 560px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.4);
        }
        .cg-header {
          background: linear-gradient(135deg, #1278b4, #1a92d0);
          padding: 22px 28px 18px;
          text-align: center;
          position: relative;
        }
        .cg-header::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 20px;
          background: white;
          border-radius: 20px 20px 0 0;
        }
        .cg-logo-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 6px; }
        .cg-brand-name { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 22px; color: white; line-height: 1.1; text-align: left; }
        .cg-brand-sub { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 1px; text-transform: uppercase; }
        .cg-header-tagline { color: rgba(255,255,255,0.9); font-size: 13px; margin-top: 4px; }
        .cg-body { padding: 24px 28px 28px; }
        .cg-game-title { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 20px; color: #1a1a1a; text-align: center; margin-bottom: 6px; }
        .cg-game-desc { color: #6b6b6b; font-size: 13.5px; text-align: center; margin-bottom: 20px; line-height: 1.5; }
        .cg-stage-indicator { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 18px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; color: #1278b4; text-transform: uppercase; letter-spacing: 0.5px; }
        .cg-stage-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; transition: all 0.3s; }
        .cg-stage-dot.active { background: #f9a825; transform: scale(1.4); }
        .cg-stage-dot.done { background: #1a92d0; }
        .cg-grid-wrapper {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
          position: relative;
        }
        .cg-carpet-tile {
          aspect-ratio: 1;
          border-radius: 12px;
          cursor: default;
          position: relative;
          overflow: hidden;
          border: 3px solid transparent;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #555;
        }
        .cg-carpet-tile.clickable { cursor: pointer; }
        .cg-carpet-tile.clickable:hover { border-color: #1a92d0; box-shadow: 0 4px 20px rgba(18,120,180,0.35); transform: scale(1.04); }
        .cg-carpet-tile.correct { border-color: #43a047 !important; box-shadow: 0 0 0 4px rgba(26,146,208,0.4) !important; animation: cgCorrectPulse 0.5s ease; }
        .cg-carpet-tile.wrong { border-color: #e53935 !important; box-shadow: 0 0 0 4px rgba(229,57,53,0.3) !important; animation: cgWrongShake 0.4s ease; }
        @keyframes cgCorrectPulse { 0%{transform:scale(1)} 50%{transform:scale(1.07)} 100%{transform:scale(1)} }
        @keyframes cgWrongShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 60%{transform:translateX(6px)} }
        .cg-carpet-canvas { display: block; width: 100%; height: 100%; border-radius: 9px; }
        .cg-tile-cover {
          position: absolute; inset: 0; border-radius: 9px;
          background: linear-gradient(135deg, #2a2a2a, #3d3d3d);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
          font-size: 28px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.35s;
        }
        .cg-tile-cover.visible { opacity: 1; }
        .cg-tile-cover-hint {
          font-family: 'Montserrat', sans-serif; font-weight: 800;
          font-size: 10px; color: rgba(255,255,255,0.5);
          letter-spacing: 1px; text-transform: uppercase;
        }
        .cg-carpet-tile.clickable .cg-tile-cover { animation: cgCoverPulse 2s ease-in-out infinite; }
        @keyframes cgCoverPulse {
          0%,100% { background: linear-gradient(135deg,#2a2a2a,#3d3d3d); }
          50% { background: linear-gradient(135deg,#0d4f7a,#1278b4); }
        }
        .cg-tile-reveal {
          position: absolute; inset: 0; border-radius: 9px;
          background: linear-gradient(135deg, #1a92d0, #1278b4);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
          opacity: 0; pointer-events: none; transition: opacity 0.45s;
        }
        .cg-tile-reveal.visible { opacity: 1; }
        .cg-tile-reveal span { color: white; font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: 0.5px; }
        .cg-message-box { min-height: 52px; text-align: center; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 15px; color: #1278b4; display: flex; align-items: center; justify-content: center; padding: 0 10px; }
        .cg-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 15px; cursor: pointer; letter-spacing: 0.4px; transition: all 0.2s; margin-top: 6px; }
        .cg-btn-green { background: linear-gradient(135deg, #1278b4, #1a92d0); color: white; box-shadow: 0 4px 16px rgba(18,120,180,0.35); }
        .cg-btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(18,120,180,0.45); }
        .cg-btn-gold { background: linear-gradient(135deg, #f9a825, #e65100); color: white; animation: cgGoldPulse 2s infinite; }
        @keyframes cgGoldPulse { 0%,100%{box-shadow:0 4px 16px rgba(230,81,0,.35)} 50%{box-shadow:0 6px 28px rgba(230,81,0,.6)} }
        .cg-voucher-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:100; align-items:center; justify-content:center; padding:20px; }
        .cg-voucher-overlay.show { display:flex; animation:cgFadeIn .3s ease; }
        @keyframes cgFadeIn { from{opacity:0} to{opacity:1} }
        .cg-voucher-card { background:white; border-radius:24px; max-width:400px; width:100%; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.5); animation:cgSlideUp .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes cgSlideUp { from{transform:translateY(40px) scale(.9);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
        .cg-voucher-top { background:linear-gradient(135deg,#1278b4,#1a92d0); padding:24px 24px 20px; text-align:center; color:white; }
        .cg-voucher-icon { font-size:48px; margin-bottom:6px; }
        .cg-voucher-title { font-family:'Montserrat',sans-serif; font-weight:900; font-size:18px; margin-bottom:4px; }
        .cg-voucher-subtitle { font-size:13px; opacity:.9; }
        .cg-voucher-amount-wrap { margin:20px auto; width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg,#f9a825,#e65100); display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 8px 30px rgba(230,81,0,.4); }
        .cg-voucher-off { font-size:11px; color:rgba(255,255,255,.85); font-weight:700; letter-spacing:1px; text-transform:uppercase; }
        .cg-voucher-amount { font-family:'Montserrat',sans-serif; font-weight:900; font-size:44px; color:white; line-height:1; }
        .cg-voucher-discount { font-size:13px; color:rgba(255,255,255,.85); font-weight:600; }
        .cg-voucher-body { padding:20px 24px 24px; text-align:center; }
        .cg-voucher-code-label { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#6b6b6b; margin-bottom:6px; font-weight:700; }
        .cg-voucher-code { background:#e3f2fd; border:2px dashed #1a92d0; border-radius:10px; padding:10px; font-family:'Montserrat',sans-serif; font-weight:900; font-size:22px; color:#1278b4; letter-spacing:3px; margin-bottom:14px; }
        .cg-voucher-terms { font-size:11px; color:#6b6b6b; margin-bottom:16px; line-height:1.5; }
        .cg-voucher-phone { font-family:'Montserrat',sans-serif; font-weight:800; font-size:18px; color:#1278b4; margin-bottom:14px; }
        .cg-btn-close-voucher { width:100%; padding:13px; background:linear-gradient(135deg,#1278b4,#1a92d0); color:white; border:none; border-radius:10px; font-family:'Montserrat',sans-serif; font-weight:800; font-size:14px; cursor:pointer; transition:all .2s; }
        .cg-btn-close-voucher:hover { transform:translateY(-1px); box-shadow:0 4px 16px rgba(18,120,180,.4); }
        .cg-confetti-wrap { position:fixed; inset:0; pointer-events:none; z-index:99; }
        .cg-confetti-piece { position:absolute; top:-10px; animation:cgFall linear forwards; }
        @keyframes cgFall { to{transform:translateY(110vh) rotate(720deg);opacity:0} }
        .cg-footer-strip { background:#e3f2fd; padding:10px 20px; text-align:center; font-size:11.5px; color:#1278b4; font-weight:600; border-top:1px solid #bbdefb; }
        .cg-footer-strip a { color:#1278b4; }
      `}</style>
    </>
  );
}
