/* Practice data: listening, speaking, games and the final test.
   In multiple-choice items the first option is correct; options are shuffled on render. */
(function () {
  'use strict';
  const DS = (window.DS = window.DS || {});

  DS.practice = {
    /* ---- Listening: dictation ---- */
    dictation: [
      { en: 'A static page does not change until a web master edits it.', ru: 'Статическая страница не меняется, пока веб-мастер её не отредактирует.' },
      { en: 'Dynamic pages adapt their content to the user.', ru: 'Динамические страницы подстраивают содержимое под пользователя.' },
      { en: 'The front end is everything the user can see.', ru: 'Фронтенд — это всё, что видит пользователь.' },
      { en: 'The back end processes data from the front end.', ru: 'Бэкенд обрабатывает данные, поступающие с фронтенда.' },
      { en: 'Use CSS rather than tables for layout.', ru: 'Используйте для вёрстки CSS, а не таблицы.' },
      { en: 'Provide a text equivalent for every image.', ru: 'Давайте текстовый эквивалент для каждого изображения.' },
      { en: 'The home page is the first page of a web site.', ru: 'Главная страница — первая страница сайта.' },
      { en: 'Search engine crawlers index the pages of your site.', ru: 'Поисковые роботы индексируют страницы вашего сайта.' },
      { en: 'Define the purpose of the website before you start.', ru: 'Определите цель сайта, прежде чем начинать.' },
      { en: 'Always test your site in different browsers.', ru: 'Всегда тестируйте сайт в разных браузерах.' },
      { en: 'Splash pages are rarely used on commercial sites.', ru: 'Страницы-заставки редко используются на коммерческих сайтах.' },
      { en: 'HTML is a markup language, not a programming language.', ru: 'HTML — это язык разметки, а не язык программирования.' }
    ],

    /* ---- Listening: comprehension texts ---- */
    texts: [
      {
        id: 't1', title: 'A Day of a Web Master', ru: 'Один день веб-мастера', level: 'A2–B1', voice: 'oleg',
        text: 'My name is Oleg, and I work as a web master for a small travel company. My day starts at nine. First, I check the traffic statistics: how many hits the site received yesterday and which pages were popular. Then I update the content. Our site is dynamic, so I don\'t edit HTML files by hand. I add new tours through the CMS, and the server builds the pages automatically. After lunch, I usually work on the front end: I fix the layout on mobile phones and test the site in different browsers. At the end of the day, I submit new pages to search engines. It\'s a busy job, but I love it.',
        tf: [
          ['Oleg works for a travel company.', true],
          ['He checks the traffic statistics in the evening.', false],
          ['He edits HTML files by hand every day.', false],
          ['He tests the site in different browsers.', true],
          ['At the end of the day, he submits new pages to search engines.', true]
        ]
      },
      {
        id: 't2', title: 'Planning a College Website', ru: 'Как планировали сайт колледжа', level: 'B1',
        text: 'Last year our college decided to create a new website. First, the team wrote a purpose statement: the site had to help students find timetables and news quickly. Then they defined the target audience: students, parents and teachers. The team collected a lot of content, but they removed old articles and photos that did not support the purpose. They tested the first version on a focus group of ten students. The students said that the menu was confusing, so the team renamed the categories. Finally, they checked compatibility on phones, tablets and computers. The new site was published in September, and the number of visitors doubled.',
        tf: [
          ['The main purpose was to help students find timetables and news.', true],
          ['The target audience included only students.', false],
          ['The focus group had ten students.', true],
          ['The students liked the menu from the beginning.', false],
          ['The number of visitors doubled after the launch.', true]
        ]
      },
      {
        id: 't3', title: 'Why Flash Disappeared', ru: 'Почему исчез Flash', level: 'B1–B2',
        text: 'In the early two thousands, Flash was everywhere. Designers loved it because they could create rich animations, games and videos. But Flash had detractors too. Search engine crawlers could not read the text inside Flash movies, so many Flash sites were almost invisible in search results. Users had to install a plug-in, and the plug-in often had security problems. The iPhone never supported Flash at all. Soon HTML5, CSS3 and JavaScript could do the same things without any plug-ins, and the debate slowly subsided. Adobe stopped supporting Flash at the end of 2020, and browsers banned it completely.',
        tf: [
          ['Designers liked Flash because of rich animations.', true],
          ['Crawlers could easily read the text in Flash movies.', false],
          ['Users needed a plug-in to watch Flash content.', true],
          ['The iPhone supported Flash from the start.', false],
          ['Adobe stopped supporting Flash at the end of 2020.', true]
        ]
      }
    ],

    /* ---- Speaking: talking points (exercise 12) ---- */
    topics: [
      {
        id: 's1', title: 'Web site design', ru: 'Проектирование сайта', icon: 'palette',
        prompts: ['What is a web site? What can it be compared to?', 'What are the four basic aspects of commercial web design?', 'What is a home page? What is a splash page, and why is it rare today?', 'How is a site published and promoted?'],
        phrases: ['A web site can be compared to a book.', 'The basic aspects of design are content, usability, appearance and visibility.', 'First of all, … Secondly, … Finally, …', 'To increase traffic, the web master can submit the site to search engines.']
      },
      {
        id: 's2', title: 'Web pages accessibility', ru: 'Доступность веб-страниц', icon: 'access',
        prompts: ['What does accessibility mean?', 'Name the main principles of accessible design.', 'Why are layout tables a problem for screen readers?', 'Who benefits from accessible websites?'],
        phrases: ['It is essential that everyone can use the site.', 'One of the key principles is to use semantic markup.', 'For example, every image needs a text equivalent.', 'Accessible sites are better for everyone.']
      },
      {
        id: 's3', title: 'Website planning', ru: 'Планирование сайта', icon: 'target',
        prompts: ['Why is a purpose statement important?', 'How do you define the target audience?', 'How should the content be organised?', 'Why should you test compatibility on every platform?'],
        phrases: ['Before creating a website, it is important to plan it.', 'The next step is to define the target audience.', 'Anything that does not support the purpose should be removed.', 'To sum up, planning saves time and money.']
      },
      {
        id: 's4', title: 'Controversy in web design', ru: 'Споры о целях и методах веб-дизайна', icon: 'flame',
        prompts: ['Liquid or fixed layout: which do you prefer and why?', 'Why did the debate about Flash subside?', 'Why should designers forgo table layouts?', 'Form or function: what is more important for you?'],
        phrases: ['Proponents of liquid layouts argue that…', 'On the other hand, detractors say that…', 'In my opinion, the best designs are synergistic.', 'I agree / I don\'t agree with this point of view because…']
      }
    ],

    /* ---- Game: Synonym Swap (like exercise 6). Target in {curly braces}. ---- */
    synonyms: [
      { s: 'The {external} part of a site includes the page layout, graphics and text.', o: ['front end', 'back end', 'plug-in', 'tag'], ru: 'Внешняя часть сайта (фронтенд) включает макет страницы, графику и текст.' },
      { s: 'The {purpose} of our project is to help students learn IT English.', o: ['intent', 'response', 'splash', 'template'], ru: 'Цель нашего проекта — помочь студентам выучить английский для ИТ.' },
      { s: 'Because of the {fast} growth of mobile traffic, sites must be responsive.', o: ['rapid', 'static', 'bit-mapped', 'synergistic'], ru: 'Из-за быстрого роста мобильного трафика сайты должны быть адаптивными.' },
      { s: 'Photos are usually stored as {raster} images.', o: ['bit-mapped', 'dynamic', 'liquid', 'semantic'], ru: 'Фотографии обычно хранятся как растровые изображения.' },
      { s: 'Text and images are placed on a page with HTML {control codes}.', o: ['tags', 'bullets', 'fonts', 'crawlers'], ru: 'Текст и изображения размещаются на странице с помощью управляющих кодов HTML (тегов).' },
      { s: 'The web master is {sending} the new site to Yandex and Google.', o: ['submitting', 'banning', 'forgoing', 'subverting'], ru: 'Веб-мастер отправляет (регистрирует) новый сайт в Яндексе и Google.' },
      { s: 'Old browsers needed {additional software modules} to play video.', o: ['plug-ins', 'templates', 'disclaimers', 'hyperlinks'], ru: 'Старым браузерам для воспроизведения видео требовались дополнительные программные модули (плагины).' },
      { s: 'The {reaction} of users to the new design was very positive.', o: ['response', 'compatibility', 'intent', 'quirk'], ru: 'Реакция пользователей на новый дизайн была очень положительной.' },
      { s: '{Showy} pages with big animations welcome visitors to some sites.', o: ['Splash', 'Static', 'Tabular', 'Fixed'], ru: 'Эффектные страницы-заставки с большой анимацией встречают посетителей на некоторых сайтах.' },
      { s: 'Check the {suitability} of your site for different browsers.', o: ['compatibility', 'visibility', 'navigation', 'appearance'], ru: 'Проверьте совместимость вашего сайта с разными браузерами.' },
      { s: 'The page starts with a {statement that limits responsibility}.', o: ['disclaimer', 'template', 'crawler', 'bullet'], ru: 'Страница начинается с оговорки об ограничении ответственности (дисклеймера).' },
      { s: '{Supporters} of fixed layouts want full control over the design.', o: ['Proponents', 'Detractors', 'Crawlers', 'Templates'], ru: 'Сторонники фиксированной вёрстки хотят полного контроля над дизайном.' },
      { s: '{Critics} of Flash said that it was slow and unsafe.', o: ['Detractors', 'Proponents', 'Web masters', 'Plug-ins'], ru: 'Критики Flash говорили, что он медленный и небезопасный.' },
      { s: 'The argument about table layouts slowly {calmed down}.', o: ['subsided', 'submitted', 'subverted', 'uploaded'], ru: 'Спор о табличной вёрстке постепенно утих.' },
      { s: 'Modern designers {do without} table layouts and use CSS.', o: ['forgo', 'subside', 'publish', 'submit'], ru: 'Современные дизайнеры обходятся без табличной вёрстки и используют CSS.' },
      { s: 'Every old browser had its own {peculiarities}.', o: ['quirks', 'bullets', 'tags', 'fonts'], ru: 'У каждого старого браузера были свои особенности (причуды).' },
      { s: 'We built all the pages from one {pattern}.', o: ['template', 'crawler', 'disclaimer', 'response'], ru: 'Мы построили все страницы по одному шаблону.' },
      { s: 'Search engine {robots} could not read the text inside Flash.', o: ['crawlers', 'proponents', 'plug-ins', 'templates'], ru: 'Поисковые роботы не могли читать текст внутри Flash.' },
      { s: 'Some companies {prohibited} Flash on their websites.', o: ['banned', 'submitted', 'subsided', 'published'], ru: 'Некоторые компании запретили Flash на своих сайтах.' },
      { s: 'In the best designs, form and function are {working together}.', o: ['synergistic', 'static', 'bit-mapped', 'rapid'], ru: 'В лучших дизайнах форма и функция действуют совместно (синергично).' },
      { s: 'With a liquid layout, the designer {gives up} some control over the page.', o: ['relinquishes', 'submits', 'bans', 'uploads'], ru: 'При «резиновой» вёрстке дизайнер отказывается от части контроля над страницей.' },
      { s: 'Using tables for design {undermines} the meaning of HTML.', o: ['subverts', 'subsides', 'submits', 'forgoes'], ru: 'Использование таблиц для оформления подрывает смысл HTML.' }
    ],

    /* ---- Game: Sort it ---- */
    sortSets: {
      fb: {
        title: 'Front-end или Back-end?',
        left: { id: 'front', label: 'Front-end', icon: 'monitor', hint: 'что видит и слышит пользователь' },
        right: { id: 'back', label: 'Back-end', icon: 'server', hint: 'что работает «за кадром»' },
        items: [
          ['Page layout', 'front'], ['User interface', 'front'], ['Graphics and images', 'front'], ['Text and fonts', 'front'],
          ['Audio and video', 'front'], ['Navigation menu', 'front'], ['Colours and style', 'front'], ['Buttons and forms on the screen', 'front'],
          ['Server-side scripts', 'back'], ['Database', 'back'], ['Source code organisation', 'back'], ['Password checking', 'back'],
          ['Processing form data', 'back'], ['Invisible scripted functions', 'back'], ['Server configuration', 'back'], ['PHP code on the server', 'back']
        ]
      },
      sd: {
        title: 'Static или Dynamic?',
        left: { id: 'static', label: 'Static page', icon: 'file', hint: 'меняется только вручную' },
        right: { id: 'dynamic', label: 'Dynamic page', icon: 'gear', hint: 'подстраивается под ситуацию' },
        items: [
          ['Updated by hand by a web master', 'static'], ['The same content for every visitor', 'static'], ['Plain HTML and CSS files', 'static'],
          ['A simple one-page business card site', 'static'], ['A college history page that never changes', 'static'], ['A printed-style price list, edited once a year', 'static'],
          ['Shows your name after you log in', 'dynamic'], ['A news feed that updates itself', 'dynamic'], ['An online shop with a cart', 'dynamic'],
          ['Weather for your city', 'dynamic'], ['Built by PHP from a database', 'dynamic'], ['Search results for your query', 'dynamic']
        ]
      }
    },

    /* ---- Final test pool ---- */
    test: [
      { t: 'choice', q: 'Web design is the process of planning and creating content delivered via…', o: ['the Internet', 'the radio', 'printed books', 'television'] },
      { t: 'choice', q: 'Which of these is a markup language?', o: ['HTML', 'PHP', 'Python', 'SQL'] },
      { t: 'choice', q: 'What is a static page?', o: ['A page that doesn\'t change until someone edits it by hand', 'A page built by PHP for every request', 'A page with a lot of animation', 'A page that loads very slowly'] },
      { t: 'choice', q: 'Which of these is a server-side scripting language?', o: ['PHP', 'CSS', 'HTML', 'JPEG'] },
      { t: 'choice', q: 'In the unit, a web site is compared to…', o: ['a book', 'a newspaper', 'a telephone', 'a car'] },
      { t: 'choice', q: 'Which is NOT one of the four basic aspects of commercial web design?', o: ['Price', 'Content', 'Usability', 'Visibility'] },
      { t: 'choice', q: 'The first page of a web site is called…', o: ['the home page', 'the splash page', 'the back end', 'the template'] },
      { t: 'choice', q: 'An FTP client is used to…', o: ['upload site files to a server', 'check spelling', 'design logos', 'read pages aloud'] },
      { t: 'choice', q: 'Which of these belongs to the back end?', o: ['Server-side components', 'Page layout', 'Graphics', 'Audio'] },
      { t: 'choice', q: 'Which accessibility principle is correct?', o: ['Use CSS rather than tables for layout', 'Use frames for navigation', 'Write «Click here» links', 'Avoid text equivalents'] },
      { t: 'choice', q: 'A screen reader…', o: ['reads the page aloud for blind users', 'takes screenshots', 'checks spelling', 'blocks advertisements'] },
      { t: 'choice', q: 'What does a purpose statement show?', o: ['What the site will accomplish and what users will get', 'The list of fonts', 'The server address', 'The price list'] },
      { t: 'choice', q: 'The group of people you expect to visit your site is the…', o: ['target audience', 'back end', 'template', 'web master'] },
      { t: 'choice', q: 'Why was GIF used for transparent images for a long time?', o: ['Internet Explorer did not fully support PNG transparency', 'GIF has better colours', 'PNG was banned', 'JPEG did not exist yet'] },
      { t: 'choice', q: 'The proponents of an idea are its…', o: ['supporters', 'critics', 'inventors', 'users'] },
      { t: 'choice', q: 'A crawler is…', o: ['a search engine robot that indexes pages', 'a very slow website', 'a type of font', 'a plug-in for video'] },
      { t: 'choice', q: '«The debate subsided» means that the debate…', o: ['became quieter', 'became louder', 'started', 'was published'] },
      { t: 'choice', q: 'Tables should be used for…', o: ['tabular information', 'page layout', 'animation', 'splash pages'] },
      { t: 'choice', q: 'Choose the correct translation of «наложенным платежом».', o: ['cash on delivery', 'dead tree edition', 'bulletin board', 'advertising action'] },
      { t: 'input', q: 'Напишите по-английски: «быстрый, стремительный»', a: ['rapid'] },
      { t: 'input', q: 'Напишите по-английски: «совместимость»', a: ['compatibility'] },
      { t: 'input', q: 'Напишите по-английски: «подключаемая программа, плагин»', a: ['plug-in'] },
      { t: 'input', q: 'Напишите по-английски: «шаблон»', a: ['template'] },
      { t: 'input', q: 'Напишите по-английски: «оговорка, отказ от ответственности»', a: ['disclaimer'] },
      { t: 'input', q: 'Напишите по-английски: «тег, управляющий код»', a: ['tag'] },
      { t: 'input', q: 'Расшифруйте: CSS = Cascading Style ______', a: ['sheets'] },
      { t: 'input', q: 'Расшифруйте: DOM = Document ______ Model', a: ['object'] },
      { t: 'input', q: 'Напишите по-английски: «редактировать»', a: ['edit'] },
      { t: 'tf', q: 'JavaScript is a server-side language that runs only on the server.', a: false },
      { t: 'tf', q: 'Splash pages are very popular on commercial websites today.', a: false },
      { t: 'tf', q: 'The front end is the observable content of a website.', a: true },
      { t: 'tf', q: 'The W3C allows layout tables if they make sense when linearized.', a: true },
      { t: 'tf', q: 'You should remove content that does not support the purpose of the site.', a: true },
      { t: 'tf', q: 'A liquid layout always has the same width on every screen.', a: false }
    ]
  };
})();
