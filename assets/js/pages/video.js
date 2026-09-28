/* Video lessons: scenes are rendered with HTML/CSS animation, narrated by recorded audio
   (or speech synthesis as a fallback) and subtitled in English and Russian. */
(function () {
  'use strict';
  const { $, $$, esc, icon } = DS;
  const videos = DS.videos;
  const vp = $('#vp'), sceneEl = $('#scene'), subsEl = $('#subs'), overlayEl = $('#overlay');
  let vid = null, chunks = [], pos = 0, token = 0, renderedScene = -1;
  const CC = [['both', 'EN+RU'], ['en', 'EN'], ['ru', 'RU'], ['off', 'CC off']];
  let cc = 0;
  const SPEEDS = [0.8, 1, 1.2];
  let speedI = 1;

  DS.voiceNotice($('#voice-notice'));

  /* ---------- scene templates ---------- */
  const col = (c, cls) => `<div class="cmp-col ${cls}" data-at="${c.at}"><h4>${icon(c.icon)} ${esc(c.title)}</h4><ul>${c.items.map((t, k) => `<li data-at="${c.at}" style="--i:${k + 1}">${esc(t)}</li>`).join('')}</ul></div>`;
  const layer = (l, cls) => `<div class="layer ${cls}" data-at="${l.at}"><div class="layer-head">${icon(l.icon)}<b>${esc(l.title)}</b><span>${esc(l.sub)}</span></div><div class="layer-items">${l.items.map((t, k) => `<span data-at="${l.at}" style="--i:${k + 1}">${esc(t)}</span>`).join('')}</div></div>`;
  const R = {
    title: (s) => `<div class="sc-orb o1"></div><div class="sc-orb o2"></div>
      <div class="sc-bigicon" data-at="0">${icon(s.icon)}</div>
      <span class="sc-kicker" data-at="0" style="--i:1">${esc(s.kicker)}</span>
      <h2 class="sc-h" data-at="0" style="--i:2">${esc(s.title)}</h2>
      <p class="sc-sub" data-at="0" style="--i:3">${esc(s.subtitle)}</p>`,
    flow: (s) => `<h3 class="sc-h2" data-at="0">${esc(s.title)}</h3>
      <div class="flow">
        <div class="flow-node" data-at="0" style="--i:1"><div class="fn-icon">${icon('monitor')}</div><b>Browser</b><span class="fn-url">${esc(s.url)}</span></div>
        <div class="flow-lanes">
          <div class="lane req" data-at="0" style="--i:2"><span class="lane-label">request →</span><i class="packet"></i></div>
          <div class="lane res" data-at="${s.resAt}"><span class="lane-label">← response</span><i class="packet"></i></div>
        </div>
        <div class="flow-node server" data-at="0" style="--i:3"><div class="fn-icon">${icon('server')}</div><b>Web server</b>
          <div class="fn-items">${s.items.map((it, k) => `<span class="fn-item" data-at="${it.at}" style="--i:${k}">${icon(it.icon)}${esc(it.text)}</span>`).join('')}</div>
        </div>
      </div>
      ${s.note ? `<p class="sc-note" data-at="${s.noteAt}">${esc(s.note)}</p>` : ''}`,
    compare: (s) => `<h3 class="sc-h2" data-at="0">${esc(s.title)}</h3>
      <div class="cmp">${col(s.left, 'c1')}<div class="cmp-vs" data-at="${Math.min(s.left.at, s.right.at)}">VS</div>${col(s.right, 'c2')}</div>
      ${s.banner ? `<p class="sc-note" data-at="${s.bannerAt}">${esc(s.banner)}</p>` : ''}`,
    bullets: (s) => `<h3 class="sc-h2" data-at="0">${esc(s.title)}</h3>
      <ul class="blist">${s.items.map((it, k) => `<li data-at="${it.at}" style="--i:${k}"><span class="bn">${it.icon ? icon(it.icon) : it.n != null ? it.n : k + 1}</span><span>${esc(it.text)}</span></li>`).join('')}</ul>`,
    code: (s) => `<h3 class="sc-h2" data-at="0">${esc(s.title)}</h3>
      <div class="sc-codewin" data-at="0"><div class="cw-bar"><span class="cw-dot"></span><span class="cw-dot"></span><span class="cw-dot"></span><span class="cw-file">${esc(s.file)}</span></div>
      <pre>${s.lines.map(([code, at, hl], k) => `<span class="cl${hl ? ' hl' : ''}" data-at="${at}" style="--i:${k}">${DS.highlight(code) || ' '}</span>`).join('')}</pre></div>
      ${s.caption ? `<p class="sc-caption" data-at="${s.captionAt}">${esc(s.caption)}</p>` : ''}`,
    term: (s) => `<span class="sc-kicker" data-at="0">Key term</span>
      <div class="term-big" data-at="0" style="--i:1"><h2>${esc(s.word)}</h2><div class="ipa">${esc(s.ipa)}</div><p class="ru">${esc(s.ru)}</p></div>
      <p class="term-ex" data-at="${s.exampleAt || 1}">«${esc(s.example)}»</p>`,
    steps: (s) => `<h3 class="sc-h2" data-at="0">${esc(s.title)}</h3>
      <div class="steps" style="--n:${s.steps.length}">${s.steps.map((st, k) => `<div class="step" data-at="${st.at}" style="--i:${k}"><div class="step-dot">${icon(st.icon)}</div><b>${esc(st.title)}</b><span>${esc(st.text)}</span></div>`).join('')}</div>`,
    layers: (s) => `<div class="layers">${layer(s.top, 'front')}<div class="layer-link" data-at="${s.linkAt}">${esc(s.link)}</div>${layer(s.bottom, 'back')}</div>`,
    question: (s) => `<span class="sc-kicker" data-at="0">Quick question</span>
      <h3 class="sc-q" data-at="0" style="--i:1">${esc(s.q)}</h3>
      <div class="sc-opts" data-mark="${s.markAt}" style="grid-template-columns:repeat(${Math.min(s.options.length, 2)},1fr)">${s.options.map((o, k) => `<div class="sc-opt${k === s.answer ? ' right' : ''}" data-at="0" style="--i:${k + 2}">${'ABCD'[k]}. ${esc(o)}</div>`).join('')}</div>`,
    outro: (s) => `<div class="outro-check" data-at="0">${icon('check')}</div>
      <h3 class="sc-h2" data-at="0" style="--i:1">${esc(s.title)}</h3>
      <div class="outro-chips">${s.words.map((w, k) => `<span class="chip-dark" data-at="0" style="--i:${k + 2}">${esc(w)}</span>`).join('')}</div>`
  };
  const sceneName = (s) => ({ title: 'Intro', question: 'Quick question', outro: 'Summary', term: 'Key term: ' + s.word, layers: 'Front-end & back-end' })[s.type] || s.title;

  /* ---------- rendering ---------- */
  function show(p) {
    const c = chunks[p];
    const sc = vid.scenes[c.si];
    if (c.si !== renderedScene) {
      sceneEl.className = 'vp-scene';
      sceneEl.innerHTML = R[sc.type](sc);
      renderedScene = c.si;
    }
    void sceneEl.offsetWidth; // commit initial styles so the reveal transitions run
    $$('[data-at]', sceneEl).forEach((el) => el.classList.toggle('on', +el.dataset.at <= c.ci));
    $$('[data-mark]', sceneEl).forEach((el) => el.classList.toggle('marked', c.ci >= +el.dataset.mark));
    paintSubs(c);
    paintTrack();
  }
  function paintSubs(c) {
    const mode = CC[cc][0];
    if (!c || mode === 'off') { subsEl.innerHTML = ''; return; }
    subsEl.innerHTML =
      (mode === 'both' || mode === 'en' ? `<span>${esc(c.en)}</span>` : '') +
      (mode === 'both' || mode === 'ru' ? `<span class="ru">${esc(c.ru)}</span>` : '');
  }
  function paintTrack() {
    const c = chunks[pos] || chunks[chunks.length - 1];
    const counts = vid.scenes.map((s) => s.say.length);
    $$('.vp-seg', $('#track')).forEach((seg, si) => {
      const p = si < c.si ? 100 : si > c.si ? 0 : Math.round(((c.ci + (token ? 0.5 : 0)) / counts[si]) * 100);
      seg.querySelector('span').style.setProperty('--p', p + '%');
    });
    $('#vp-time').textContent = `Сцена ${c.si + 1}/${vid.scenes.length}`;
    $$('.chapter').forEach((ch) => ch.classList.toggle('is-now', +ch.dataset.si === c.si));
  }
  function setPlayBtn(on) {
    const b = $('#vp-play');
    b.innerHTML = icon(on ? 'pause' : 'play');
    b.setAttribute('aria-label', on ? 'Пауза' : 'Воспроизвести');
  }
  function overlay(kind) {
    if (!kind) { overlayEl.hidden = true; return; }
    overlayEl.hidden = false;
    if (kind === 'start') {
      overlayEl.innerHTML = `
        <button type="button" class="vp-bigplay" data-act="play" aria-label="Смотреть">${icon('play')}</button>
        <h3>${esc(vid.title)}</h3>
        <p>${esc(vid.ru)} · озвучка и субтитры EN / RU</p>`;
    } else {
      const next = videos[videos.indexOf(vid) + 1];
      overlayEl.innerHTML = `
        <div class="outro-check" style="width:max(56px,8cqw);height:max(56px,8cqw);margin:0">${icon('check')}</div>
        <h3>Видео просмотрено!</h3>
        <p>Ответьте на вопросы под видео.</p>
        <div class="row">
          <button type="button" class="btn btn-sm" data-act="replay">${icon('refresh')} Смотреть снова</button>
          ${next ? `<button type="button" class="btn btn-sm btn-grad" data-act="next-video" data-id="${next.id}">Следующее видео ${icon('arrowRight')}</button>` : ''}
        </div>`;
    }
  }

  /* ---------- playback ---------- */
  async function run() {
    const my = ++token;
    overlay(null);
    setPlayBtn(true);
    if (pos >= chunks.length) pos = 0;
    while (my === token && pos < chunks.length) {
      show(pos);
      const c = chunks[pos];
      const t0 = performance.now();
      const r = await DS.speech.speakText(c.en, { role: 'video', rate: SPEEDS[speedI] });
      if (my !== token) return;
      if (!r.ok || r.unsupported) {
        // no audio available: keep the subtitles on screen for a reading-speed pause
        const need = Math.max(2200, c.en.length * 65) / SPEEDS[speedI] - (performance.now() - t0);
        if (need > 0) await DS.wait(need);
        if (my !== token) return;
      }
      const lastInScene = pos + 1 >= chunks.length || chunks[pos + 1].si !== c.si;
      await DS.wait(lastInScene ? 900 : 250);
      if (my !== token) return;
      pos++;
    }
    if (my !== token) return;
    token = 0;
    setPlayBtn(false);
    if (pos >= chunks.length) finish();
  }
  function pause() {
    token = 0;
    DS.stopSpeech();
    setPlayBtn(false);
    paintTrack();
  }
  function toggle() { if (token) pause(); else run(); }
  function seekScene(si) {
    si = DS.clamp(si, 0, vid.scenes.length - 1);
    pos = chunks.findIndex((c) => c.si === si);
    const playing = !!token;
    if (playing) { DS.stopSpeech(); run(); } else { overlay(null); show(pos); }
  }
  function finish() {
    pos = chunks.length - 1;
    paintTrack();
    overlay('end');
    if (DS.progress.markDone('videos', vid.id)) renderList();
    DS.awardOnce('video:' + vid.id, 15, 'видео просмотрено');
  }

  /* ---------- page ---------- */
  const words = (v) => v.scenes.reduce((n, s) => n + s.say.join(' ').split(/\s+/).length, 0);
  const duration = (v) => DS.fmtTime(Math.round(words(v) / 2.4 + v.scenes.length * 1.5));

  function renderList() {
    $('#vid-list').innerHTML = videos.map((v) => `
      <button type="button" class="vid-item${v === vid ? ' is-active' : ''}" data-id="${v.id}">
        <span class="vid-thumb" style="--thumb:${v.thumb}">${icon(v.icon)}<span class="dur">${duration(v)}</span></span>
        <span class="vid-meta">
          <small>Видео ${v.n}${DS.progress.isDone('videos', v.id) ? ` · <span style="color:var(--success)">${icon('check')} просмотрено</span>` : ''}</small>
          <b>${esc(v.title)}</b>
          <small style="margin-top:2px">${esc(v.ru)}</small>
        </span>
      </button>`).join('');
  }
  function load(id) {
    const v = videos.find((x) => x.id === id) || videos[0];
    token = 0;
    DS.stopSpeech();
    setPlayBtn(false);
    vid = v;
    chunks = [];
    v.scenes.forEach((sc, si) => sc.say.forEach((t, ci) => chunks.push({ si, ci, en: t, ru: (sc.sub || [])[ci] || '' })));
    pos = 0;
    renderedScene = -1;
    history.replaceState(null, '', '#' + v.id);
    $('#track').innerHTML = v.scenes.map((s, si) => `<button type="button" class="vp-seg" data-si="${si}" style="--w:${s.say.length}" aria-label="Сцена ${si + 1}: ${esc(sceneName(s))}"><span></span></button>`).join('');
    $('#vid-eyebrow').innerHTML = `${icon('video')} Видео ${v.n} из ${videos.length} · ${duration(v)}`;
    $('#vid-title').textContent = v.title;
    $('#vid-desc').textContent = v.ru + '. ' + v.desc;
    $('#chapters').innerHTML = v.scenes.map((s, si) => `<button type="button" class="chapter" data-si="${si}"><span class="n">${String(si + 1).padStart(2, '0')}</span>${esc(sceneName(s))}</button>`).join('');
    $('#vid-words').innerHTML = v.words.map((wid) => DS.vocab.byId[wid]).filter(Boolean)
      .map((w) => `<span class="term-chip"><b>${esc(w.en)}</b><span>${esc(DS.firstMeaning(w.ru))}</span>${DS.sayBtn(w.en, 'sm')}</span>`).join('');
    DS.renderQuiz($('#vid-quiz'), v.quiz, {
      onDone(score, total) { if (score === total) DS.awardOnce('vquiz:' + v.id, 10, 'вопросы к видео'); }
    });
    renderList();
    show(0);
    overlay('start');
  }

  /* ---------- controls ---------- */
  const paintCC = () => { const b = $('#vp-cc'); b.textContent = CC[cc][1]; b.classList.toggle('is-on', CC[cc][0] !== 'off'); };
  const paintSpeed = () => { $('#vp-speed').textContent = SPEEDS[speedI] + '×'; };
  $('#vp-play').addEventListener('click', toggle);
  $('#vp-prev').addEventListener('click', () => seekScene((chunks[pos] || chunks[0]).si - 1));
  $('#vp-next').addEventListener('click', () => seekScene((chunks[pos] || chunks[0]).si + 1));
  $('#vp-cc').addEventListener('click', () => { cc = (cc + 1) % CC.length; paintCC(); paintSubs(chunks[pos]); });
  $('#vp-speed').addEventListener('click', () => { speedI = (speedI + 1) % SPEEDS.length; paintSpeed(); if (token) { DS.stopSpeech(); run(); } });
  $('#vp-full').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (vp.requestFullscreen) vp.requestFullscreen().catch(() => {});
  });
  $('#track').addEventListener('click', (e) => { const s = e.target.closest('[data-si]'); if (s) seekScene(+s.dataset.si); });
  $('#chapters').addEventListener('click', (e) => {
    const s = e.target.closest('[data-si]');
    if (!s) return;
    seekScene(+s.dataset.si);
    vp.scrollIntoView({ behavior: DS.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
  });
  overlayEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'play') run();
    else if (b.dataset.act === 'replay') { pos = 0; renderedScene = -1; run(); }
    else if (b.dataset.act === 'next-video') { load(b.dataset.id); run(); }
  });
  sceneEl.addEventListener('click', toggle);
  vp.addEventListener('keydown', (e) => {
    if (e.target.closest('button') && e.code === 'Space') return;
    if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight') seekScene((chunks[pos] || chunks[0]).si + 1);
    else if (e.key === 'ArrowLeft') seekScene((chunks[pos] || chunks[0]).si - 1);
  });
  $('#vid-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (!b) return;
    load(b.dataset.id);
    vp.scrollIntoView({ behavior: DS.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  paintCC();
  paintSpeed();
  load(location.hash.slice(1));
})();
