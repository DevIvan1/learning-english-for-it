/* Vocabulary page: searchable list, flashcards, abbreviations */
(function () {
  'use strict';
  const { $, $$, esc, icon } = DS;
  const { words, cats, abbr } = DS.vocab;
  const view = $('#view');
  const catLabel = (id) => (cats.find((c) => c.id === id) || {}).short || id;

  let tab = 'list';
  const listState = { q: '', cat: 'all', onlyNew: false };
  let cleanup = null;

  function setTab(t) {
    tab = t;
    $$('.tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === t));
    if (cleanup) { cleanup(); cleanup = null; }
    DS.stopSpeech();
    history.replaceState(null, '', t === 'list' ? location.pathname : '#' + t);
    if (t === 'list') renderList();
    else if (t === 'cards') renderCardsSetup();
    else renderAbbr();
  }
  $$('.tab').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));

  /* ---------- list ---------- */
  function filtered() {
    const q = listState.q.trim().toLowerCase();
    return words.filter((w) =>
      (listState.cat === 'all' || w.cat === listState.cat) &&
      (!listState.onlyNew || !DS.progress.isKnown(w.id)) &&
      (!q || w.en.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q)));
  }
  function wordCard(w) {
    const known = DS.progress.isKnown(w.id);
    return `
      <article class="word-card${known ? ' is-known' : ''}" data-id="${w.id}">
        <div class="wc-head">
          <h3>${esc(w.en)}</h3>
          <span class="spacer"></span>
          ${DS.sayBtn(w.en)}
        </div>
        <div class="row" style="gap:8px"><span class="wc-ipa">${esc(w.ipa)}</span><span class="tag-pill">${esc(w.pos)}</span></div>
        <div class="wc-ru">${esc(w.ru)}</div>
        <p class="wc-def">${esc(w.def)}</p>
        <p class="wc-ex">${esc(w.ex)} <button type="button" class="mini-btn" style="padding:2px 7px;vertical-align:middle" data-say="${esc(w.ex)}" aria-label="Послушать пример">${icon('volume')}</button><i>${esc(w.exRu)}</i></p>
        ${w.note ? `<p class="wc-def" style="color:var(--orange)">${icon('info')} ${esc(w.note)}</p>` : ''}
        <div class="wc-foot">
          <span class="tag-pill">${esc(catLabel(w.cat))}</span>
          <button type="button" class="known-btn${known ? ' is-on' : ''}" data-known="${w.id}">${icon('check')} ${known ? 'Знаю' : 'Знаю?'}</button>
        </div>
      </article>`;
  }
  function renderList() {
    view.innerHTML = `
      <div class="toolbar">
        <label class="search">${icon('search')}<input class="input" id="q" type="search" placeholder="Поиск по-английски или по-русски…" value="${esc(listState.q)}" aria-label="Поиск слова"></label>
        <div class="chips" id="cats">
          <button type="button" class="chip${listState.cat === 'all' ? ' is-active' : ''}" data-cat="all">Все</button>
          ${cats.map((c) => `<button type="button" class="chip${listState.cat === c.id ? ' is-active' : ''}" data-cat="${c.id}">${esc(c.label)}</button>`).join('')}
          <button type="button" class="chip${listState.onlyNew ? ' is-active' : ''}" id="only-new">${icon('eyeOff')} Скрыть выученные</button>
        </div>
      </div>
      <p class="muted" id="count" style="margin:-6px 0 16px"></p>
      <div class="word-grid" id="grid"></div>`;
    const q = $('#q');
    q.addEventListener('input', () => { listState.q = q.value; paintGrid(); });
    $('#cats').addEventListener('click', (e) => {
      const c = e.target.closest('[data-cat]');
      if (c) { listState.cat = c.dataset.cat; $$('[data-cat]').forEach((b) => b.classList.toggle('is-active', b === c)); paintGrid(); }
      if (e.target.closest('#only-new')) { listState.onlyNew = !listState.onlyNew; $('#only-new').classList.toggle('is-active', listState.onlyNew); paintGrid(); }
    });
    paintGrid();
  }
  function paintGrid() {
    const list = filtered();
    const known = DS.progress.knownCount();
    $('#count').textContent = `Показано: ${list.length} · выучено ${known} из ${words.length}`;
    $('#grid').innerHTML = list.length ? list.map(wordCard).join('') : `<div class="empty">Ничего не найдено. Попробуйте другое слово.</div>`;
  }
  view.addEventListener('click', (e) => {
    const k = e.target.closest('[data-known]');
    if (!k) return;
    const id = k.dataset.known;
    const on = !DS.progress.isKnown(id);
    DS.progress.setKnown(id, on);
    const card = k.closest('.word-card');
    card.classList.toggle('is-known', on);
    k.classList.toggle('is-on', on);
    k.innerHTML = `${icon('check')} ${on ? 'Знаю' : 'Знаю?'}`;
    if (on) k.classList.add('pop');
    const cnt = $('#count');
    if (cnt) cnt.textContent = `Показано: ${filtered().length} · выучено ${DS.progress.knownCount()} из ${words.length}`;
  });

  /* ---------- flashcards ---------- */
  const cardOpts = { dir: 'en', set: 'new' };
  function renderCardsSetup() {
    const newCount = words.filter((w) => !DS.progress.isKnown(w.id)).length;
    view.innerHTML = `
      <div class="card card-lg" style="max-width:720px;margin:0 auto">
        <h2 style="margin-bottom:6px">Карточки</h2>
        <p class="muted">Смотрите на слово, вспоминайте перевод, переворачивайте карточку. «Знаю» — слово уходит из колоды, «Не знаю» — вернётся позже.</p>
        <h4 style="margin:18px 0 8px">Направление</h4>
        <div class="chips" id="dir">
          <button type="button" class="chip${cardOpts.dir === 'en' ? ' is-active' : ''}" data-dir="en">English → Русский</button>
          <button type="button" class="chip${cardOpts.dir === 'ru' ? ' is-active' : ''}" data-dir="ru">Русский → English</button>
        </div>
        <h4 style="margin:18px 0 8px">Какие слова</h4>
        <div class="chips" id="set">
          <button type="button" class="chip${cardOpts.set === 'new' ? ' is-active' : ''}" data-set="new">Невыученные (${newCount})</button>
          <button type="button" class="chip${cardOpts.set === 'all' ? ' is-active' : ''}" data-set="all">Все (${words.length})</button>
          ${cats.map((c) => `<button type="button" class="chip${cardOpts.set === c.id ? ' is-active' : ''}" data-set="${c.id}">${esc(c.short)}</button>`).join('')}
        </div>
        <div class="row" style="margin-top:24px">
          <button type="button" class="btn btn-grad btn-lg" id="start-cards">${icon('play')} Начать</button>
          <span class="muted" style="font-size:.88rem">Клавиши: <span class="kbd">Пробел</span> перевернуть, <span class="kbd">→</span> знаю, <span class="kbd">←</span> не знаю</span>
        </div>
      </div>`;
    $('#dir').addEventListener('click', (e) => { const b = e.target.closest('[data-dir]'); if (b) { cardOpts.dir = b.dataset.dir; $$('[data-dir]').forEach((x) => x.classList.toggle('is-active', x === b)); } });
    $('#set').addEventListener('click', (e) => { const b = e.target.closest('[data-set]'); if (b) { cardOpts.set = b.dataset.set; $$('[data-set]').forEach((x) => x.classList.toggle('is-active', x === b)); } });
    $('#start-cards').addEventListener('click', startCards);
  }

  function startCards() {
    let pool = words;
    if (cardOpts.set === 'new') pool = words.filter((w) => !DS.progress.isKnown(w.id));
    else if (cardOpts.set !== 'all') pool = words.filter((w) => w.cat === cardOpts.set);
    if (!pool.length) {
      DS.toast('Все слова этого набора уже выучены. Выберите «Все».', 'ok');
      return;
    }
    const deck = DS.shuffle(pool);
    const total = deck.length;
    let learned = 0, newlyKnown = 0, flipped = false;

    const paint = () => {
      const w = deck[0];
      const front = cardOpts.dir === 'en'
        ? `<div class="ff-word">${esc(w.en)}</div><div class="ff-ipa">${esc(w.ipa)}</div>`
        : `<div class="ff-word" style="font-size:clamp(1.4rem,4vw,2rem)">${esc(w.ru)}</div>`;
      const back = cardOpts.dir === 'en'
        ? `<div class="ff-word">${esc(w.ru)}</div><div class="ff-ex">${esc(w.ex)}<i>${esc(w.exRu)}</i></div>`
        : `<div class="ff-word">${esc(w.en)}</div><div class="ff-ipa" style="color:rgba(255,255,255,.8)">${esc(w.ipa)}</div><div class="ff-ex">${esc(w.ex)}<i>${esc(w.exRu)}</i></div>`;
      view.innerHTML = `
        <div class="flash-wrap">
          <div class="row" style="justify-content:space-between;width:min(600px,100%)">
            <span class="flash-count">Осталось: ${deck.length} · выучено: ${learned} из ${total}</span>
            <button type="button" class="btn btn-sm btn-ghost" id="exit-cards">${icon('x')} Закончить</button>
          </div>
          <div class="bar" style="width:min(600px,100%)"><span style="--p:${Math.round((learned / total) * 100)}%"></span></div>
          <button type="button" class="flashcard" id="flashcard" aria-label="Перевернуть карточку">
            <div class="flash-inner">
              <div class="flash-face front"><span class="ff-cat"><span class="tag-pill">${esc(catLabel(w.cat))}</span></span>${front}<span class="ff-hint">${icon('refresh')} нажмите, чтобы перевернуть</span></div>
              <div class="flash-face back"><span class="ff-cat"><span class="tag-pill">${esc(w.pos)}</span></span>${back}</div>
            </div>
          </button>
          <div class="flash-actions">
            <button type="button" class="btn btn-bad btn-lg" id="dont">${icon('x')} Не знаю</button>
            ${DS.sayBtn(w.en)}
            <button type="button" class="btn btn-ok btn-lg" id="know">${icon('check')} Знаю</button>
          </div>
        </div>`;
      flipped = false;
      $('#flashcard').addEventListener('click', flip);
      $('#know').addEventListener('click', know);
      $('#dont').addEventListener('click', dont);
      $('#exit-cards').addEventListener('click', finish);
      if (cardOpts.dir === 'en') DS.speech.speakText(w.en);
    };
    const flip = () => {
      flipped = !flipped;
      $('#flashcard').classList.toggle('is-flipped', flipped);
      if (flipped && cardOpts.dir === 'ru') DS.speech.speakText(deck[0].en);
    };
    const know = () => {
      const w = deck.shift();
      if (!DS.progress.isKnown(w.id)) { DS.progress.setKnown(w.id, true); newlyKnown++; }
      learned++;
      deck.length ? paint() : finish();
    };
    const dont = () => {
      const w = deck.shift();
      deck.splice(Math.min(deck.length, 3 + Math.floor(Math.random() * 3)), 0, w);
      paint();
    };
    const onKey = (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.code === 'Space') { e.preventDefault(); flip(); }
      else if (e.key === 'ArrowRight') know();
      else if (e.key === 'ArrowLeft') dont();
    };
    document.addEventListener('keydown', onKey);
    cleanup = () => document.removeEventListener('keydown', onKey);

    function finish() {
      if (cleanup) { cleanup(); cleanup = null; }
      if (newlyKnown) DS.addXP(newlyKnown * 3, `новых слов: ${newlyKnown}`);
      view.innerHTML = `
        <div class="card card-lg flash-done" style="max-width:560px;margin:0 auto">
          <div class="result-trophy">${icon('trophy')}</div>
          <h2>Колода пройдена!</h2>
          <p class="muted">Отмечено «Знаю»: ${learned} из ${total}. Новых выученных слов: ${newlyKnown}. Всего выучено: ${DS.progress.knownCount()} из ${words.length}.</p>
          <div class="row" style="justify-content:center;margin-top:10px">
            <button type="button" class="btn btn-grad" id="again">${icon('refresh')} Ещё раз</button>
            <a class="btn" href="games.html">${icon('gamepad')} К играм</a>
          </div>
        </div>`;
      $('#again').addEventListener('click', renderCardsSetup);
    }
    paint();
  }

  /* ---------- abbreviations ---------- */
  function fullMarked(a) {
    const caps = a.full.replace(/[^A-Z0-9]/g, '');
    if (caps !== a.ab) return esc(a.full);
    return esc(a.full).replace(/[A-Z0-9]/g, (c) => `<u>${c}</u>`);
  }
  function renderAbbr() {
    view.innerHTML = `
      <div class="notice info">${icon('info')}<div><b>Упражнение 7: Interpret the following abbreviations</b>XHTML, XML, DOM и PHP из учебника плюс другие сокращения из текста юнита. Проверьте себя в игре <a href="games.html#abbr" style="color:var(--primary);font-weight:650">Abbreviation Decoder</a>.</div></div>
      <div class="abbr-grid">
        ${abbr.map((a) => `
          <div class="abbr-card">
            <div class="ab"><b>${esc(a.ab)}</b>${DS.sayBtn(a.full, 'sm', 'Произнести: ' + a.full)}</div>
            <div class="full">${fullMarked(a)}</div>
            <div class="ru">${esc(a.ru)}</div>
          </div>`).join('')}
      </div>`;
  }

  const start = location.hash.slice(1);
  setTab(['cards', 'abbr'].includes(start) ? start : 'list');
})();
