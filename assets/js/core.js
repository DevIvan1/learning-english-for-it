/* DevSpeak core — shared layout, progress storage, speech synthesis and helpers.
   Everything runs locally in the browser: no CDNs, web fonts or external APIs,
   so the site works in Russia without a VPN and even offline. */
(function () {
  'use strict';

  const DS = (window.DS = window.DS || {});

  /* ---------- small helpers ---------- */
  DS.$ = (sel, root) => (root || document).querySelector(sel);
  DS.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  DS.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  DS.slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  DS.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  DS.sample = (arr, n) => DS.shuffle(arr).slice(0, n);
  DS.wait = (ms) => new Promise((r) => setTimeout(r, ms));
  DS.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  DS.norm = (s) => String(s).toLowerCase().replace(/[‘’`´]/g, "'").replace(/[^a-z0-9'\s-]/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  // Loose equality for typed answers: "plug-in" == "plugin" == "plug in"
  DS.same = (a, b) => DS.norm(a).replace(/[\s']/g, '') === DS.norm(b).replace(/[\s']/g, '');
  DS.plural = (n, one, few, many) => {
    const a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b === 1) return one;
    if (b > 1 && b < 5) return few;
    return many;
  };
  DS.fmtTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  DS.reducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  DS.firstMeaning = (ru) => String(ru).split(/[;,(]/)[0].trim();
  DS.sentences = (text) => {
    const parts = String(text).match(/[^.!?]+[.!?]+["'»)\]]*|[^.!?]+$/g) || [text];
    return parts.map((s) => s.trim()).filter(Boolean);
  };
  // Plain text for speech: strips [[term|id]] markers and quotes
  DS.plain = (s) => String(s).replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1').replace(/[«»]/g, '"').replace(/[<>]/g, '');
  // Text with [[term|id]] markers -> HTML with glossary buttons
  DS.markup = (s) => DS.esc(s).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, text, id) => {
    const key = id || DS.slug(text);
    return `<button type="button" class="term" data-id="${key}">${text}</button>`;
  });

  /* ---------- tiny syntax highlighter (HTML / CSS / JS / PHP) ---------- */
  const TOKENS = /(<!--[\s\S]*?-->|\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(<\?php|<\?=|\?>|<\/?[a-zA-Z][\w-]*|\/?>|<!DOCTYPE)|(\$[a-zA-Z_]\w*)|\b(const|let|var|function|return|if|else|foreach|as|echo|new|true|false|null|document)\b|(=>)|(\b\d+(?:\.\d+)?\b|#[0-9a-fA-F]{3,8}\b)|([a-zA-Z_][\w-]*)(?==)|([a-zA-Z-]+)(?=\s*:\s)/g;
  DS.highlight = (code) => {
    let out = '', last = 0, m;
    TOKENS.lastIndex = 0;
    while ((m = TOKENS.exec(code))) {
      out += DS.esc(code.slice(last, m.index));
      const cls = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'tag' : m[4] ? 'var' : m[5] ? 'kw' : m[6] ? 'kw' : m[7] ? 'num' : m[8] ? 'attr' : 'prop';
      out += `<span class="tk-${cls}">${DS.esc(m[0])}</span>`;
      last = TOKENS.lastIndex;
      if (!m[0].length) TOKENS.lastIndex++;
    }
    return out + DS.esc(code.slice(last));
  };

  /* ---------- icons (inline SVG, stroke style) ---------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/><path d="M9 7h7M9 11h5"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
    gamepad: '<rect x="2" y="7" width="20" height="12" rx="5"/><path d="M7 11v4M5 13h4"/><circle cx="15.5" cy="12" r="1" fill="currentColor"/><circle cx="18" cy="14.5" r="1" fill="currentColor"/>',
    headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-7h3zM3 19a2 2 0 0 0 2 2h1v-7H3z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
    video: '<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3z"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>',
    record: '<circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/>',
    prev: '<path d="M18 5v14L8 12z" fill="currentColor" stroke="none"/><path d="M6 5v14"/>',
    next: '<path d="M6 5v14l10-7z" fill="currentColor" stroke="none"/><path d="M18 5v14"/>',
    volume: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    access: '<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5 9 21M12 14.5l3 6.5"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15v4M17 17h4"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    flame: '<path d="M12 22c4 0 7-2.7 7-6.5 0-3.5-2.5-5.5-3.5-8.5-1 2-2.5 3-3.5 3 0-3-1-6-4-8 .5 3-2 5.5-3.5 7.5A8.3 8.3 0 0 0 5 15.5C5 19.3 8 22 12 22z"/>',
    bug: '<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 11v9M3 13h4M17 13h4M4 7l3 2M20 7l-3 2M4 20l3-2M20 20l-3-2M9 7a3 3 0 0 1 6 0"/>',
    columns: '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>',
    swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    type: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    cc: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M10 10.5a2.2 2.2 0 1 0 0 3M17 10.5a2.2 2.2 0 1 0 0 3"/>',
    print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    turtle: '<path d="M4 15c0-4 3.6-7 8-7s8 3 8 7z"/><path d="M20 13h2M6 15l-1 3M18 15l1 3M9 8.5 12 11l3-2.5"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15 6 12l3-5c2.5-4 7-5 12-4 1 5 0 9.5-4 12l-5 3z"/><circle cx="15" cy="9" r="1.5"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    wifiOff: '<path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M19 13a10 10 0 0 0-2.2-1.6M2 9.5A15 15 0 0 1 6.3 7M22 9.5A15 15 0 0 0 11 5.1"/><path d="M12 20h.01"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 9"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.6 0-1.3-1-1.7-1-2.9 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><circle cx="15" cy="7.5" r="1" fill="currentColor"/>'
  };
  DS.icon = (name, cls) => `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.info}</svg>`;
  function hydrateIcons(root) {
    DS.$$('[data-icon]', root).forEach((el) => {
      el.outerHTML = DS.icon(el.dataset.icon, el.getAttribute('class') || '');
    });
  }
  DS.hydrateIcons = hydrateIcons;

  /* ---------- persistent state (localStorage with safe fallback) ---------- */
  const KEY = 'devspeak:v1';
  let mem = null;
  function read() {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { mem = {}; }
    return mem;
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* private mode — keep in memory */ }
  }
  DS.state = {
    get(k, def) { const s = read(); return k in s ? s[k] : def; },
    set(k, v) { read()[k] = v; persist(); },
    reset() { mem = {}; persist(); }
  };

  DS.settings = () => Object.assign({ voice: '', rate: 1 }, DS.state.get('settings', {}));
  DS.saveSettings = (patch) => DS.state.set('settings', Object.assign(DS.settings(), patch));

  DS.progress = {
    isKnown: (id) => !!DS.state.get('known', {})[id],
    knownCount() { return Object.keys(DS.state.get('known', {})).length; },
    setKnown(id, on) {
      const k = DS.state.get('known', {});
      if (on) k[id] = 1; else delete k[id];
      DS.state.set('known', k);
    },
    isDone: (kind, id) => !!DS.state.get(kind, {})[id],
    count: (kind) => Object.keys(DS.state.get(kind, {})).length,
    markDone(kind, id) {
      const m = DS.state.get(kind, {});
      if (m[id]) return false;
      m[id] = Date.now();
      DS.state.set(kind, m);
      return true;
    }
  };

  // Best results. lower=true for "fewer is better" (moves, seconds)
  DS.record = (key, value, lower) => {
    const r = DS.state.get('records', {});
    const prev = r[key];
    const isNew = prev == null || (lower ? value < prev : value > prev);
    if (isNew) { r[key] = value; DS.state.set('records', r); }
    return { best: isNew ? value : prev, prev, isNew };
  };
  DS.getRecord = (key) => DS.state.get('records', {})[key];

  /* ---------- XP & levels ---------- */
  const LEVELS = [
    { min: 0, name: 'Intern', ru: 'Стажёр' },
    { min: 150, name: 'Junior', ru: 'Младший разработчик' },
    { min: 400, name: 'Middle', ru: 'Разработчик' },
    { min: 800, name: 'Senior', ru: 'Старший разработчик' },
    { min: 1400, name: 'Tech Lead', ru: 'Технический лидер' },
    { min: 2200, name: 'CTO', ru: 'Технический директор' }
  ];
  DS.levels = LEVELS;
  DS.levelOf = (xp) => {
    let i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].min) i++;
    const cur = LEVELS[i], next = LEVELS[i + 1];
    const pct = next ? Math.round(((xp - cur.min) / (next.min - cur.min)) * 100) : 100;
    return { index: i, name: cur.name, ru: cur.ru, min: cur.min, next, pct };
  };
  DS.xp = () => DS.state.get('xp', 0);
  DS.addXP = (n, why) => {
    n = Math.round(n);
    if (!n) return;
    const before = DS.levelOf(DS.xp());
    const xp = DS.xp() + n;
    DS.state.set('xp', xp);
    const after = DS.levelOf(xp);
    DS.toast(`+${n} XP${why ? ' · ' + why : ''}`, 'xp');
    renderXP();
    if (after.index > before.index) {
      setTimeout(() => { DS.toast(`Новый уровень: ${after.name}!`, 'level', 4000); DS.confetti(); }, 500);
    }
    document.dispatchEvent(new CustomEvent('ds:xp', { detail: { xp } }));
  };
  // XP that can be earned only once per key (lessons, podcasts, videos)
  DS.awardOnce = (key, n, why) => {
    const a = DS.state.get('awards', {});
    if (a[key]) return false;
    a[key] = 1;
    DS.state.set('awards', a);
    DS.addXP(n, why);
    return true;
  };

  /* ---------- toasts & confetti ---------- */
  DS.toast = (msg, type, ms) => {
    let wrap = DS.$('.toasts');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toasts';
      wrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(wrap);
    }
    const ico = { xp: 'zap', ok: 'checkCircle', level: 'trophy', warn: 'alert' }[type] || 'info';
    const t = document.createElement('div');
    t.className = 'toast toast-' + (type || 'info');
    t.innerHTML = DS.icon(ico) + `<span>${DS.esc(msg)}</span>`;
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, ms || 2600);
  };
  DS.confetti = () => {
    if (DS.reducedMotion()) return;
    const wrap = document.createElement('div');
    wrap.className = 'confetti';
    const colors = ['#6366f1', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('i');
      p.style.cssText = `--x:${Math.random() * 100}vw;--dx:${(Math.random() - 0.5) * 240}px;--r:${Math.random() * 720 - 360}deg;--t:${1.6 + Math.random() * 1.4}s;--dl:${Math.random() * 0.35}s;background:${colors[i % colors.length]};width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px`;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 3600);
  };

  /* ---------- speech synthesis ---------- */
  const Speech = (DS.speech = (function () {
    const synth = window.speechSynthesis;
    const supported = !!(synth && window.SpeechSynthesisUtterance);
    let en = [];
    let gen = 0;
    const subs = [];
    const alive = new Set(); // keep utterances referenced (Chrome may GC them and drop events)

    function load() {
      if (!supported) return;
      const all = synth.getVoices() || [];
      en = all.filter((v) => /^en([-_]|$)/i.test(v.lang));
      subs.forEach((fn) => { try { fn(en); } catch (e) { /* ignore */ } });
    }
    if (supported) {
      load();
      if (synth.addEventListener) synth.addEventListener('voiceschanged', load);
      else synth.onvoiceschanged = load;
      setTimeout(load, 300);
      setTimeout(load, 1500);
    }

    const F = /female|zira|aria|jenny|samantha|victoria|karen|moira|tessa|fiona|susan|hazel|libby|sonia|emma|\bava\b|michelle|serena|allison|catherine|joanna|salli|kimberly|ivy|kendra|natasha|clara|jane|nancy|\bsara\b|amber|ashley|cora|elizabeth|monica|linda|heather|olivia|emily|isabella|maisie|\bmia\b|nicky|kathy|vicki|google us english/i;
    const M = /\bmale|david|\bmark\b|\bguy\b|ryan|daniel|\balex\b|fred|george|thomas|christopher|\beric\b|roger|steffan|brian|andrew|davis|tony|jason|william|oliver|rishi|aaron|arthur|james|liam|ethan|noah|richard|sean|connor|mitchell|ralph|bruce|albert|gordon|\blee\b/i;
    const gender = (v) => (!v ? '?' : F.test(v.name) ? 'f' : M.test(v.name) ? 'm' : '?');
    const score = (v) => {
      let s = 0;
      if (/natural|neural/i.test(v.name)) s += 8;
      if (/online/i.test(v.name)) s += 3;
      if (/google/i.test(v.name)) s += 5;
      if (/en[-_]us/i.test(v.lang)) s += 2;
      else if (/en[-_]gb/i.test(v.lang)) s += 1.5;
      return s;
    };
    const list = () => en.slice().sort((a, b) => score(b) - score(a));
    const byName = (name) => (name ? en.find((v) => v.name === name) : null);
    function pick(role) {
      const pref = byName(DS.settings().voice);
      const sorted = list();
      if (!role || role === 'main') return pref || sorted[0] || null;
      if (pref && gender(pref) === role) return pref;
      return sorted.find((v) => gender(v) === role) || null;
    }
    // Two distinct voices for dialogues (falls back to pitch shift if only one voice exists)
    function pair() {
      const main = pick();
      const f = pick('f') || main;
      let m = pick('m');
      if (!m || m === f) m = list().find((v) => v !== f) || f;
      return { f, m, same: f === m };
    }

    /* Pre-recorded narration: assets/audio/<key>.mp3, listed in DS.audioMap (assets/js/data/audio.js).
       The key is a hash of "role|text", computed the same way by tools/collect.html. */
    const cyrb53 = (str) => {
      let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
      for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
    const keyOf = (text, role) => cyrb53((role || 'n') + '|' + text).toString(36);
    const audioMap = () => DS.audioMap || {};
    const hasFiles = () => Object.keys(audioMap()).length > 0;
    const fileFor = (text, role) => {
      const k = keyOf(text, role);
      return audioMap()[k] ? 'assets/audio/' + k + '.mp3' : null;
    };
    let audioEl = null;
    function stopAudio() { if (audioEl && !audioEl.paused) audioEl.pause(); }
    function playFile(src, opts, my) {
      return new Promise((resolve) => {
        if (!audioEl) { audioEl = new Audio(); audioEl.preload = 'auto'; }
        const a = audioEl;
        let done = false, poll = null;
        const finish = (res) => {
          if (done) return;
          done = true;
          clearInterval(poll);
          a.onended = a.onerror = null;
          resolve(my === gen ? res : { ok: false, cancelled: true });
        };
        a.onended = () => finish({ ok: true });
        a.onerror = () => finish({ ok: false, error: 'file' });
        a.src = src;
        const rate = DS.clamp((opts.rate || 1) * DS.settings().rate, 0.5, 2);
        a.defaultPlaybackRate = rate;
        a.playbackRate = rate;
        poll = setInterval(() => { if (my !== gen) { a.pause(); finish({ ok: false, cancelled: true }); } }, 80);
        const p = a.play();
        if (p && p.catch) p.catch((err) => finish({ ok: false, error: err && err.name === 'NotAllowedError' ? 'not-allowed' : 'file' }));
      });
    }

    function speak(text, opts) {
      opts = opts || {};
      const file = text && !opts.tts ? fileFor(text, opts.role) : null;
      if (file) {
        const my = ++gen;
        if (supported && (synth.speaking || synth.pending)) synth.cancel();
        return playFile(file, opts, my).then((r) => (r.error === 'file' && my === gen ? ttsSpeak(text, opts) : r));
      }
      return ttsSpeak(text, opts);
    }

    function ttsSpeak(text, opts) {
      opts = opts || {};
      return new Promise((resolve) => {
        if (!supported || !text) { resolve({ ok: false, unsupported: !supported }); return; }
        const my = ++gen;
        stopAudio();
        const busy = synth.speaking || synth.pending;
        if (busy) synth.cancel();
        const start = () => {
          if (my !== gen) { resolve({ ok: false, cancelled: true }); return; }
          const u = new SpeechSynthesisUtterance(text);
          let voice = opts.voice;
          if (voice === undefined || typeof voice === 'string') voice = pick(voice);
          if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-US'; }
          u.rate = DS.clamp((opts.rate || 1) * DS.settings().rate, 0.4, 2);
          u.pitch = opts.pitch || 1;
          let done = false, wd = null;
          const finish = (res) => {
            if (done) return;
            done = true;
            clearTimeout(wd);
            alive.delete(u);
            resolve(my === gen ? res : { ok: false, cancelled: true });
          };
          u.onend = () => finish({ ok: true });
          u.onerror = (e) => {
            const err = e && e.error;
            if (err === 'interrupted' || err === 'canceled') finish({ ok: false, cancelled: true });
            else finish({ ok: false, error: err || 'error' });
          };
          if (opts.onboundary) u.onboundary = opts.onboundary;
          alive.add(u);
          if (synth.paused) synth.resume();
          synth.speak(u);
          // Watchdog: some engines never fire "end"
          wd = setTimeout(() => finish({ ok: true, timeout: true }), 5000 + (text.length * 120) / u.rate);
        };
        if (busy) setTimeout(start, 70); else start();
      });
    }
    async function sequence(parts, opts) {
      opts = opts || {};
      for (let i = 0; i < parts.length; i++) {
        if (opts.onPart) opts.onPart(i);
        const r = await speak(parts[i], opts);
        if (r.cancelled || r.unsupported) return r;
        if (!r.ok && opts.stopOnError) return r;
      }
      return { ok: true };
    }
    // Whole text: a recorded file if there is one, otherwise sentence by sentence
    function speakText(text, opts) {
      opts = opts || {};
      const t = DS.plain(text);
      if (!opts.tts && fileFor(t, opts.role)) return speak(t, opts);
      return sequence(DS.sentences(t), opts);
    }
    function stop() {
      gen++;
      stopAudio();
      if (supported) synth.cancel();
    }
    return {
      supported, speak, speakText, sequence, stop, pick, pair, gender, list, keyOf, hasFiles,
      hasFile: (text, role) => !!fileFor(DS.plain(text), role),
      available: () => supported || hasFiles(),
      onVoices(fn) { subs.push(fn); fn(en); },
      hasEnglish: () => en.length > 0
    };
  })());

  // Speak text for a button; clicking the same button again stops it.
  let sayBtn = null;
  function clearSay() { if (sayBtn) sayBtn.classList.remove('is-speaking'); sayBtn = null; }
  DS.say = (text, btn, opts) => {
    if (!Speech.available()) {
      DS.toast('Браузер не поддерживает озвучку. Откройте сайт в Chrome, Edge или Яндекс Браузере.', 'warn', 4000);
      return Promise.resolve({ ok: false });
    }
    if (btn && btn === sayBtn) { Speech.stop(); clearSay(); return Promise.resolve({ cancelled: true }); }
    clearSay();
    if (btn) { sayBtn = btn; btn.classList.add('is-speaking'); }
    return Speech.speakText(text, opts).then((r) => {
      if (btn && sayBtn === btn) clearSay();
      return r;
    });
  };
  DS.stopSpeech = () => { Speech.stop(); clearSay(); };
  DS.sayBtn = (text, cls, label) => `<button type="button" class="say-btn${cls ? ' ' + cls : ''}" data-say="${DS.esc(text)}" aria-label="${DS.esc(label || 'Произнести: ' + text)}" title="Послушать">${DS.icon('volume')}</button>`;

  /* ---------- reusable multiple-choice quiz (first option is correct) ---------- */
  DS.renderQuiz = (el, questions, opts) => {
    opts = opts || {};
    const state = questions.map((q) => ({ q, order: DS.shuffle(q.o.map((t, i) => i)), answer: null }));
    el.innerHTML = state.map((s, qi) => `
      <div class="quiz-q" data-q="${qi}">
        <p><span class="n">${qi + 1}.</span>${DS.esc(s.q.q)}</p>
        <div class="opts${s.q.o.length === 2 ? ' two' : ''}">
          ${s.order.map((oi, k) => `<button type="button" class="opt" data-o="${oi}"><span class="letter">${'ABCD'[k]}</span><span>${DS.esc(s.q.o[oi])}</span></button>`).join('')}
        </div>
      </div>`).join('') + '<div class="quiz-result" hidden></div>';
    el.onclick = (e) => {
      const b = e.target.closest('.opt');
      if (b && !b.disabled) {
        const qEl = b.closest('.quiz-q');
        const s = state[+qEl.dataset.q];
        if (s.answer != null) return;
        s.answer = +b.dataset.o;
        DS.$$('.opt', qEl).forEach((o) => {
          o.disabled = true;
          const v = +o.dataset.o;
          if (v === 0) o.classList.add('is-correct');
          else if (o === b) o.classList.add('is-wrong', 'shake');
          else o.classList.add('is-dim');
        });
        if (state.every((x) => x.answer != null)) {
          const score = state.filter((x) => x.answer === 0).length;
          const res = DS.$('.quiz-result', el);
          const good = score / state.length >= 0.66;
          res.hidden = false;
          res.innerHTML = `<div class="explain ${good ? 'ok' : 'bad'}" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <b>Результат: ${score} из ${state.length}.</b> ${good ? 'Отлично!' : 'Попробуйте ещё раз — перечитайте текст.'}
            <button type="button" class="btn btn-sm btn-ghost" data-retry style="margin-left:auto">${DS.icon('refresh')} Ещё раз</button></div>`;
          if (opts.onDone) opts.onDone(score, state.length);
        }
      }
      if (e.target.closest('[data-retry]')) DS.renderQuiz(el, questions, opts);
    };
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (!b) return;
    e.preventDefault();
    DS.say(b.dataset.say, b, { rate: parseFloat(b.dataset.rate) || 1 });
  });

  // Banner shown on audio-heavy pages if no English voice is available
  DS.voiceNotice = (container) => {
    if (!container) return;
    const render = () => {
      if (Speech.hasFiles()) {
        container.innerHTML = '';
      } else if (!Speech.supported) {
        container.innerHTML = `<div class="notice">${DS.icon('alert')}<div><b>Синтез речи недоступен</b>Этот браузер не умеет озвучивать текст. Откройте сайт в Google Chrome, Microsoft Edge или Яндекс Браузере — тексты и субтитры работают и без звука.</div></div>`;
      } else if (!Speech.hasEnglish()) {
        container.innerHTML = `<div class="notice">${DS.icon('alert')}<div><b>Не найден английский голос</b>Озвучка будет с русским акцентом. Windows: «Параметры → Время и язык → Речь → Добавить голоса → English (United States)», затем перезапустите браузер. В Edge и Chrome английские голоса обычно уже есть.</div></div>`;
      } else {
        container.innerHTML = '';
      }
    };
    setTimeout(() => { render(); Speech.onVoices(render); }, 1600);
  };

  /* ---------- glossary tooltips ---------- */
  let tip = null, tipFor = null, hideTimer = null;
  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'gloss-tip';
    tip.setAttribute('role', 'tooltip');
    tip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tip.addEventListener('mouseleave', () => hideTip(200));
    document.body.appendChild(tip);
    return tip;
  }
  function showTip(el) {
    const w = DS.vocab && DS.vocab.byId[el.dataset.id];
    if (!w) return;
    clearTimeout(hideTimer);
    const t = ensureTip();
    if (tipFor && tipFor !== el) tipFor.classList.remove('is-open');
    tipFor = el;
    el.classList.add('is-open');
    t.innerHTML = `<div class="gt-head"><strong>${DS.esc(w.en)}</strong><span class="gt-ipa">${DS.esc(w.ipa || '')}</span>${DS.sayBtn(w.en, 'sm')}</div><div class="gt-ru">${DS.esc(w.ru)}</div>${w.def ? `<div class="gt-def">${DS.esc(w.def)}</div>` : ''}`;
    t.classList.add('is-on');
    const r = el.getBoundingClientRect();
    const tw = t.offsetWidth, th = t.offsetHeight;
    let left = DS.clamp(r.left + r.width / 2 - tw / 2, 8, window.innerWidth - tw - 8);
    let top = r.top - th - 10;
    if (top < 72) top = r.bottom + 10;
    t.style.left = left + 'px';
    t.style.top = top + 'px';
  }
  function hideTip(delay) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (tip) tip.classList.remove('is-on');
      if (tipFor) tipFor.classList.remove('is-open');
      tipFor = null;
    }, delay || 0);
  }
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t) showTip(t);
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t && !t.contains(e.relatedTarget)) hideTip(220);
  });
  document.addEventListener('focusin', (e) => { if (e.target.classList && e.target.classList.contains('term')) showTip(e.target); });
  document.addEventListener('focusout', (e) => { if (e.target.classList && e.target.classList.contains('term')) hideTip(250); });
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.term');
    if (t) { e.preventDefault(); if (tipFor === t && tip.classList.contains('is-on')) hideTip(); else showTip(t); return; }
    if (tip && !e.target.closest('.gloss-tip')) hideTip();
  });
  window.addEventListener('scroll', () => { if (tipFor) hideTip(); }, { passive: true });

  /* ---------- layout: header, nav, footer ---------- */
  const NAV = [
    { id: 'home', href: 'index.html', label: 'Главная', icon: 'home' },
    { id: 'lessons', href: 'lessons.html', label: 'Уроки', icon: 'book' },
    { id: 'vocabulary', href: 'vocabulary.html', label: 'Словарь', icon: 'cards' },
    { id: 'games', href: 'games.html', label: 'Игры', icon: 'gamepad' },
    { id: 'listening', href: 'listening.html', label: 'Аудирование', icon: 'headphones' },
    { id: 'podcasts', href: 'podcasts.html', label: 'Подкасты', icon: 'mic' },
    { id: 'video', href: 'video.html', label: 'Видео', icon: 'video' },
    { id: 'test', href: 'test.html', label: 'Тест', icon: 'checkCircle' }
  ];
  DS.nav = NAV;

  function currentTheme() {
    const set = document.documentElement.dataset.theme;
    if (set) return set;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function renderHeader() {
    const slot = DS.$('#site-header');
    if (!slot) return;
    const page = document.body.dataset.page;
    slot.outerHTML = `
<header class="site-header" id="top">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="DevSpeak — на главную">
      <span class="brand-mark">&lt;/&gt;</span><span class="brand-name">Dev<b>Speak</b></span>
    </a>
    <nav class="nav" id="nav" aria-label="Разделы сайта">
      ${NAV.map((n) => `<a href="${n.href}" class="${n.id === page ? 'is-active' : ''}"${n.id === page ? ' aria-current="page"' : ''}>${DS.icon(n.icon)}<span>${n.label}</span></a>`).join('')}
    </nav>
    <div class="header-actions">
      <a class="xp-chip" href="index.html#progress" title="Ваш уровень и опыт"><span class="xp-lvl" id="xp-lvl">Intern</span><span class="xp-num" id="xp-num">0 XP</span></a>
      <button class="icon-btn" id="voice-btn" type="button" aria-label="Настройки озвучки" aria-expanded="false" title="Озвучка">${DS.icon('sliders')}</button>
      <button class="icon-btn" id="theme-btn" type="button" aria-label="Сменить тему" title="Светлая / тёмная тема"></button>
      <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Меню" aria-expanded="false">${DS.icon('menu')}</button>
      <div class="popover" id="voice-pop" hidden>
        <div class="pop-head"><strong>Озвучка</strong><button class="icon-btn sm" type="button" data-close aria-label="Закрыть">${DS.icon('x')}</button></div>
        <label class="field"><span>Скорость речи: <b id="rate-val">1.00×</b></span><input type="range" id="rate-range" min="0.6" max="1.3" step="0.05"></label>
        <label class="field"><span>Голос синтезатора (запасной)</span><select id="voice-select" class="input"></select></label>
        <button class="btn btn-soft btn-sm" type="button" id="voice-test">${DS.icon('volume')} Проверить голос</button>
        <p class="pop-note" id="voice-note"></p>
      </div>
    </div>
  </div>
</header>`;

    const header = DS.$('.site-header');
    const menuBtn = DS.$('#menu-btn');
    menuBtn.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.innerHTML = DS.icon(open ? 'x' : 'menu');
    });

    const themeBtn = DS.$('#theme-btn');
    const paintTheme = () => { themeBtn.innerHTML = DS.icon(currentTheme() === 'dark' ? 'sun' : 'moon'); };
    paintTheme();
    themeBtn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('devspeak:theme', next); } catch (e) { /* ignore */ }
      paintTheme();
    });

    // voice settings
    const pop = DS.$('#voice-pop');
    const vBtn = DS.$('#voice-btn');
    const sel = DS.$('#voice-select');
    const range = DS.$('#rate-range');
    const rateVal = DS.$('#rate-val');
    const note = DS.$('#voice-note');
    const togglePop = (open) => {
      pop.hidden = !open;
      vBtn.setAttribute('aria-expanded', open);
    };
    vBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePop(pop.hidden); });
    pop.addEventListener('click', (e) => { e.stopPropagation(); if (e.target.closest('[data-close]')) togglePop(false); });
    document.addEventListener('click', () => { if (!pop.hidden) togglePop(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { togglePop(false); hideTip(); } });

    range.value = DS.settings().rate;
    rateVal.textContent = Number(range.value).toFixed(2) + '×';
    range.addEventListener('input', () => {
      rateVal.textContent = Number(range.value).toFixed(2) + '×';
      DS.saveSettings({ rate: Number(range.value) });
    });
    sel.addEventListener('change', () => DS.saveSettings({ voice: sel.value }));
    DS.$('#voice-test').addEventListener('click', (e) => DS.say('Hello! This is how I sound. Let\'s learn English for web design.', e.currentTarget));

    Speech.onVoices((voices) => {
      const files = Speech.hasFiles();
      if (!Speech.supported) {
        sel.innerHTML = '<option>Недоступно</option>';
        sel.disabled = true;
        note.className = files ? 'pop-note' : 'pop-note warn';
        note.textContent = files
          ? 'Озвучка — заранее записанные нейросетевые голоса, они играют в любом браузере.'
          : 'Браузер не поддерживает синтез речи. Попробуйте Chrome, Edge или Яндекс Браузер.';
        return;
      }
      const cur = DS.settings().voice;
      const sorted = Speech.list();
      sel.innerHTML = `<option value="">Автовыбор (лучший голос)</option>` +
        sorted.map((v) => `<option value="${DS.esc(v.name)}"${v.name === cur ? ' selected' : ''}>${DS.esc(v.name)} · ${DS.esc(v.lang)}</option>`).join('');
      if (files) {
        note.className = 'pop-note';
        note.textContent = 'Озвучка — заранее записанные нейросетевые голоса. Синтезатор браузера подключается только для фраз без записи.';
      } else if (!voices.length) {
        note.className = 'pop-note warn';
        note.innerHTML = 'Английские голоса не найдены. Windows: <b>Параметры → Время и язык → Речь → Добавить голоса → English (United States)</b>, затем перезапустите браузер.';
      } else {
        note.className = 'pop-note';
        note.textContent = `Найдено английских голосов: ${voices.length}. Озвучка работает прямо в браузере.`;
      }
    });
    renderXP();
  }

  function renderXP() {
    const lvl = DS.$('#xp-lvl'), num = DS.$('#xp-num');
    if (!lvl) return;
    const xp = DS.xp();
    lvl.textContent = DS.levelOf(xp).name;
    num.textContent = xp + ' XP';
  }

  function renderFooter() {
    const slot = DS.$('#site-footer');
    if (!slot) return;
    slot.outerHTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-inner">
      <div>
        <a class="brand" href="index.html"><span class="brand-mark">&lt;/&gt;</span><span class="brand-name">Dev<b>Speak</b></span></a>
        <p style="margin-top:14px">Учебный сайт по английскому языку для студентов специальности «Информационные системы и программирование». Unit 18 · Web Design.</p>
        <span class="no-vpn">${DS.icon('shield')} Работает в России без VPN</span>
      </div>
      <div>
        <h4>Учиться</h4>
        <ul class="footer-links">
          ${NAV.slice(1, 5).map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h4>Практика</h4>
        <ul class="footer-links">
          ${NAV.slice(5).map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
          <li><a href="#" id="reset-progress">Сбросить прогресс</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>Все материалы загружаются с этого сайта: без внешних шрифтов, CDN и видеохостингов.</span>
      <span>Озвучка — записанные нейросетевые голоса.</span>
    </div>
    <div class="footer-credit">
      <span class="credit-mark">&lt;/&gt;</span>
      <span>Developed by <b>Ivan Sedachev</b> and his top team</span>
    </div>
  </div>
</footer>`;
    DS.$('#reset-progress').addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Сбросить весь прогресс: XP, выученные слова, результаты игр и тестов?')) {
        DS.state.reset();
        location.reload();
      }
    });
  }

  renderHeader();
  renderFooter();
  hydrateIcons(document);
  window.addEventListener('pagehide', () => Speech.stop());
})();
