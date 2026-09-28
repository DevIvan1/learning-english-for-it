/* Lessons page: reader with glossary, per-paragraph audio and translation, quiz, discussion */
(function () {
  'use strict';
  const { $, $$, esc, icon } = DS;
  const lessons = DS.lessons;
  const nav = $('#lesson-nav');
  const reader = $('#reader');
  let current = 0;
  let readToken = 0;

  DS.voiceNotice($('#voice-notice'));

  function indexFromHash() {
    const id = location.hash.slice(1);
    const i = lessons.findIndex((l) => l.id === id);
    return i >= 0 ? i : null;
  }

  function renderNav() {
    const done = lessons.filter((l) => DS.progress.isDone('lessons', l.id)).length;
    nav.innerHTML = `<h4>Unit 18 · ${lessons.length} уроков</h4>` +
      lessons.map((l, i) => {
        const isDone = DS.progress.isDone('lessons', l.id);
        return `<button type="button" class="ln-item${i === current ? ' is-active' : ''}${isDone ? ' is-done' : ''}" data-i="${i}">
          <span class="ln-num">${isDone ? icon('check') : i + 1}</span>
          <span class="ln-text"><b>${esc(l.title)}</b><span>${esc(l.ru)}</span></span>
        </button>`;
      }).join('') +
      `<div class="lesson-progress">Пройдено ${done} из ${lessons.length}<div class="bar"><span style="--p:${Math.round((done / lessons.length) * 100)}%"></span></div></div>`;
    const active = $('.ln-item.is-active', nav);
    if (active && window.innerWidth <= 960) active.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function renderLesson() {
    stopReading();
    const l = lessons[current];
    const terms = l.terms.map((id) => DS.vocab.byId[id]).filter(Boolean);
    reader.innerHTML = `
      <header class="reader-head">
        <span class="eyebrow">${icon(l.icon)} Урок ${current + 1} из ${lessons.length} · ~${l.minutes} мин</span>
        <h2>${esc(l.title)}</h2>
        <p class="ru-title">${esc(l.ru)}</p>
        <div class="reader-tools">
          <button type="button" class="btn btn-grad btn-sm" id="listen-all">${icon('play')} Слушать весь текст</button>
          <button type="button" class="btn btn-sm" id="toggle-ru">${icon('globe')} Показать перевод</button>
        </div>
      </header>

      <div class="paras">
        ${l.paras.map((p, i) => `
          <div class="para" data-p="${i}">
            <p class="para-en">${DS.markup(p.en)}</p>
            <p class="para-ru" hidden>${esc(p.ru)}</p>
            <div class="para-tools">
              <button type="button" class="mini-btn" data-say="${esc(DS.plain(p.en))}">${icon('volume')} Слушать</button>
              <button type="button" class="mini-btn" data-ru="${i}">${icon('globe')} Перевод</button>
            </div>
          </div>`).join('')}
      </div>

      <div class="callout">${icon('bulb')}<div><b>${esc(l.note.title)}</b><p>${esc(l.note.text)}</p></div></div>

      <h3 class="block-title">${icon('cards')} Ключевые слова урока</h3>
      <div class="term-chips">
        ${terms.map((w) => `<span class="term-chip"><b>${esc(w.en)}</b><span>${esc(DS.firstMeaning(w.ru))}</span>${DS.sayBtn(w.en, 'sm')}</span>`).join('')}
      </div>

      <h3 class="block-title">${icon('checkCircle')} Проверь себя</h3>
      <div class="card" id="quiz"></div>

      <h3 class="block-title">${icon('users')} Обсуждение</h3>
      <p class="muted" style="margin-top:-6px">Сначала ответьте сами (устно или письменно), потом откройте образец ответа.</p>
      ${l.discuss.map((d) => `
        <details class="qa">
          <summary><span>${esc(d.q)}</span>${icon('chevronDown')}</summary>
          <div class="qa-body"><span class="qa-hint">${esc(d.hint)}</span><p>${esc(d.a)}</p>
          <div style="margin-top:10px">${DS.sayBtn(d.a, 'sm', 'Прослушать образец ответа')}</div></div>
        </details>`).join('')}

      <nav class="lesson-foot" aria-label="Навигация по урокам">
        ${current > 0 ? `<button type="button" class="btn" data-go="${current - 1}">${icon('arrowLeft')} ${esc(lessons[current - 1].title)}</button>` : '<span></span>'}
        ${current < lessons.length - 1 ? `<button type="button" class="btn btn-primary" data-go="${current + 1}">${esc(lessons[current + 1].title)} ${icon('arrowRight')}</button>` : '<a class="btn btn-primary" href="test.html">К итоговому тесту ' + icon('arrowRight') + '</a>'}
      </nav>`;

    DS.renderQuiz($('#quiz'), l.quiz, {
      onDone(score, total) {
        if (score / total >= 0.66) {
          if (DS.progress.markDone('lessons', l.id)) renderNav();
          DS.awardOnce('lesson:' + l.id, 20, 'урок пройден');
        }
      }
    });
  }

  function open(i, scroll) {
    current = DS.clamp(i, 0, lessons.length - 1);
    DS.state.set('lastLesson', current);
    if (location.hash !== '#' + lessons[current].id) history.replaceState(null, '', '#' + lessons[current].id);
    renderNav();
    renderLesson();
    if (scroll) {
      const top = reader.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: DS.reducedMotion() ? 'auto' : 'smooth' });
    }
  }

  /* ---------- reading the whole lesson aloud ---------- */
  function setListenBtn(on) {
    const b = $('#listen-all');
    if (b) b.innerHTML = on ? `${icon('stop')} Остановить` : `${icon('play')} Слушать весь текст`;
  }
  function stopReading() {
    if (readToken) { readToken++; DS.stopSpeech(); }
    $$('.para.is-reading', reader).forEach((p) => p.classList.remove('is-reading'));
    setListenBtn(false);
  }
  async function listenAll() {
    if (!DS.speech.available()) { DS.say(''); return; }
    const my = ++readToken;
    setListenBtn(true);
    const l = lessons[current];
    const paras = $$('.para', reader);
    for (let i = 0; i < paras.length; i++) {
      if (my !== readToken) return;
      paras.forEach((p) => p.classList.toggle('is-reading', p === paras[i]));
      paras[i].scrollIntoView({ block: 'center', behavior: DS.reducedMotion() ? 'auto' : 'smooth' });
      const r = await DS.speech.speakText(l.paras[i].en);
      if (r.cancelled || r.unsupported) break;
    }
    if (my === readToken) {
      readToken = 0;
      $$('.para.is-reading', reader).forEach((p) => p.classList.remove('is-reading'));
      setListenBtn(false);
    }
  }

  /* ---------- events ---------- */
  nav.addEventListener('click', (e) => {
    const b = e.target.closest('.ln-item');
    if (b) open(+b.dataset.i, true);
  });
  reader.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go) { open(+go.dataset.go, true); return; }
    if (e.target.closest('#listen-all')) {
      if (readToken) stopReading(); else listenAll();
      return;
    }
    if (e.target.closest('[data-say]') && readToken) {
      // a paragraph button interrupts "listen all"
      readToken = 0;
      $$('.para.is-reading', reader).forEach((p) => p.classList.remove('is-reading'));
      setListenBtn(false);
    }
    const ruBtn = e.target.closest('[data-ru]');
    if (ruBtn) {
      const ru = $(`.para[data-p="${ruBtn.dataset.ru}"] .para-ru`, reader);
      ru.hidden = !ru.hidden;
      ruBtn.classList.toggle('is-active', !ru.hidden);
      return;
    }
    const all = e.target.closest('#toggle-ru');
    if (all) {
      const ru = $$('.para-ru', reader);
      const show = ru.some((r) => r.hidden);
      ru.forEach((r) => { r.hidden = !show; });
      $$('[data-ru]', reader).forEach((b) => b.classList.toggle('is-active', show));
      all.innerHTML = `${icon('globe')} ${show ? 'Скрыть перевод' : 'Показать перевод'}`;
    }
  });
  window.addEventListener('hashchange', () => {
    const i = indexFromHash();
    if (i != null && i !== current) open(i, true);
  });

  const start = indexFromHash();
  open(start != null ? start : DS.state.get('lastLesson', 0), false);
})();
