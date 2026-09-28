/* Listening & speaking: dictation, word recognition, comprehension, talking points with recorder */
(function () {
  'use strict';
  const { $, $$, esc, icon } = DS;
  const P = DS.practice;
  const view = $('#view');
  let cleanup = null;

  DS.voiceNotice($('#voice-notice'));

  function setTab(t) {
    if (cleanup) { cleanup(); cleanup = null; }
    DS.stopSpeech();
    $$('.tab').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === t));
    history.replaceState(null, '', '#' + t);
    ({ dictation, words: hearWord, texts, speaking })[t]();
  }
  $$('.tab').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));

  /* ---------- word diff for dictation ---------- */
  function tokens(s) {
    return s.split(/\s+/).filter(Boolean).map((raw) => ({ raw, n: DS.norm(raw).replace(/\s+/g, '') })).filter((t) => t.n);
  }
  function diff(expected, typed) {
    const a = tokens(expected), b = tokens(typed);
    const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        L[i][j] = a[i].n === b[j].n ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const aOk = new Set(), bOk = new Set();
    for (let i = 0, j = 0; i < a.length && j < b.length;) {
      if (a[i].n === b[j].n) { aOk.add(i); bOk.add(j); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) i++;
      else j++;
    }
    return {
      pct: a.length ? Math.round((aOk.size / a.length) * 100) : 0,
      expectedHtml: a.map((t, i) => `<span class="${aOk.has(i) ? 'w-ok' : 'w-miss'}">${esc(t.raw)}</span>`).join(' '),
      typedHtml: b.length ? b.map((t, j) => `<span class="${bOk.has(j) ? 'w-ok' : 'w-extra'}">${esc(t.raw)}</span>`).join(' ') : '<span class="muted">—</span>'
    };
  }
  const pill = (pct) => `<span class="score-pill ${pct >= 85 ? 'good' : pct >= 55 ? 'mid' : 'low'}">${pct}%</span>`;

  /* ---------- 1. Dictation ---------- */
  function dictation() {
    const list = DS.sample(P.dictation, 10);
    let i = 0;
    const scores = [];
    const play = (btn, rate) => DS.say(list[i].en, btn, { rate });

    function paint() {
      const item = list[i];
      view.innerHTML = `
        <div class="card card-lg">
          <div class="listen-hero">
            <button type="button" class="play-big" id="play" aria-label="Прослушать предложение">${icon('play')}</button>
            <div>
              <div class="counter">Предложение ${i + 1} из ${list.length}</div>
              <h3 style="margin:4px 0 8px">Послушайте и запишите предложение</h3>
              <div class="row" style="gap:8px">
                <button type="button" class="btn btn-sm" id="slow">${icon('turtle')} Медленно</button>
                <span class="muted" style="font-size:.88rem">Слушайте сколько угодно раз</span>
              </div>
            </div>
          </div>
          <textarea class="input" id="typed" rows="3" placeholder="Напишите, что услышали…" spellcheck="false" autocapitalize="off"></textarea>
          <div class="row" style="margin-top:14px">
            <button type="button" class="btn btn-grad" id="check">${icon('check')} Проверить</button>
            <button type="button" class="btn btn-ghost" id="giveup">Показать ответ</button>
            <span class="spacer"></span>
            <span class="muted" style="font-size:.85rem"><span class="kbd">Ctrl</span> + <span class="kbd">Enter</span> — проверить</span>
          </div>
          <div id="res" style="margin-top:18px"></div>
        </div>`;
      $('#play').addEventListener('click', (e) => play(e.currentTarget, 1));
      $('#slow').addEventListener('click', (e) => play(e.currentTarget, 0.7));
      $('#check').addEventListener('click', () => check(false));
      $('#giveup').addEventListener('click', () => check(true));
      $('#typed').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) check(false); });
      $('#typed').focus();
      setTimeout(() => play($('#play'), 1), 250);
    }
    function check(giveUp) {
      if ($('#check').disabled) return;
      const item = list[i];
      const d = diff(item.en, giveUp ? '' : $('#typed').value);
      scores.push(d.pct);
      $('#check').disabled = true;
      $('#giveup').disabled = true;
      $('#typed').readOnly = true;
      $('#res').innerHTML = `
        <div class="row" style="margin-bottom:10px"><b>Результат:</b> ${pill(d.pct)}</div>
        <div class="diff diff-row"><small>Ваш ответ</small>${d.typedHtml}</div>
        <div class="diff diff-row"><small>Правильно</small>${d.expectedHtml}</div>
        <div class="diff-row"><small>Перевод</small>${esc(item.ru)}</div>
        <button type="button" class="btn btn-grad" id="next" style="margin-top:8px">${i + 1 < list.length ? 'Следующее' : 'Итог'} ${icon('arrowRight')}</button>`;
      $('#next').addEventListener('click', () => { i++; i < list.length ? paint() : finish(); });
      $('#next').focus();
    }
    function finish() {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const rec = DS.record('dictation', avg);
      DS.addXP(5 + Math.round(avg / 5), 'диктант');
      if (avg >= 90) DS.confetti();
      view.innerHTML = `
        <div class="card card-lg result">
          <div class="result-trophy">${icon('pen')}</div>
          <h2>Диктант завершён</h2>
          <div class="result-score">${avg}%</div>
          <p class="muted">Средняя точность по ${scores.length} предложениям. ${rec.isNew ? 'Это ваш новый рекорд!' : 'Рекорд: ' + rec.best + '%'}</p>
          <button type="button" class="btn btn-grad" id="again">${icon('refresh')} Ещё раз</button>
        </div>`;
      $('#again').addEventListener('click', dictation);
    }
    paint();
  }

  /* ---------- 2. Hear the word ---------- */
  function hearWord() {
    const ROUNDS = 10;
    const pool = DS.vocab.words;
    const list = DS.sample(pool, ROUNDS);
    let i = 0, correct = 0;
    const ru = (w) => DS.firstMeaning(w.ru);

    view.innerHTML = `
      <div class="card card-lg game-center">
        <div class="result-trophy">${icon('headphones')}</div>
        <h2>Услышь слово</h2>
        <p class="muted">Вы услышите английское слово — выберите его перевод. ${ROUNDS} слов, слушать можно несколько раз.</p>
        <button type="button" class="btn btn-grad btn-lg" id="go">${icon('play')} Начать</button>
      </div>`;
    $('#go').addEventListener('click', paint);

    function paint() {
      const w = list[i];
      const opts = DS.shuffle([w].concat(DS.sample(pool.filter((x) => x !== w && ru(x) !== ru(w)), 3)));
      view.innerHTML = `
        <div class="card card-lg">
          <div class="listen-hero">
            <button type="button" class="play-big" id="play" aria-label="Прослушать слово">${icon('volume')}</button>
            <div>
              <div class="counter">Слово ${i + 1} из ${ROUNDS} · верно: ${correct}</div>
              <h3 style="margin:4px 0 0">Что означает это слово?</h3>
              <div id="reveal" class="muted" style="min-height:1.6em;margin-top:4px"></div>
            </div>
          </div>
          <div class="opts two">${opts.map((o, k) => `<button type="button" class="opt" data-id="${o.id}"><span class="letter">${'ABCD'[k]}</span><span>${esc(ru(o))}</span></button>`).join('')}</div>
          <div id="nextwrap" style="margin-top:16px"></div>
        </div>`;
      $('#play').addEventListener('click', (e) => DS.say(w.en, e.currentTarget));
      view.querySelector('.opts').addEventListener('click', (e) => {
        const b = e.target.closest('.opt');
        if (!b || b.disabled) return;
        const ok = b.dataset.id === w.id;
        if (ok) correct++;
        $$('.opt', view).forEach((o) => {
          o.disabled = true;
          if (o.dataset.id === w.id) o.classList.add('is-correct');
          else if (o === b) o.classList.add('is-wrong', 'shake');
          else o.classList.add('is-dim');
        });
        $('#reveal').innerHTML = `<b style="color:var(--text)">${esc(w.en)}</b> <span class="mono">${esc(w.ipa)}</span>`;
        $('#nextwrap').innerHTML = `<button type="button" class="btn btn-grad" id="next">${i + 1 < ROUNDS ? 'Следующее слово' : 'Итог'} ${icon('arrowRight')}</button>`;
        $('#next').addEventListener('click', () => { i++; i < ROUNDS ? paint() : finish(); });
        $('#next').focus();
      });
      setTimeout(() => DS.say(w.en, $('#play')), 200);
    }
    function finish() {
      const rec = DS.record('hear', correct);
      DS.addXP(5 + correct * 2, 'аудирование');
      view.innerHTML = `
        <div class="card card-lg result">
          <div class="result-trophy">${icon('headphones')}</div>
          <h2>Готово!</h2>
          <div class="result-score">${correct} из ${ROUNDS}</div>
          <p class="muted">${rec.isNew ? 'Новый рекорд!' : 'Рекорд: ' + rec.best + ' из ' + ROUNDS}</p>
          <button type="button" class="btn btn-grad" id="again">${icon('refresh')} Ещё раз</button>
        </div>`;
      $('#again').addEventListener('click', hearWord);
    }
  }

  /* ---------- 3. Comprehension texts ---------- */
  function texts() {
    let cur = P.texts[0];
    let token = 0;
    let slow = false;

    function paint() {
      const sents = DS.sentences(cur.text);
      view.innerHTML = `
        <div class="text-list">${P.texts.map((t) => `
          <button type="button" class="text-pick${t === cur ? ' is-active' : ''}" data-t="${t.id}">
            <b>${esc(t.title)}</b><span>${esc(t.ru)} · ${esc(t.level)}${DS.progress.isDone('listenTexts', t.id) ? ' · ✓' : ''}</span>
          </button>`).join('')}</div>
        <div class="card card-lg">
          <div class="listen-hero">
            <button type="button" class="play-big" id="play" aria-label="Слушать текст">${icon('play')}</button>
            <div>
              <h3 style="margin:0 0 6px">${esc(cur.title)}</h3>
              <div class="row" style="gap:8px">
                <button type="button" class="mini-btn${slow ? ' is-active' : ''}" id="slow">${icon('turtle')} Медленно</button>
                <button type="button" class="mini-btn" id="show">${icon('eye')} Показать текст</button>
              </div>
            </div>
          </div>
          <p class="muted" style="margin-top:-4px">Сначала послушайте текст без подглядывания, затем отметьте утверждения: True или False.</p>
          <div class="transcript card" id="transcript" hidden style="background:var(--surface-2);margin-bottom:18px">
            ${sents.map((s, k) => `<span class="s" data-s="${k}">${esc(s)}</span>`).join(' ')}
          </div>
          <div id="tf">${cur.tf.map(([q], k) => `
            <div class="tf-row" data-k="${k}">
              <p>${k + 1}. ${esc(q)}</p>
              <div class="tf-btns">
                <button type="button" class="opt" data-v="true">True</button>
                <button type="button" class="opt" data-v="false">False</button>
              </div>
            </div>`).join('')}</div>
          <div id="tf-res"></div>
        </div>`;

      $('.text-list').addEventListener('click', (e) => {
        const b = e.target.closest('[data-t]');
        if (!b) return;
        stop();
        cur = P.texts.find((t) => t.id === b.dataset.t);
        paint();
      });
      $('#play').addEventListener('click', () => (token ? stop() : play()));
      $('#slow').addEventListener('click', (e) => { slow = !slow; e.currentTarget.classList.toggle('is-active', slow); });
      $('#show').addEventListener('click', (e) => {
        const tr = $('#transcript');
        tr.hidden = !tr.hidden;
        e.currentTarget.innerHTML = `${icon(tr.hidden ? 'eye' : 'eyeOff')} ${tr.hidden ? 'Показать текст' : 'Скрыть текст'}`;
      });
      const answers = {};
      $('#tf').addEventListener('click', (e) => {
        const b = e.target.closest('.opt');
        if (!b || b.disabled) return;
        const row = b.closest('.tf-row');
        const k = +row.dataset.k;
        const right = cur.tf[k][1];
        const ok = (b.dataset.v === 'true') === right;
        answers[k] = ok;
        $$('.opt', row).forEach((o) => {
          o.disabled = true;
          if ((o.dataset.v === 'true') === right) o.classList.add('is-correct');
          else if (o === b) o.classList.add('is-wrong');
          else o.classList.add('is-dim');
        });
        if (!ok) b.classList.add('shake');
        if (Object.keys(answers).length === cur.tf.length) {
          const score = Object.values(answers).filter(Boolean).length;
          $('#tf-res').innerHTML = `<div class="explain ${score >= 4 ? 'ok' : 'bad'}" style="margin-top:14px"><b>Результат: ${score} из ${cur.tf.length}.</b> ${score >= 4 ? 'Отличное понимание на слух!' : 'Послушайте ещё раз и откройте текст.'}</div>`;
          if (score >= 4) {
            DS.progress.markDone('listenTexts', cur.id);
            DS.awardOnce('listen:' + cur.id, 15, 'текст понят');
          }
        }
      });
    }
    async function play() {
      const my = ++token;
      $('#play').innerHTML = icon('pause');
      const sents = DS.sentences(cur.text);
      const r = await DS.speech.sequence(sents, {
        role: cur.voice || 'n',
        rate: slow ? 0.75 : 1,
        onPart: (k) => $$('#transcript .s').forEach((s) => s.classList.toggle('is-now', +s.dataset.s === k))
      });
      if (my !== token) return;
      if (r.unsupported) DS.say('');
      stop();
    }
    function stop() {
      if (token) { token = 0; DS.stopSpeech(); }
      const p = $('#play');
      if (p) p.innerHTML = icon('play');
      $$('#transcript .s').forEach((s) => s.classList.remove('is-now'));
    }
    cleanup = stop;
    paint();
  }

  /* ---------- 4. Speaking with recorder ---------- */
  function speaking() {
    let topic = P.topics[0];
    let rec = null, stream = null, chunks = [], timer = null, t0 = 0, audioUrl = null;
    const LIMIT = 120;
    const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

    function paint() {
      view.innerHTML = `
        <div class="topic-grid">${P.topics.map((t) => `
          <button type="button" class="text-pick${t === topic ? ' is-active' : ''}" data-t="${t.id}">
            <b>${icon(t.icon)} ${esc(t.title)}</b><span>${esc(t.ru)}${DS.progress.isDone('speaking', t.id) ? ' · ✓' : ''}</span>
          </button>`).join('')}</div>
        <div class="card card-lg">
          <span class="eyebrow">Talking point · упр. 12</span>
          <h2 style="margin-bottom:12px">${esc(topic.title)}</h2>
          <p class="muted">Подготовьте рассказ на 1–2 минуты. Ответьте на вопросы плана и используйте полезные фразы.</p>
          <h4 style="margin:16px 0 8px">План ответа</h4>
          <ol class="prompt-list">${topic.prompts.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
          <h4 style="margin:16px 0 8px">Полезные фразы <span class="muted" style="font-weight:500;font-size:.85rem">(нажмите, чтобы послушать)</span></h4>
          <div class="phrase-chips">${topic.phrases.map((p) => `<button type="button" class="phrase" data-say="${esc(p)}">${icon('volume')} ${esc(p)}</button>`).join('')}</div>
          <div class="rec-box" id="rec-box"></div>
          <p class="muted" style="font-size:.84rem;margin:10px 0 0">${icon('lock')} Запись остаётся только в вашем браузере и никуда не отправляется.</p>
        </div>`;
      $('.topic-grid').addEventListener('click', (e) => {
        const b = e.target.closest('[data-t]');
        if (!b) return;
        stopAll();
        topic = P.topics.find((t) => t.id === b.dataset.t);
        paint();
      });
      paintRec('idle');
    }
    function paintRec(state) {
      const box = $('#rec-box');
      if (!box) return;
      const secs = t0 ? Math.floor((Date.now() - t0) / 1000) : 0;
      if (state === 'recording') {
        box.innerHTML = `<span class="rec-dot"></span><span class="rec-time" id="rec-time">${DS.fmtTime(secs)}</span>
          <span class="muted">из ${DS.fmtTime(LIMIT)}</span><span class="spacer"></span>
          <button type="button" class="btn btn-bad" id="rec-stop">${icon('stop')} Стоп</button>`;
        $('#rec-stop').addEventListener('click', stopRec);
      } else if (state === 'done') {
        box.innerHTML = `<span class="badge ok">${icon('check')} Запись: ${DS.fmtTime(secs)}</span>
          <audio controls src="${audioUrl}"></audio>
          <button type="button" class="btn btn-sm" id="rec-again">${icon('refresh')} Записать заново</button>`;
        $('#rec-again').addEventListener('click', startRec);
      } else if (state === 'timer') {
        box.innerHTML = `<span class="rec-time" id="rec-time">${DS.fmtTime(secs)}</span><span class="muted">говорите вслух</span><span class="spacer"></span>
          <button type="button" class="btn" id="timer-stop">${icon('stop')} Стоп</button>`;
        $('#timer-stop').addEventListener('click', () => { clearInterval(timer); timer = null; finishSpeaking(Math.floor((Date.now() - t0) / 1000)); paintRec('idle'); });
      } else {
        box.innerHTML = canRecord
          ? `<button type="button" class="play-big sm" id="rec-start" aria-label="Начать запись">${icon('mic')}</button>
             <div><b>Запишите свой ответ</b><div class="muted" style="font-size:.9rem">До ${LIMIT / 60} минут. Потом прослушайте себя и сравните с полезными фразами.</div></div>`
          : `<button type="button" class="play-big sm" id="timer-start" aria-label="Запустить таймер">${icon('clock')}</button>
             <div><b>Таймер на 2 минуты</b><div class="muted" style="font-size:.9rem">Запись голоса недоступна в этом браузере — говорите вслух под таймер.</div></div>`;
        if (canRecord) $('#rec-start').addEventListener('click', startRec);
        else $('#timer-start').addEventListener('click', startTimer);
      }
    }
    function tick() {
      const secs = Math.floor((Date.now() - t0) / 1000);
      const el = $('#rec-time');
      if (el) el.textContent = DS.fmtTime(secs);
      if (secs >= LIMIT) { if (rec) stopRec(); else { clearInterval(timer); timer = null; finishSpeaking(secs); paintRec('idle'); } }
    }
    function startTimer() {
      t0 = Date.now();
      timer = setInterval(tick, 250);
      paintRec('timer');
    }
    async function startRec() {
      DS.stopSpeech();
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        DS.toast('Нет доступа к микрофону. Разрешите его в настройках браузера или используйте таймер.', 'warn', 4500);
        startTimer();
        return;
      }
      chunks = [];
      rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
        const secs = Math.floor((Date.now() - t0) / 1000);
        releaseMic();
        rec = null;
        finishSpeaking(secs);
        paintRec('done');
      };
      t0 = Date.now();
      rec.start();
      timer = setInterval(tick, 250);
      paintRec('recording');
    }
    function stopRec() {
      clearInterval(timer);
      timer = null;
      if (rec && rec.state !== 'inactive') rec.stop();
    }
    function releaseMic() {
      if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
    }
    function finishSpeaking(secs) {
      if (secs >= 30) {
        DS.progress.markDone('speaking', topic.id);
        DS.awardOnce('speak:' + topic.id, 15, 'говорение');
      } else {
        DS.toast('Попробуйте говорить хотя бы 30 секунд — так засчитается тема.', 'info', 3500);
      }
    }
    function stopAll() {
      clearInterval(timer);
      timer = null;
      if (rec && rec.state !== 'inactive') { rec.onstop = null; rec.stop(); }
      rec = null;
      releaseMic();
    }
    cleanup = stopAll;
    paint();
  }

  const start = location.hash.slice(1);
  setTab(['dictation', 'words', 'texts', 'speaking'].includes(start) ? start : 'dictation');
})();
