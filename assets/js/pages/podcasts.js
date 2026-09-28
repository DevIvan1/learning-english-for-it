/* Podcast player: two-voice dialogues with synced transcript and translation */
(function () {
  'use strict';
  const { $, $$, esc, icon } = DS;
  const eps = DS.podcasts;
  const list = $('#ep-list');
  const player = $('#player');
  let ep = eps[0], idx = 0, token = 0, rate = 1, showRu = false;

  DS.voiceNotice($('#voice-notice'));

  const minutes = (e) => Math.max(1, Math.round(e.lines.reduce((n, l) => n + l[1].split(/\s+/).length, 0) / 140));
  const num = (n) => String(n).padStart(2, '0');

  function renderList() {
    list.innerHTML = eps.map((e) => `
      <button type="button" class="ep-item${e === ep ? ' is-active' : ''}" data-ep="${e.id}">
        <span class="ep-cover" style="--cover:${e.cover}">${icon(e.icon)}</span>
        <span class="ep-meta">
          <small>EP ${num(e.n)} · ~${minutes(e)} мин${DS.progress.isDone('podcasts', e.id) ? ` <span class="ep-done">${icon('check')}</span>` : ''}</small>
          <b>${esc(e.title)}</b>
          <span>${esc(e.ru)}</span>
        </span>
      </button>`).join('');
  }

  function renderPlayer() {
    const sp = ep.speakers;
    player.innerHTML = `
      <div class="player-top">
        <div class="player-cover" id="cover" style="--cover:${ep.cover}">
          <div class="eq"><i></i><i></i><i></i></div>
          <span class="pc-ep">EPISODE</span>
          <span class="pc-num">${num(ep.n)}</span>
          <span class="pc-brand">DevSpeak Podcast</span>
        </div>
        <div class="player-info">
          <span class="eyebrow">Выпуск ${ep.n} · ${esc(ep.level)} · ~${minutes(ep)} мин</span>
          <h2>${esc(ep.title)}</h2>
          <p>${esc(ep.desc)}</p>
          <div class="speakers">${Object.values(sp).map((s) => `<span class="speaker"><span class="avatar ${s.cls}">${s.name[0]}</span>${esc(s.name)} <span class="muted" style="font-weight:500">· ${esc(s.role)}</span></span>`).join('')}</div>
        </div>
      </div>
      <div class="player-controls">
        <button type="button" class="icon-btn" id="prev" aria-label="Предыдущая реплика">${icon('prev')}</button>
        <button type="button" class="play-big sm" id="toggle" aria-label="Слушать">${icon('play')}</button>
        <button type="button" class="icon-btn" id="next" aria-label="Следующая реплика">${icon('next')}</button>
        <div class="player-progress">
          <div class="bar" id="pbar" title="Перейти к месту"><span></span></div>
          <small><span id="pos"></span><span>~${minutes(ep)} мин</span></small>
        </div>
        <div class="speed-group" id="speed" aria-label="Скорость">
          ${[0.8, 1, 1.2].map((r) => `<button type="button" data-r="${r}" class="${r === rate ? 'is-active' : ''}">${r}×</button>`).join('')}
        </div>
        <button type="button" class="mini-btn${showRu ? ' is-active' : ''}" id="ru-toggle">${icon('globe')} Перевод</button>
      </div>
      <div class="lines" id="lines">
        ${ep.lines.map(([s, en, ru], i) => `
          <div class="line" data-i="${i}">
            <span class="avatar ${sp[s].cls}">${sp[s].name[0]}</span>
            <div class="line-body">
              <div class="line-name">${esc(sp[s].name)}</div>
              <div class="line-en">${esc(en)}</div>
              <div class="line-ru"${showRu ? '' : ' hidden'}>${esc(ru)}</div>
            </div>
          </div>`).join('')}
      </div>`;

    $('#toggle').addEventListener('click', () => (token ? pause() : play()));
    $('#prev').addEventListener('click', () => seek(idx - 1));
    $('#next').addEventListener('click', () => seek(idx + 1));
    $('#lines').addEventListener('click', (e) => {
      const l = e.target.closest('.line');
      if (l) { seek(+l.dataset.i); if (!token) play(); }
    });
    $('#pbar').addEventListener('click', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      seek(Math.floor(((e.clientX - r.left) / r.width) * ep.lines.length));
    });
    $('#speed').addEventListener('click', (e) => {
      const b = e.target.closest('[data-r]');
      if (!b) return;
      rate = +b.dataset.r;
      $$('#speed button').forEach((x) => x.classList.toggle('is-active', x === b));
      if (token) play();
    });
    $('#ru-toggle').addEventListener('click', (e) => {
      showRu = !showRu;
      e.currentTarget.classList.toggle('is-active', showRu);
      $$('.line-ru', player).forEach((r) => { r.hidden = !showRu; });
    });
    highlight(false);

    const words = ep.words.map((id) => DS.vocab.byId[id]).filter(Boolean);
    $('#pod-words').innerHTML = words.map((w) => `<span class="term-chip"><b>${esc(w.en)}</b><span>${esc(DS.firstMeaning(w.ru))}</span>${DS.sayBtn(w.en, 'sm')}</span>`).join('');
    DS.renderQuiz($('#pod-quiz'), ep.quiz, {
      onDone(score, total) { if (score === total) DS.awardOnce('podq:' + ep.id, 10, 'вопросы к подкасту'); }
    });
  }

  function highlight(scroll) {
    $$('.line', player).forEach((l) => {
      const i = +l.dataset.i;
      l.classList.toggle('is-now', i === idx);
      l.classList.toggle('is-past', i < idx);
    });
    $('#pos').textContent = `Реплика ${Math.min(idx + 1, ep.lines.length)} из ${ep.lines.length}`;
    $('#pbar span').style.setProperty('--p', `${Math.round((idx / ep.lines.length) * 100)}%`);
    if (scroll) {
      const box = $('#lines');
      const cur = $(`.line[data-i="${idx}"]`, box);
      if (cur) box.scrollTop = cur.offsetTop - box.offsetTop - box.clientHeight / 3;
    }
  }

  function setPlaying(on) {
    const t = $('#toggle');
    if (t) { t.innerHTML = icon(on ? 'pause' : 'play'); t.setAttribute('aria-label', on ? 'Пауза' : 'Слушать'); }
    const c = $('#cover');
    if (c) c.classList.toggle('is-playing', on);
  }

  async function play() {
    const my = ++token;
    if (idx >= ep.lines.length) idx = 0;
    setPlaying(true);
    while (my === token && idx < ep.lines.length) {
      highlight(true);
      const [s, en] = ep.lines[idx];
      const sp = ep.speakers[s];
      const pair = DS.speech.pair();
      const opts = {
        role: sp.name.toLowerCase(),
        rate,
        voice: sp.voice === 'f' ? pair.f : pair.m,
        pitch: pair.same ? (sp.voice === 'f' ? 1.12 : 0.82) : 1
      };
      const r = await DS.speech.speakText(en, opts);
      if (my !== token) return;
      if (r.unsupported) { DS.say(''); break; }
      await DS.wait(280);
      if (my !== token) return;
      idx++;
    }
    if (my !== token) return;
    token = 0;
    setPlaying(false);
    if (idx >= ep.lines.length) {
      highlight(false);
      complete();
    }
  }
  function pause() {
    token = 0;
    DS.stopSpeech();
    setPlaying(false);
  }
  function seek(i) {
    idx = DS.clamp(i, 0, ep.lines.length - 1);
    highlight(true);
    if (token) play();
  }
  function complete() {
    if (DS.progress.markDone('podcasts', ep.id)) renderList();
    DS.awardOnce('podcast:' + ep.id, 15, 'подкаст прослушан');
    DS.toast('Выпуск прослушан! Ответьте на вопросы ниже.', 'ok');
  }

  function openEp(id) {
    const e = eps.find((x) => x.id === id);
    if (!e) return;
    pause();
    ep = e;
    idx = 0;
    history.replaceState(null, '', '#' + ep.id);
    renderList();
    renderPlayer();
  }
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ep]');
    if (!b) return;
    openEp(b.dataset.ep);
    if (window.innerWidth <= 960) player.scrollIntoView({ behavior: DS.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  const start = location.hash.slice(1);
  openEp(eps.some((e) => e.id === start) ? start : eps[0].id);
})();
