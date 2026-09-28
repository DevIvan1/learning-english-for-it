/* Home page: typing code window, progress, modules, word of the day */
(function () {
  'use strict';
  const { $, esc, icon } = DS;
  const words = DS.vocab.words;

  /* ---------- hero facts ---------- */
  const facts = [
    [DS.lessons.length, DS.plural(DS.lessons.length, 'урок', 'урока', 'уроков')],
    [words.length, DS.plural(words.length, 'слово', 'слова', 'слов')],
    [6, 'игр'],
    [DS.podcasts.length, DS.plural(DS.podcasts.length, 'подкаст', 'подкаста', 'подкастов')],
    [DS.videos.length, DS.plural(DS.videos.length, 'видео', 'видео', 'видео')]
  ];
  $('#hero-facts').innerHTML = facts.map(([n, l]) => `<span><b>${n}</b> ${l}</span>`).join('');

  /* ---------- typing code window ---------- */
  const SNIPPETS = [
    { file: 'index.html', lines: ['<!-- Unit 18: Web Design -->', '<main class="lesson">', '  <h1>Hello, future developer!</h1>', '  <p>Learn English for IT.</p>', '  <a href="games.html">Play</a>', '</main>'] },
    { file: 'style.css', lines: ['/* appearance: one consistent style */', '.site {', '  font-family: "Segoe UI";', '  color: #151a2d;', '  display: grid;', '}'] },
    { file: 'menu.php', lines: ['<?php // a dynamic page', '$words = [\'intent\', \'rapid\', \'tag\'];', 'foreach ($words as $w) {', '  echo "<li>$w</li>";', '}', '?>'] }
  ];
  const tabs = $('#cw-tabs'), body = $('#cw-body');
  tabs.innerHTML = SNIPPETS.map((s, i) => `<span class="cw-tab" data-i="${i}">${s.file}</span>`).join('');
  const setTab = (i) => DS.$$('.cw-tab', tabs).forEach((t) => t.classList.toggle('is-active', +t.dataset.i === i));
  const paint = (lines, partial) => {
    body.innerHTML = lines.map((l) => `<span class="cw-line">${DS.highlight(l) || ' '}</span>`).join('') +
      (partial != null ? `<span class="cw-line">${DS.highlight(partial)}<span class="caret"></span></span>` : '');
  };
  if (DS.reducedMotion()) {
    setTab(0);
    paint(SNIPPETS[0].lines);
  } else {
    let si = 0;
    const typeSnippet = async () => {
      const s = SNIPPETS[si];
      setTab(si);
      const done = [];
      for (const line of s.lines) {
        for (let c = 0; c <= line.length; c++) {
          paint(done, line.slice(0, c));
          await DS.wait(line[c] === ' ' ? 18 : 28 + Math.random() * 38);
        }
        done.push(line);
        await DS.wait(140);
      }
      paint(done, '');
      await DS.wait(2600);
      si = (si + 1) % SNIPPETS.length;
      typeSnippet();
    };
    typeSnippet();
  }

  /* ---------- progress ---------- */
  function renderProgress() {
    const xp = DS.xp();
    const lvl = DS.levelOf(xp);
    const known = DS.progress.knownCount();
    const lessonsDone = DS.progress.count('lessons');
    const pods = DS.progress.count('podcasts');
    const vids = DS.progress.count('videos');
    const records = DS.state.get('records', {});
    const gamesPlayed = Object.keys(records).filter((k) => k.startsWith('game:')).length;
    const test = DS.getRecord('test');
    const stat = (ac, ic, v, total, label) => {
      const pct = total ? Math.round((v / total) * 100) : 0;
      return `<div class="stat-card ${ac}"><div class="sc-top">${icon(ic)}</div><div class="v">${v}${total ? `<small> / ${total}</small>` : ''}</div><div class="l">${label}</div>${total ? `<div class="bar"><span style="--p:${pct}%"></span></div>` : ''}</div>`;
    };
    $('#progress-panel').innerHTML = `
      <div class="level-card">
        <div class="lc-label">Ваш уровень</div>
        <div class="lc-name">${lvl.name}</div>
        <div class="lc-ru">${lvl.ru}</div>
        <div class="bar"><span style="--p:${lvl.pct}%"></span></div>
        <div class="lc-next"><span>${xp} XP</span><span>${lvl.next ? `до ${lvl.next.name}: ${lvl.next.min - xp} XP` : 'максимальный уровень'}</span></div>
      </div>
      <div class="stat-grid">
        ${stat('ac-cyan', 'cards', known, words.length, 'слов отмечено «Знаю»')}
        ${stat('ac-indigo', 'book', lessonsDone, DS.lessons.length, 'уроков пройдено')}
        ${stat('ac-pink', 'gamepad', gamesPlayed, 6, 'игр сыграно')}
        ${stat('ac-violet', 'mic', pods, DS.podcasts.length, 'подкастов прослушано')}
        ${stat('ac-rose', 'video', vids, DS.videos.length, 'видео просмотрено')}
        <div class="stat-card ac-green"><div class="sc-top">${icon('award')}</div><div class="v">${test != null ? test + '%' : '—'}</div><div class="l">лучший результат теста</div></div>
      </div>`;
  }
  renderProgress();
  document.addEventListener('ds:xp', renderProgress);

  /* ---------- modules ---------- */
  const lessonsDone = DS.progress.count('lessons');
  const MODULES = [
    { href: 'lessons.html', ac: 'ac-indigo', ic: 'book', title: 'Уроки', desc: 'Адаптированный текст Unit 18: перевод каждого абзаца, озвучка и подсказки к терминам.', meta: `${lessonsDone}/${DS.lessons.length} пройдено`, p: lessonsDone / DS.lessons.length },
    { href: 'vocabulary.html', ac: 'ac-cyan', ic: 'cards', title: 'Словарь', desc: 'Все слова из упражнений 5–11: транскрипция, произношение, карточки и аббревиатуры.', meta: `${DS.progress.knownCount()}/${words.length} слов`, p: DS.progress.knownCount() / words.length },
    { href: 'games.html', ac: 'ac-pink', ic: 'gamepad', title: 'Игры', desc: 'Memory, Speed Translate, Bug Hunt, сортировка, аббревиатуры и синонимы.', meta: '6 игр · рекорды' },
    { href: 'listening.html', ac: 'ac-orange', ic: 'headphones', title: 'Аудирование', desc: 'Диктант, «услышь слово», тексты на понимание и говорение с записью голоса.', meta: '4 вида заданий' },
    { href: 'podcasts.html', ac: 'ac-violet', ic: 'mic', title: 'Подкасты', desc: 'Диалоги о веб-разработке с транскриптом, переводом и вопросами.', meta: `${DS.progress.count('podcasts')}/${DS.podcasts.length} выпусков`, p: DS.progress.count('podcasts') / DS.podcasts.length },
    { href: 'video.html', ac: 'ac-rose', ic: 'video', title: 'Видеоуроки', desc: 'Анимированные объяснения с озвучкой и субтитрами EN/RU. Без YouTube.', meta: `${DS.progress.count('videos')}/${DS.videos.length} видео`, p: DS.progress.count('videos') / DS.videos.length },
    { href: 'test.html', ac: 'ac-green', ic: 'checkCircle', title: 'Итоговый тест', desc: '20 вопросов по всей теме, оценка по пятибалльной шкале и сертификат.', meta: DS.getRecord('test') != null ? `лучший: ${DS.getRecord('test')}%` : 'ещё не пройден' }
  ];
  $('#module-grid').innerHTML = MODULES.map((m) => `
    <a class="module-card ${m.ac}" href="${m.href}">
      <span class="mc-icon">${icon(m.ic)}</span>
      <h3 class="mc-title">${m.title}</h3>
      <p class="mc-desc">${m.desc}</p>
      ${m.p != null ? `<div class="bar"><span style="--p:${Math.round(m.p * 100)}%"></span></div>` : ''}
      <div class="mc-meta"><span>${m.meta}</span><span class="mc-arrow">${icon('arrowRight')}</span></div>
    </a>`).join('');

  /* ---------- word of the day ---------- */
  const day = Math.floor(Date.now() / 86400000);
  const w = words[day % words.length];
  const renderWotd = () => {
    const known = DS.progress.isKnown(w.id);
    $('#wotd').innerHTML = `
      <span class="eyebrow">${icon('sparkles')} Слово дня</span>
      <div class="row" style="gap:14px">
        <h3 class="w-word">${esc(w.en)}</h3>
        ${DS.sayBtn(w.en)}
      </div>
      <div class="w-ipa">${esc(w.ipa)} · ${esc(w.pos)}</div>
      <p class="w-ru">${esc(w.ru)}</p>
      <p class="w-ex">${esc(w.ex)}<i>${esc(w.exRu)}</i></p>
      <div class="row" style="margin-top:16px">
        <button class="known-btn ${known ? 'is-on' : ''}" id="wotd-known" type="button">${icon('check')} ${known ? 'Знаю' : 'Отметить «Знаю»'}</button>
        <a class="btn btn-soft btn-sm" href="vocabulary.html">Весь словарь ${icon('arrowRight')}</a>
      </div>`;
    $('#wotd-known').addEventListener('click', () => {
      DS.progress.setKnown(w.id, !DS.progress.isKnown(w.id));
      renderWotd();
      renderProgress();
    });
  };
  renderWotd();
})();
