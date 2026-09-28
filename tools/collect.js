/* Collects every phrase the site can speak, with the role (voice) that speaks it.
   Output: [{ key, role, text }] — consumed by tools/build_audio.py.
   Keys match DS.speech.keyOf(text, role) used at runtime. */
(function () {
  'use strict';
  DS.collectSpeech = function () {
    const out = new Map();
    const add = (text, role) => {
      if (!text) return;
      const t = DS.plain(text).trim();
      if (!t) return;
      const key = DS.speech.keyOf(t, role);
      if (!out.has(key)) out.set(key, { key, role: role || 'n', text: t });
    };

    // header voice test
    add('Hello! This is how I sound. Let\'s learn English for web design.');

    // vocabulary: words and examples
    DS.vocab.words.forEach((w) => { add(w.en); add(w.ex); });
    DS.vocab.abbr.forEach((a) => add(a.full));

    // lessons: paragraphs and model answers
    DS.lessons.forEach((l) => {
      l.paras.forEach((p) => add(p.en));
      l.discuss.forEach((d) => add(d.a));
    });

    // podcasts: every line in the speaker's voice
    DS.podcasts.forEach((ep) => ep.lines.forEach(([s, en]) => add(en, ep.speakers[s].name.toLowerCase())));

    // video narration
    DS.videos.forEach((v) => v.scenes.forEach((sc) => sc.say.forEach((t) => add(t, 'video'))));

    // listening
    const P = DS.practice;
    P.dictation.forEach((d) => add(d.en));
    P.texts.forEach((t) => DS.sentences(t.text).forEach((s) => add(s, t.voice || 'n')));
    P.topics.forEach((t) => t.phrases.forEach((ph) => add(ph)));

    // synonym game: corrected sentences
    P.synonyms.forEach((it) => add(it.s.replace(/\{[^}]+\}/, it.o[0])));

    return Array.from(out.values());
  };
})();
