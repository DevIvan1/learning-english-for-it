/* Final test: 20 random questions, grade on the Russian 5-point scale, printable certificate */
(function () {
  'use strict';
  const { $, $$, esc, icon } = DS;
  const pool = DS.practice.test;
  const root = $('#test');
  const COUNT = 20;
  const GRADES = [
    { min: 90, grade: 5, label: 'Отлично', ring: '#10b981' },
    { min: 75, grade: 4, label: 'Хорошо', ring: '#06b6d4' },
    { min: 55, grade: 3, label: 'Удовлетворительно', ring: '#f59e0b' },
    { min: 0, grade: 2, label: 'Нужно повторить', ring: '#ef4444' }
  ];
  const gradeOf = (pct) => GRADES.find((g) => pct >= g.min);
  const TYPE = { choice: ['list', 'Выбор ответа'], input: ['keyboard', 'Впишите слово'], tf: ['checkCircle', 'True / False'] };

  let qs = [], i = 0, t0 = 0, timer = null, last = null;

  function intro() {
    clearInterval(timer);
    const best = DS.getRecord('test');
    root.innerHTML = `
      <div class="card card-lg">
        <h2 style="margin-bottom:6px">Unit 18: Web Design</h2>
        <p class="muted">${COUNT} случайных вопросов из банка в ${pool.length} заданий — каждая попытка немного отличается.</p>
        <div class="test-intro">
          <div class="ti-item">${icon('list')}<div><b>${COUNT} вопросов</b><span>выбор, ввод слова, True / False</span></div></div>
          <div class="ti-item">${icon('clock')}<div><b>~10 минут</b><span>без ограничения по времени</span></div></div>
          <div class="ti-item">${icon('award')}<div><b>Оценка и сертификат</b><span>сертификат — от 75%</span></div></div>
          <div class="ti-item">${icon('trophy')}<div><b>${best != null ? 'Лучший результат: ' + best + '%' : 'Ещё не пройден'}</b><span>сохраняется в браузере</span></div></div>
        </div>
        <div class="grade-table">${GRADES.map((g) => `<div><b>${g.grade}</b>${g.min ? 'от ' + g.min + '%' : 'меньше 55%'}</div>`).join('')}</div>
        <button type="button" class="btn btn-grad btn-lg" id="start">${icon('play')} Начать тест</button>
      </div>`;
    $('#start').addEventListener('click', start);
  }

  function start() {
    qs = DS.sample(pool, COUNT).map((q) => ({ q, order: q.t === 'choice' ? DS.shuffle(q.o.map((_, k) => k)) : null, answer: null }));
    i = 0;
    t0 = Date.now();
    clearInterval(timer);
    timer = setInterval(() => { const el = $('#q-time'); if (el) el.textContent = DS.fmtTime((Date.now() - t0) / 1000); }, 1000);
    paint();
  }

  function paint() {
    const s = qs[i];
    const q = s.q;
    let body = '';
    if (q.t === 'choice') {
      body = `<div class="opts">${s.order.map((oi, k) => `<button type="button" class="opt${s.answer === oi ? ' is-selected' : ''}" data-a="${oi}"><span class="letter">${'ABCD'[k]}</span><span>${esc(q.o[oi])}</span></button>`).join('')}</div>`;
    } else if (q.t === 'tf') {
      body = `<div class="opts two">${[true, false].map((v) => `<button type="button" class="opt${s.answer === v ? ' is-selected' : ''}" data-a="${v}"><span class="letter">${v ? 'T' : 'F'}</span><span>${v ? 'True — верно' : 'False — неверно'}</span></button>`).join('')}</div>`;
    } else {
      body = `<input class="input" id="inp" type="text" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="Ответ по-английски…" value="${esc(s.answer || '')}" style="font-size:1.15rem;font-family:var(--mono)">`;
    }
    root.innerHTML = `
      <div class="card card-lg">
        <div class="q-head"><span>Вопрос ${i + 1} из ${qs.length}</span><span>${icon('clock')} <span id="q-time">${DS.fmtTime((Date.now() - t0) / 1000)}</span></span></div>
        <div class="bar"><span style="--p:${Math.round((i / qs.length) * 100)}%"></span></div>
        <p class="q-text">${esc(q.q)}</p>
        <span class="badge" style="margin:-8px 0 16px">${icon(TYPE[q.t][0])} ${TYPE[q.t][1]}</span>
        ${body}
        <div class="q-actions">
          <button type="button" class="btn btn-ghost" id="prev"${i === 0 ? ' disabled' : ''}>${icon('arrowLeft')} Назад</button>
          <button type="button" class="btn btn-grad" id="next">${i + 1 < qs.length ? 'Далее' : 'Завершить'} ${icon('arrowRight')}</button>
        </div>
      </div>`;
    const inp = $('#inp');
    if (inp) {
      inp.focus();
      inp.addEventListener('input', () => { s.answer = inp.value; });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') next(); });
    }
    $$('.opt', root).forEach((b) => b.addEventListener('click', () => {
      s.answer = q.t === 'tf' ? b.dataset.a === 'true' : +b.dataset.a;
      $$('.opt', root).forEach((o) => o.classList.toggle('is-selected', o === b));
    }));
    $('#prev').addEventListener('click', () => { if (i > 0) { i--; paint(); } });
    $('#next').addEventListener('click', next);
  }

  function next() {
    const s = qs[i];
    if (s.answer == null || s.answer === '') {
      if (!confirm('Вы не ответили на этот вопрос. Перейти дальше?')) return;
    }
    if (i + 1 < qs.length) { i++; paint(); } else finish();
  }

  const isRight = (s) => {
    const q = s.q;
    if (q.t === 'choice') return s.answer === 0;
    if (q.t === 'tf') return s.answer === q.a;
    return !!s.answer && q.a.some((a) => DS.same(a, s.answer));
  };
  const answerText = (s) => {
    const q = s.q;
    if (s.answer == null || s.answer === '') return 'нет ответа';
    if (q.t === 'choice') return q.o[s.answer];
    if (q.t === 'tf') return s.answer ? 'True' : 'False';
    return s.answer;
  };
  const rightText = (q) => (q.t === 'choice' ? q.o[0] : q.t === 'tf' ? (q.a ? 'True' : 'False') : q.a[0]);

  function finish() {
    clearInterval(timer);
    const secs = Math.round((Date.now() - t0) / 1000);
    const correct = qs.filter(isRight).length;
    const pct = Math.round((correct / qs.length) * 100);
    const g = gradeOf(pct);
    const rec = DS.record('test', pct);
    last = { pct, grade: g.grade, date: new Date() };
    DS.addXP(Math.min(20, correct), 'итоговый тест');
    if (g.grade >= 4) {
      DS.awardOnce('test-pass', 50, 'тест сдан на ' + g.grade);
      DS.confetti();
    }
    root.innerHTML = `
      <div class="card card-lg center">
        <div class="score-ring" style="--p:${pct};--ring:${g.ring}"><div><div><b>${pct}%</b><span>${correct} из ${qs.length}</span></div></div></div>
        <div class="grade-big" style="background:${g.ring}22;color:${g.ring}">${icon('award')} Оценка ${g.grade} — ${g.label}</div>
        <p class="muted">Время: ${DS.fmtTime(secs)} · ${rec.isNew ? 'Новый лучший результат!' : 'Лучший результат: ' + rec.best + '%'}</p>
        <div class="row" style="justify-content:center">
          <button type="button" class="btn btn-grad" id="again">${icon('refresh')} Пройти ещё раз</button>
          ${pct >= 75 ? `<button type="button" class="btn" id="cert">${icon('award')} Получить сертификат</button>` : `<a class="btn" href="lessons.html">${icon('book')} Повторить уроки</a>`}
        </div>
        <h3 class="block-title" style="justify-content:center">Разбор ответов</h3>
        <div class="review">${qs.map((s, k) => {
          const ok = isRight(s);
          return `<div class="review-item ${ok ? 'ok' : 'bad'}"><p>${k + 1}. ${esc(s.q.q)}</p>
            <small>${ok ? `${icon('check')} Ваш ответ: <b>${esc(answerText(s))}</b>` : `Ваш ответ: <s>${esc(answerText(s))}</s> · Правильно: <b>${esc(rightText(s.q))}</b>`}</small></div>`;
        }).join('')}</div>
      </div>`;
    $('#again').addEventListener('click', start);
    const c = $('#cert');
    if (c) c.addEventListener('click', certificate);
    window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 90, behavior: DS.reducedMotion() ? 'auto' : 'smooth' });
  }

  function certificate() {
    const modal = document.createElement('div');
    modal.className = 'cert-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Сертификат');
    const name = DS.state.get('certName', '');
    const date = last.date.toLocaleDateString('ru-RU');
    modal.innerHTML = `
      <div class="cert-box">
        <div class="cert-actions">
          <input class="input" id="cert-name" type="text" placeholder="Ваше имя и фамилия" value="${esc(name)}" aria-label="Имя для сертификата">
          <button type="button" class="btn btn-grad" id="cert-print">${icon('print')} Печать / PDF</button>
          <button type="button" class="btn btn-ghost" id="cert-close">${icon('x')} Закрыть</button>
        </div>
        <div class="certificate">
          <div class="c-brand">&lt;/&gt; DevSpeak · English for ISIP</div>
          <div class="c-title">СЕРТИФИКАТ</div>
          <div class="c-sub">выдан</div>
          <div class="c-name" id="cert-out">${esc(name || 'Имя Фамилия')}</div>
          <div class="c-text">за успешную сдачу итогового теста по теме «Unit 18: Web Design» курса английского языка для специальности «Информационные системы и программирование»</div>
          <div class="c-foot">
            <div>Результат<b>${last.pct}%</b></div>
            <div>Оценка<b>${last.grade}</b></div>
            <div>Дата<b>${date}</b></div>
          </div>
          <div class="c-seal">DevSpeak<br>Web Design<br>✓</div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    const inp = $('#cert-name', modal);
    inp.focus();
    inp.addEventListener('input', () => {
      $('#cert-out', modal).textContent = inp.value.trim() || 'Имя Фамилия';
      DS.state.set('certName', inp.value.trim());
    });
    const close = () => { modal.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    $('#cert-close', modal).addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    $('#cert-print', modal).addEventListener('click', () => window.print());
  }

  intro();
})();
