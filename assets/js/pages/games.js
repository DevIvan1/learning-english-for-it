/* Games: Memory, Speed Translate, Bug Hunt, Sort, Abbreviation Decoder, Synonym Swap */
(function () {
  'use strict';
  const { $, $$, esc, icon } = DS;
  const words = DS.vocab.words;
  const P = DS.practice;
  const root = $('#games-root');
  const hero = $('#games-hero');
  let cleanup = null;

  const accepted = (w) => [w.en].concat(w.alt || []);
  const ruShort = (w) => DS.firstMeaning(w.ru);

  /* ---------- shell ---------- */
  function openHub() {
    if (cleanup) { cleanup(); cleanup = null; }
    DS.stopSpeech();
    hero.hidden = false;
    if (location.hash) history.replaceState(null, '', location.pathname);
    root.innerHTML = `<div class="game-grid">${GAMES.map((g) => {
      const best = DS.getRecord('game:' + g.id);
      return `
        <article class="game-card ${g.ac}">
          <div class="gc-art"><span class="gc-tag">${esc(g.tag)}</span>${icon(g.icon)}<span class="gc-deco">${esc(g.deco)}</span></div>
          <div class="gc-body">
            <h3>${esc(g.title)}</h3>
            <p>${esc(g.desc)}</p>
            <div class="gc-foot">
              <span class="gc-best">${icon('trophy')} ${best != null ? 'рекорд: ' + esc(g.fmt(best)) : 'ещё не играли'}</span>
              <button type="button" class="btn btn-grad btn-sm" data-play="${g.id}">${icon('play')} Играть</button>
            </div>
          </div>
        </article>`;
    }).join('')}</div>`;
  }

  function openGame(id) {
    const g = GAMES.find((x) => x.id === id);
    if (!g) return openHub();
    if (cleanup) { cleanup(); cleanup = null; }
    DS.stopSpeech();
    hero.hidden = true;
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    root.innerHTML = `
      <div class="game-shell ${g.ac}" style="margin-top:28px">
        <div class="gs-head">
          <button type="button" class="btn btn-sm btn-ghost" data-hub>${icon('arrowLeft')} Все игры</button>
          <h2>${esc(g.title)}</h2>
          <div class="gs-stats" id="gs-stats"></div>
        </div>
        <div class="gs-body" id="gs-body"></div>
      </div>`;
    window.scrollTo({ top: 0 });
    const body = $('#gs-body');
    const ctx = {
      body,
      stats(items) {
        $('#gs-stats').innerHTML = items.map(([ic, v]) => `<span class="gs-stat">${icon(ic)}${v}</span>`).join('');
      },
      finish(r) { if (cleanup) { cleanup(); cleanup = null; } showResult(g, r); }
    };
    cleanup = g.run(ctx) || null;
  }

  function showResult(g, r) {
    const rec = DS.record('game:' + g.id, r.record, g.lower);
    DS.addXP(r.xp, g.title);
    if (r.stars === 3) DS.confetti();
    $('#gs-body').innerHTML = `
      <div class="result">
        <div class="result-trophy">${icon('trophy')}</div>
        <div class="stars">${[1, 2, 3].map((i) => icon('star', i <= r.stars ? 'on' : '')).join('')}</div>
        <div class="result-score">${esc(r.headline)}</div>
        <p class="muted" style="margin-top:8px">${esc(r.sub)}</p>
        <div class="result-meta">
          <span class="badge">${icon('trophy')} ${rec.isNew ? 'Новый рекорд!' : 'Рекорд: ' + esc(g.fmt(rec.best))}</span>
          <span class="badge ok">${icon('zap')} +${r.xp} XP</span>
        </div>
        ${r.list ? `<h4 style="margin:0 0 8px">Повторите:</h4><div class="result-list">${r.list}</div>` : ''}
        <div class="row" style="justify-content:center">
          <button type="button" class="btn btn-grad" data-again="${g.id}">${icon('refresh')} Играть ещё</button>
          <button type="button" class="btn" data-hub>${icon('gamepad')} Все игры</button>
        </div>
      </div>`;
  }

  root.addEventListener('click', (e) => {
    const play = e.target.closest('[data-play]');
    if (play) return openGame(play.dataset.play);
    const again = e.target.closest('[data-again]');
    if (again) return openGame(again.dataset.again);
    if (e.target.closest('[data-hub]')) openHub();
  });

  const stars3 = (v, a, b) => (v >= a ? 3 : v >= b ? 2 : 1);
  const startScreen = (ctx, title, text, onStart) => {
    ctx.body.innerHTML = `
      <div class="game-center">
        <div class="result-trophy" style="margin-top:10px">${icon('rocket')}</div>
        <h2>${esc(title)}</h2>
        <p class="muted">${text}</p>
        <button type="button" class="btn btn-grad btn-lg" id="go" style="margin-top:8px">${icon('play')} Старт</button>
      </div>`;
    $('#go').addEventListener('click', onStart);
    $('#go').focus();
  };

  /* ---------- 1. Memory ---------- */
  function memory(ctx) {
    const pairs = window.innerWidth < 600 ? 6 : 8;
    const pool = words.filter((w) => w.en.length <= 18 && ruShort(w).length <= 26);
    const chosen = DS.sample(pool, pairs);
    const cards = DS.shuffle(chosen.flatMap((w) => [{ id: w.id, text: w.en, lang: 'en' }, { id: w.id, text: ruShort(w), lang: 'ru' }]));
    let open = [], matched = 0, moves = 0, lock = false, t0 = 0, timer = null;
    const secs = () => (t0 ? Math.floor((Date.now() - t0) / 1000) : 0);
    const stats = () => ctx.stats([['refresh', `${moves} ходов`], ['check', `${matched}/${pairs}`], ['clock', DS.fmtTime(secs())]]);

    ctx.body.innerHTML = `
      <p class="center muted" style="margin:0 0 18px">Найдите пары: английское слово и его перевод.</p>
      <div class="mem-grid">${cards.map((c, i) => `
        <button type="button" class="mem-card" data-i="${i}" aria-label="Карточка ${i + 1}">
          <div class="mem-inner">
            <div class="mem-face mem-front">${icon('code')}</div>
            <div class="mem-face mem-back ${c.lang}">${esc(c.text)}</div>
          </div>
        </button>`).join('')}</div>`;
    stats();

    const onClick = (e) => {
      const el = e.target.closest('.mem-card');
      if (!el || lock) return;
      const i = +el.dataset.i;
      if (el.classList.contains('is-open') || el.classList.contains('is-matched')) return;
      if (!t0) { t0 = Date.now(); timer = setInterval(stats, 1000); }
      el.classList.add('is-open');
      open.push(i);
      if (open.length < 2) return;
      moves++;
      const [a, b] = open.map((k) => ctx.body.querySelector(`.mem-card[data-i="${k}"]`));
      const same = cards[open[0]].id === cards[open[1]].id;
      open = [];
      if (same) {
        a.classList.add('is-matched');
        b.classList.add('is-matched');
        matched++;
        DS.speech.speakText(DS.vocab.byId[cards[+a.dataset.i].id].en);
        stats();
        if (matched === pairs) {
          const s = secs();
          setTimeout(() => ctx.finish({
            record: moves, stars: moves <= pairs + 3 ? 3 : moves <= pairs + 8 ? 2 : 1, xp: 15 + pairs * 2,
            headline: `${moves} ходов`, sub: `Все ${pairs} пар найдены за ${DS.fmtTime(s)}.`
          }), 700);
        }
      } else {
        lock = true;
        a.classList.add('is-miss');
        b.classList.add('is-miss');
        stats();
        setTimeout(() => {
          a.classList.remove('is-open', 'is-miss');
          b.classList.remove('is-open', 'is-miss');
          lock = false;
        }, 900);
      }
    };
    ctx.body.addEventListener('click', onClick);
    return () => { clearInterval(timer); ctx.body.removeEventListener('click', onClick); };
  }

  /* ---------- 2. Speed Translate ---------- */
  function speed(ctx) {
    const DURATION = 60;
    let queue = [], cur = null, score = 0, correct = 0, combo = 0, reveal = 1, mistakes = [], end = 0, raf = 0, busy = false;
    const stats = () => ctx.stats([['star', `${score} очков`], ['check', `${correct}`], ['flame', `×${combo}`]]);

    startScreen(ctx, 'Speed Translate', `У вас ${DURATION} секунд. Переводите русские слова на английский и нажимайте <span class="kbd">Enter</span>. Серия правильных ответов даёт бонус.`, begin);
    stats();

    function mask(w) {
      let letters = 0;
      return w.en.split('').map((ch) => {
        if (!/[a-z]/i.test(ch)) return ch === ' ' ? '  ' : ch;
        letters++;
        return letters <= reveal ? ch : '_';
      }).join(' ');
    }
    function begin() {
      queue = DS.shuffle(words);
      end = Date.now() + DURATION * 1000;
      ctx.body.innerHTML = `
        <div class="game-center">
          <div class="timer-bar"><span id="tb"></span></div>
          <div class="prompt-sub">Переведите на английский:</div>
          <div class="big-prompt" id="prompt"></div>
          <div class="hint-mask" id="mask"></div>
          <form class="speed-input" id="form" autocomplete="off">
            <input class="input" id="answer" type="text" spellcheck="false" autocapitalize="off" aria-label="Ваш перевод">
          </form>
          <div class="speed-feedback" id="fb"></div>
          <div class="row" style="justify-content:center;margin-top:6px">
            <button type="button" class="btn btn-sm" id="hint">${icon('bulb')} Подсказка (−3)</button>
            <button type="button" class="btn btn-sm btn-ghost" id="skip">Пропустить ${icon('arrowRight')}</button>
          </div>
        </div>`;
      $('#form').addEventListener('submit', (e) => { e.preventDefault(); check(); });
      $('#hint').addEventListener('click', () => { if (!cur) return; reveal++; score = Math.max(0, score - 3); $('#mask').textContent = mask(cur); stats(); $('#answer').focus(); });
      $('#skip').addEventListener('click', () => { if (!busy && cur) wrong(true); });
      next();
      tick();
    }
    function tick() {
      const left = Math.max(0, end - Date.now());
      const tb = $('#tb');
      if (tb) tb.style.transform = `scaleX(${left / (DURATION * 1000)})`;
      if (left <= 0) return finish();
      raf = requestAnimationFrame(tick);
    }
    function next() {
      if (!queue.length) queue = DS.shuffle(words);
      cur = queue.pop();
      reveal = 1;
      busy = false;
      $('#prompt').textContent = ruShort(cur);
      $('#mask').textContent = mask(cur);
      const inp = $('#answer');
      inp.value = '';
      inp.disabled = false;
      inp.focus();
      $('#form').className = 'speed-input';
    }
    function check() {
      if (busy || !cur) return;
      const v = $('#answer').value.trim();
      if (!v) return;
      if (accepted(cur).some((a) => DS.same(a, v))) {
        combo++;
        const pts = 10 + Math.min(combo - 1, 5) * 2;
        score += pts;
        correct++;
        $('#form').className = 'speed-input ok';
        $('#fb').className = 'speed-feedback ok';
        $('#fb').innerHTML = `${icon('check')} ${esc(cur.en)} · +${pts}${combo > 1 ? ` <span class="combo">${icon('flame')} combo ×${combo}</span>` : ''}`;
        stats();
        busy = true;
        setTimeout(next, 350);
      } else {
        wrong(false);
      }
    }
    function wrong(skipped) {
      combo = 0;
      busy = true;
      mistakes.push(cur);
      $('#form').className = 'speed-input bad';
      $('#form').classList.add('shake');
      $('#answer').disabled = true;
      $('#fb').className = 'speed-feedback bad';
      $('#fb').innerHTML = `${skipped ? 'Пропущено' : 'Неверно'}: правильно — <b>${esc(cur.en)}</b>`;
      DS.speech.speakText(cur.en);
      stats();
      setTimeout(next, 1300);
    }
    function finish() {
      cancelAnimationFrame(raf);
      const uniq = Array.from(new Set(mistakes));
      ctx.finish({
        record: score, stars: stars3(correct, 12, 7), xp: Math.min(40, 5 + correct * 3),
        headline: `${score} очков`, sub: `Правильных ответов: ${correct}. Ошибок и пропусков: ${mistakes.length}.`,
        list: uniq.length ? uniq.map((w) => `<div><b>${esc(w.en)}</b> — ${esc(ruShort(w))}</div>`).join('') : ''
      });
    }
    return () => cancelAnimationFrame(raf);
  }

  /* ---------- 3. Bug Hunt (hangman) ---------- */
  function bugHunt(ctx) {
    const ROUNDS = 6, LIVES = 6;
    const list = DS.sample(words.filter((w) => w.en.replace(/[^a-z]/gi, '').length >= 3 && w.en.length <= 20), ROUNDS);
    let round = 0, solved = 0, guessed, wrong, over, missedWords = [];
    const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    const status = (n) => n === 0 ? ['HTTP 200 OK', 's0'] : n <= 2 ? ['Warning: bugs detected', 's1'] : n <= 4 ? ['Server is slowing down…', 's1'] : n < LIVES ? ['Critical!', 's2'] : ['500 Internal Server Error', 's2'];
    const stats = () => ctx.stats([['bug', `раунд ${Math.min(round + 1, ROUNDS)}/${ROUNDS}`], ['check', `${solved} исправлено`]]);

    function paint() {
      const w = list[round];
      const [st, cls] = status(wrong);
      ctx.body.innerHTML = `
        <div class="game-center">
          <div class="server">
            ${icon('server')}
            <div class="server-bugs">${Array.from({ length: LIVES }, (_, i) => icon('bug', i < wrong ? 'on' : '')).join('')}</div>
            <span class="server-status ${cls}">${st}</span>
          </div>
          <div class="prompt-sub" style="margin-bottom:6px">Угадайте термин по определению:</div>
          <p class="bh-def">«${esc(w.def)}»</p>
          <div class="bh-ru" id="bh-ru"><button type="button" class="mini-btn" id="ru-hint">${icon('globe')} Подсказка на русском</button></div>
          <div class="slots">${w.en.split('').map((ch) => {
            if (ch === ' ') return '<span class="slot gap"></span>';
            if (!/[a-z]/i.test(ch)) return `<span class="slot fixed">${esc(ch)}</span>`;
            const shown = guessed.has(ch.toLowerCase());
            return `<span class="slot${shown ? ' is-shown' : ''}${over && !shown ? ' is-missed' : ''}">${shown || over ? esc(ch) : ''}</span>`;
          }).join('')}</div>
          <div class="keyboard">${ROWS.map((r) => `<div class="kb-row">${r.split('').map((k) => {
            const used = guessed.has(k);
            const hit = used && w.en.toLowerCase().includes(k);
            return `<button type="button" class="key${used ? (hit ? ' hit' : ' miss') : ''}" data-k="${k}"${used || over ? ' disabled' : ''}>${k}</button>`;
          }).join('')}</div>`).join('')}</div>
          <div id="bh-msg" class="speed-feedback" style="margin-top:14px"></div>
        </div>`;
      $('#ru-hint').addEventListener('click', () => { $('#bh-ru').textContent = w.ru; });
      stats();
    }
    function startRound() {
      guessed = new Set();
      wrong = 0;
      over = false;
      paint();
    }
    function guess(k) {
      if (over) return;
      const w = list[round];
      if (guessed.has(k)) return;
      guessed.add(k);
      const letters = w.en.toLowerCase().replace(/[^a-z]/g, '');
      if (!letters.includes(k)) wrong++;
      const won = letters.split('').every((c) => guessed.has(c));
      const lost = wrong >= LIVES;
      if (won || lost) over = true;
      paint();
      if (won || lost) {
        if (won) solved++; else missedWords.push(w);
        const msg = $('#bh-msg');
        msg.className = 'speed-feedback ' + (won ? 'ok' : 'bad');
        msg.innerHTML = won ? `${icon('check')} Баг исправлен! <b>${esc(w.en)}</b> — ${esc(ruShort(w))}` : `Сервер упал. Ответ: <b>${esc(w.en)}</b> — ${esc(ruShort(w))}`;
        DS.speech.speakText(w.en);
        stats();
        setTimeout(() => {
          round++;
          if (round >= ROUNDS) {
            ctx.finish({
              record: solved, stars: stars3(solved, 5, 3), xp: 5 + solved * 5,
              headline: `${solved} из ${ROUNDS}`, sub: solved === ROUNDS ? 'Все баги исправлены — сервер работает идеально!' : 'Угаданных терминов по определению.',
              list: missedWords.map((x) => `<div><b>${esc(x.en)}</b> — ${esc(x.def)}</div>`).join('')
            });
          } else startRound();
        }, won ? 1500 : 2300);
      }
    }
    const onClick = (e) => { const b = e.target.closest('[data-k]'); if (b && !b.disabled) guess(b.dataset.k); };
    const onKey = (e) => { if (/^[a-z]$/i.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) guess(e.key.toLowerCase()); };
    ctx.body.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    startRound();
    return () => { ctx.body.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }

  /* ---------- 4. Sort: front-end / back-end, static / dynamic ---------- */
  function sort(ctx) {
    let set, items, i, score, mistakes, t0, onKey = null;
    ctx.body.innerHTML = `
      <div class="game-center">
        <h2 style="margin-top:6px">Выберите режим</h2>
        <p class="muted">Разложите 10 понятий по двум корзинам. Можно нажимать кнопки, стрелки <span class="kbd">←</span> <span class="kbd">→</span> или перетаскивать карточку.</p>
        <div class="row" style="justify-content:center;margin-top:18px">
          <button type="button" class="btn btn-grad btn-lg" data-mode="fb">${icon('columns')} Front-end / Back-end</button>
          <button type="button" class="btn btn-lg" data-mode="sd">${icon('server')} Static / Dynamic</button>
        </div>
      </div>`;
    ctx.stats([['columns', 'выбор режима']]);
    ctx.body.addEventListener('click', function pick(e) {
      const b = e.target.closest('[data-mode]');
      if (!b) return;
      ctx.body.removeEventListener('click', pick);
      begin(b.dataset.mode);
    });

    function begin(mode) {
      set = P.sortSets[mode];
      items = DS.sample(set.items, 10);
      i = 0; score = 0; mistakes = []; t0 = Date.now();
      const bucket = (side) => `
        <div class="bucket" data-side="${side}">
          <h3>${icon(set[side].icon)} ${esc(set[side].label)}</h3>
          <p>${esc(set[side].hint)}</p>
          <div class="b-list" style="display:flex;flex-direction:column;gap:6px"></div>
        </div>`;
      ctx.body.innerHTML = `
        <div class="sort-arena">
          ${bucket('left')}
          <div class="sort-center">
            <span class="counter" id="sort-n"></span>
            <div class="sort-card" id="sort-card" draggable="true"></div>
            <div class="sort-btns">
              <button type="button" class="btn" data-side="left">${icon('arrowLeft')} ${esc(set.left.label)}</button>
              <button type="button" class="btn" data-side="right">${esc(set.right.label)} ${icon('arrowRight')}</button>
            </div>
            <div class="speed-feedback" id="sort-fb"></div>
          </div>
          ${bucket('right')}
        </div>`;
      paintCard();
      ctx.body.addEventListener('click', onClick);
      onKey = (e) => { if (e.key === 'ArrowLeft') place('left'); else if (e.key === 'ArrowRight') place('right'); };
      document.addEventListener('keydown', onKey);
      const card = $('#sort-card');
      card.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', 'card'); e.dataTransfer.effectAllowed = 'move'; });
      $$('.bucket', ctx.body).forEach((b) => {
        b.addEventListener('dragover', (e) => { e.preventDefault(); b.classList.add('drag-over'); });
        b.addEventListener('dragleave', () => b.classList.remove('drag-over'));
        b.addEventListener('drop', (e) => { e.preventDefault(); b.classList.remove('drag-over'); place(b.dataset.side); });
      });
    }
    function paintCard() {
      $('#sort-card').textContent = items[i][0];
      $('#sort-n').textContent = `${i + 1} / ${items.length}`;
      ctx.stats([['check', `${score} верно`], ['x', `${mistakes.length} ошибок`]]);
    }
    function onClick(e) {
      const b = e.target.closest('.sort-btns [data-side]');
      if (b) place(b.dataset.side);
    }
    let lock = false;
    function place(side) {
      if (lock || !items || i >= items.length) return;
      const [text, ans] = items[i];
      const correctSide = set.left.id === ans ? 'left' : 'right';
      const ok = side === correctSide;
      const list = $(`.bucket[data-side="${correctSide}"] .b-list`, ctx.body);
      const chip = document.createElement('div');
      chip.className = 'b-item';
      chip.textContent = text;
      if (!ok) chip.style.background = 'var(--danger-soft)';
      list.appendChild(chip);
      const fb = $('#sort-fb');
      if (ok) { score++; fb.className = 'speed-feedback ok'; fb.innerHTML = `${icon('check')} Верно!`; }
      else {
        mistakes.push(items[i]);
        fb.className = 'speed-feedback bad';
        fb.innerHTML = `Это <b>${esc(set[correctSide].label)}</b>`;
        $('#sort-card').classList.add('shake');
      }
      i++;
      lock = true;
      setTimeout(() => {
        lock = false;
        const card = $('#sort-card');
        if (!card) return;
        card.classList.remove('shake');
        if (i >= items.length) {
          const s = Math.floor((Date.now() - t0) / 1000);
          ctx.finish({
            record: score, stars: stars3(score, 10, 8), xp: 5 + score * 2,
            headline: `${score} из ${items.length}`, sub: `${set.title} · время ${DS.fmtTime(s)}`,
            list: mistakes.map(([t, a]) => `<div>${esc(t)} → <b style="color:var(--success)">${esc(set.left.id === a ? set.left.label : set.right.label)}</b></div>`).join('')
          });
        } else paintCard();
      }, ok ? 350 : 900);
    }
    return () => { ctx.body.removeEventListener('click', onClick); if (onKey) document.removeEventListener('keydown', onKey); };
  }

  /* ---------- 5. Abbreviation Decoder ---------- */
  function abbrGame(ctx) {
    const ROUNDS = 10, TIME = 12;
    const all = DS.vocab.abbr;
    const list = DS.sample(all, ROUNDS);
    let i = 0, score = 0, correct = 0, streak = 0, timer = null, t0 = 0, answered = false, missed = [];
    const stats = () => ctx.stats([['star', `${score} очков`], ['check', `${correct}/${ROUNDS}`], ['flame', `×${streak}`]]);

    startScreen(ctx, 'Abbreviation Decoder', `10 аббревиатур, на каждую — ${TIME} секунд. Чем быстрее ответ, тем больше очков.`, paint);
    stats();

    function paint() {
      const a = list[i];
      const opts = DS.shuffle([a.full].concat(DS.sample(all.filter((x) => x !== a), 3).map((x) => x.full)));
      answered = false;
      ctx.body.innerHTML = `
        <div class="game-center">
          <div class="timer-bar"><span id="tb" style="transition:none"></span></div>
          <span class="counter">${i + 1} / ${ROUNDS}</span>
          <div class="abbr-big">${esc(a.ab)}</div>
          <div class="opts" style="text-align:left">${opts.map((o, k) => `<button type="button" class="opt" data-full="${esc(o)}"><span class="letter">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>
          <div id="ab-fb"></div>
        </div>`;
      stats();
      t0 = Date.now();
      const tb = $('#tb');
      tb.getBoundingClientRect();
      tb.style.transition = `transform ${TIME}s linear`;
      tb.style.transform = 'scaleX(0)';
      timer = setTimeout(() => answer(null), TIME * 1000);
    }
    function answer(full) {
      if (answered) return;
      answered = true;
      clearTimeout(timer);
      const a = list[i];
      const ok = full === a.full;
      const left = Math.max(0, TIME - (Date.now() - t0) / 1000);
      if (ok) { correct++; streak++; score += 10 + Math.round(left); } else { streak = 0; missed.push(a); }
      const tb = $('#tb');
      const cur = getComputedStyle(tb).transform;
      tb.style.transition = 'none';
      tb.style.transform = cur;
      $$('.opt', ctx.body).forEach((o) => {
        o.disabled = true;
        if (o.dataset.full === a.full) o.classList.add('is-correct');
        else if (o.dataset.full === full) o.classList.add('is-wrong', 'shake');
        else o.classList.add('is-dim');
      });
      $('#ab-fb').innerHTML = `
        <div class="explain ${ok ? 'ok' : 'bad'}" style="text-align:left">${ok ? '<b>Верно!</b> ' : full == null ? '<b>Время вышло.</b> ' : '<b>Неверно.</b> '}${esc(a.ab)} — ${esc(a.ru)}</div>
        <button type="button" class="btn btn-grad" id="next" style="margin-top:14px">${i + 1 < ROUNDS ? 'Дальше' : 'Результат'} ${icon('arrowRight')}</button>`;
      stats();
      $('#next').focus();
    }
    function next() {
      i++;
      if (i >= ROUNDS) {
        ctx.finish({
          record: score, stars: stars3(correct, 9, 6), xp: 5 + correct * 3,
          headline: `${score} очков`, sub: `Правильно расшифровано: ${correct} из ${ROUNDS}.`,
          list: missed.map((a) => `<div><b>${esc(a.ab)}</b> — ${esc(a.full)}</div>`).join('')
        });
      } else paint();
    }
    const onClick = (e) => {
      const o = e.target.closest('.opt');
      if (o && !o.disabled) return answer(o.dataset.full);
      if (e.target.closest('#next')) next();
    };
    ctx.body.addEventListener('click', onClick);
    return () => { clearTimeout(timer); ctx.body.removeEventListener('click', onClick); };
  }

  /* ---------- 6. Synonym Swap (exercise 6) ---------- */
  function synonym(ctx) {
    const ROUNDS = 10;
    const list = DS.sample(P.synonyms, ROUNDS);
    let i = 0, correct = 0, missed = [];
    const stats = () => ctx.stats([['check', `${correct} верно`], ['list', `${Math.min(i + 1, ROUNDS)}/${ROUNDS}`]]);

    function paint() {
      const it = list[i];
      const sentence = esc(it.s).replace(/\{([^}]+)\}/, '<span class="syn-target" id="target">$1</span>');
      ctx.body.innerHTML = `
        <div class="game-center">
          <div class="prompt-sub">Замените выделенное слово синонимом из урока:</div>
          <p class="syn-sentence">${sentence}</p>
          <div class="opts two" style="text-align:left">${DS.shuffle(it.o).map((o, k) => `<button type="button" class="opt" data-o="${esc(o)}"><span class="letter">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>
          <div id="syn-fb"></div>
        </div>`;
      stats();
    }
    function answer(o) {
      const it = list[i];
      const ok = o === it.o[0];
      if (ok) correct++; else missed.push(it);
      $$('.opt', ctx.body).forEach((b) => {
        b.disabled = true;
        if (b.dataset.o === it.o[0]) b.classList.add('is-correct');
        else if (b.dataset.o === o) b.classList.add('is-wrong', 'shake');
        else b.classList.add('is-dim');
      });
      const t = $('#target');
      t.textContent = it.o[0];
      t.classList.add('done', 'pop');
      const fixed = it.s.replace(/\{[^}]+\}/, it.o[0]);
      $('#syn-fb').innerHTML = `
        <div class="syn-ru"><b>Перевод</b>${esc(it.ru)}</div>
        <div class="row" style="justify-content:center;margin-top:16px">
          ${DS.sayBtn(fixed, '', 'Прослушать предложение')}
          <button type="button" class="btn btn-grad" id="next">${i + 1 < ROUNDS ? 'Дальше' : 'Результат'} ${icon('arrowRight')}</button>
        </div>`;
      stats();
      $('#next').focus();
    }
    const onClick = (e) => {
      const o = e.target.closest('.opt');
      if (o && !o.disabled) return answer(o.dataset.o);
      if (e.target.closest('#next')) {
        i++;
        if (i >= ROUNDS) {
          ctx.finish({
            record: correct, stars: stars3(correct, 9, 6), xp: 5 + correct * 3,
            headline: `${correct} из ${ROUNDS}`, sub: 'Правильно подобранных синонимов.',
            list: missed.map((it) => `<div>${esc(it.s.replace(/[{}]/g, '"'))} → <b style="color:var(--success)">${esc(it.o[0])}</b></div>`).join('')
          });
        } else paint();
      }
    };
    ctx.body.addEventListener('click', onClick);
    paint();
    return () => ctx.body.removeEventListener('click', onClick);
  }

  const GAMES = [
    { id: 'memory', title: 'Memory: найди пару', desc: 'Переворачивайте карточки и находите пары «английский — русский». Чем меньше ходов, тем лучше.', icon: 'cards', ac: 'ac-indigo', tag: 'упр. 5', deco: 'EN ⇄ RU', lower: true, fmt: (v) => `${v} ходов`, run: memory },
    { id: 'speed', title: 'Speed Translate', desc: '60 секунд: переводите слова на английский как можно быстрее. Серии дают бонус.', icon: 'zap', ac: 'ac-orange', tag: 'на время', deco: '00:60', fmt: (v) => `${v} очков`, run: speed },
    { id: 'bughunt', title: 'Bug Hunt', desc: 'Угадайте термин по английскому определению, пока баги не уронили сервер.', icon: 'bug', ac: 'ac-rose', tag: 'виселица', deco: '500 Error', fmt: (v) => `${v} из 6`, run: bugHunt },
    { id: 'sort', title: 'Front-end или Back-end?', desc: 'Разложите понятия по корзинам. Второй режим — статические и динамические страницы.', icon: 'columns', ac: 'ac-cyan', tag: 'сортировка', deco: 'front | back', fmt: (v) => `${v} из 10`, run: sort },
    { id: 'abbr', title: 'Abbreviation Decoder', desc: 'Расшифруйте HTML, DOM, PHP, W3C и другие аббревиатуры на время.', icon: 'code', ac: 'ac-violet', tag: 'упр. 7', deco: 'HTML · DOM · PHP', fmt: (v) => `${v} очков`, run: abbrGame },
    { id: 'synonym', title: 'Synonym Swap', desc: 'Замените выделенное слово синонимом из урока и прочитайте перевод — как в упражнении 6.', icon: 'swap', ac: 'ac-green', tag: 'упр. 6', deco: 'fast → rapid', fmt: (v) => `${v} из 10`, run: synonym }
  ];

  const start = location.hash.slice(1);
  if (GAMES.some((g) => g.id === start)) openGame(start); else openHub();
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (GAMES.some((g) => g.id === id)) openGame(id);
  });
})();
