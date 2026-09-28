/* Lessons for Unit 18 "Web Design" — adapted texts written for this site.
   [[text|id]] marks a glossary term (id = vocabulary id; defaults to slug of text).
   In quizzes the first option is the correct one; options are shuffled on render. */
(function () {
  'use strict';
  const DS = (window.DS = window.DS || {});

  DS.lessons = [
    {
      id: 'l1', title: 'What Is Web Design?', ru: 'Что такое веб-дизайн?', icon: 'layout', minutes: 5,
      paras: [
        {
          en: 'Web design is the process of planning, modelling and building content that people receive through the Internet. A web designer uses [[markup languages|markup-language]] such as HTML, so that a web browser can interpret the content and show it on the screen.',
          ru: 'Веб-дизайн — это процесс планирования, моделирования и создания контента, который люди получают через интернет. Веб-дизайнер использует языки разметки, такие как HTML, чтобы браузер мог интерпретировать контент и показать его на экране.'
        },
        {
          en: 'The [[intent]] of web design is to create a web site: a collection of files stored on one or more web servers. When a user requests a page, the server sends it back, and the browser displays text, forms, pictures and interactive elements.',
          ru: 'Цель веб-дизайна — создать веб-сайт, то есть набор файлов, хранящихся на одном или нескольких веб-серверах. Когда пользователь запрашивает страницу, сервер отправляет её обратно, и браузер отображает текст, формы, изображения и интерактивные элементы.'
        },
        {
          en: 'Simple elements are placed on a page with HTML [[tags|tag]]. For example, [[bit-mapped]] images in GIF, JPEG or PNG format are added with the <img> tag. In the past, more complex media such as animation, video and sound required [[plug-ins|plug-in]] like Flash or QuickTime. Plug-ins were also embedded into pages with tags.',
          ru: 'Простые элементы размещаются на странице с помощью HTML-тегов. Например, растровые изображения в форматах GIF, JPEG или PNG добавляются тегом <img>. Раньше для более сложных медиа — анимации, видео и звука — требовались плагины, такие как Flash или QuickTime. Плагины тоже встраивались в страницы с помощью тегов.'
        }
      ],
      terms: ['markup-language', 'intent', 'tag', 'bit-mapped', 'plug-in'],
      note: {
        title: 'Как сейчас',
        text: 'Плагины Flash и QuickTime больше не используются: Adobe прекратила поддержку Flash в конце 2020 года. Видео и звук встраивают стандартными тегами HTML5 <video> и <audio>, а анимации делают на CSS и JavaScript.'
      },
      quiz: [
        { q: 'What does a web browser do with markup?', o: ['It interprets it and displays the page', 'It sends it to a search engine', 'It turns it into a plug-in', 'It deletes unused tags'] },
        { q: 'Which of these is a bit-mapped image format?', o: ['PNG', 'PHP', 'XML', 'CSS'] },
        { q: 'In the past, what did browsers need to play video and animation?', o: ['Plug-ins such as Flash', 'Semantic markup', 'An FTP client', 'Search engine crawlers'] }
      ],
      discuss: [
        { q: 'What kind of process is web design? Give general characteristics.', hint: 'упр. 1, вопрос 1', a: 'Web design is a creative and technical process. Designers plan, model and build electronic content and deliver it through the Internet in a form — for example, HTML — that a browser can interpret and display.' },
        { q: 'What is web design aimed at?', hint: 'упр. 1, вопрос 2', a: 'It is aimed at creating a web site — a collection of files on one or more web servers — that presents content, including interactive features, to the end user in the form of web pages.' }
      ]
    },
    {
      id: 'l2', title: 'Static and Dynamic Pages', ru: 'Статические и динамические страницы', icon: 'server', minutes: 6,
      paras: [
        {
          en: 'Web pages are usually classified as static or dynamic. A [[static page]] does not change its content or layout with every request. It stays the same until a human — a [[web master]] or a programmer — edits it by hand.',
          ru: 'Веб-страницы обычно делят на статические и динамические. Статическая страница не меняет содержимое и макет при каждом запросе. Она остаётся прежней, пока человек — веб-мастер или программист — не отредактирует её вручную.'
        },
        {
          en: 'A [[dynamic page]] adapts its content or appearance to the situation: who the user is, what time it is, what the user clicks, or what has changed in the database. Content can change on the user\'s computer with [[client-side]] languages such as JavaScript, which modify the elements of the DOM.',
          ru: 'Динамическая страница подстраивает содержимое или внешний вид под ситуацию: кто пользователь, который час, что он нажимает или что изменилось в базе данных. Контент может меняться прямо на компьютере пользователя с помощью клиентских языков, таких как JavaScript, которые изменяют элементы DOM.'
        },
        {
          en: 'Dynamic content can also be built on the server with [[server-side scripting]] languages such as PHP, Python, Java or ASP. The server runs the script, takes data from a database and sends ready HTML to the browser. Complex web applications usually combine both approaches.',
          ru: 'Динамический контент можно формировать и на сервере с помощью серверных языков сценариев — PHP, Python, Java или ASP. Сервер выполняет скрипт, берёт данные из базы и отправляет браузеру готовый HTML. Сложные веб-приложения обычно сочетают оба подхода.'
        },
        {
          en: 'As IT becomes more specialised, people often separate web design, which is about how pages look and feel, from web development, which covers the logic and infrastructure of all web services.',
          ru: 'По мере специализации в ИТ веб-дизайн — работу над тем, как страницы выглядят и воспринимаются, — часто отделяют от веб-разработки, которая охватывает логику и инфраструктуру всех веб-сервисов.'
        }
      ],
      terms: ['static-page', 'web-master', 'dynamic-page', 'client-side', 'server-side-scripting'],
      note: {
        title: 'Как сейчас',
        text: 'Термин DHTML (Dynamic HTML) почти не используется — изменение DOM через JavaScript стало нормой. Популярные серверные языки сегодня: PHP, Python, JavaScript (Node.js), Java, C# и Go.'
      },
      quiz: [
        { q: 'Who changes a static page?', o: ['A web master or a programmer, by hand', 'The database, automatically', 'The browser, every second', 'A search engine crawler'] },
        { q: 'Which language is used for client-side scripting?', o: ['JavaScript', 'PHP', 'SQL', 'ASP'] },
        { q: 'A news page shows different headlines in the morning and in the evening. This page is…', o: ['dynamic', 'static', 'bit-mapped', 'a splash page'] }
      ],
      discuss: [
        { q: 'How are web pages classified? Explain the difference.', hint: 'упр. 1, вопрос 3', a: 'They are classified as static and dynamic. Static pages look the same for everyone until someone updates them manually. Dynamic pages change their content or appearance depending on the user, the time, the user\'s actions or data in a database.' },
        { q: 'Where can dynamic content be created?', hint: 'обсуждение', a: 'On the client side — in the user\'s browser with JavaScript — and on the server side with languages like PHP, Python or Java. Complex applications usually use both.' }
      ]
    },
    {
      id: 'l3', title: 'Designing a Web Site', ru: 'Проектирование сайта', icon: 'palette', minutes: 7,
      paras: [
        {
          en: 'A web site is a collection of information about a particular topic. Designing it means arranging and creating the web pages that make up the site. You can compare a web site to a book: every page of the book is a web page.',
          ru: 'Веб-сайт — это собрание информации на определённую тему. Проектировать сайт — значит упорядочивать и создавать веб-страницы, из которых он состоит. Сайт можно сравнить с книгой: каждая страница книги — это веб-страница.'
        },
        {
          en: 'Because of the [[rapid]] development of the Internet, new design aspects appear all the time. For commercial sites, there are four basic aspects: [[content]] — useful information for the target audience; [[usability]] — a [[user-friendly]] interface and simple, reliable [[navigation]]; [[appearance]] — one consistent, professional style; and [[visibility]] — the site must be easy to find in [[search engines|search-engine]].',
          ru: 'Из-за стремительного развития интернета постоянно появляются новые аспекты дизайна. Для коммерческих сайтов есть четыре основных аспекта: контент — полезная информация для целевой аудитории; удобство — дружелюбный интерфейс и простая, надёжная навигация; внешний вид — единый профессиональный стиль; видимость — сайт должен легко находиться в поисковых системах.'
        },
        {
          en: 'The first page of a site is called the [[home page]] or index. Some sites also have a [[splash]] page with a welcome message, a choice of language or a [[disclaimer]]. Today visitors are impatient, so splash pages are rarely used on commercial sites. Every page is a separate HTML file with its own URL, and all pages are connected by a menu of [[hyperlinks|hyperlink]].',
          ru: 'Первая страница сайта называется главной (home page) или index. На некоторых сайтах есть ещё страница-заставка с приветствием, выбором языка или оговоркой. Сегодня посетители нетерпеливы, поэтому заставки на коммерческих сайтах используют редко. Каждая страница — отдельный HTML-файл со своим URL, а все страницы связаны меню из гиперссылок.'
        },
        {
          en: 'When the site is ready, it must be published: the web master [[uploads|upload]] the files to a server, for example with an FTP client. To increase [[traffic]], the site can be [[submitted|submit]] to search engines, and the owner can exchange links with similar sites.',
          ru: 'Когда сайт готов, его нужно опубликовать: веб-мастер загружает файлы на сервер, например с помощью FTP-клиента. Чтобы увеличить трафик, сайт можно зарегистрировать в поисковых системах, а владелец может обмениваться ссылками с похожими сайтами.'
        }
      ],
      terms: ['rapid', 'content', 'usability', 'appearance', 'visibility', 'home-page', 'splash', 'disclaimer', 'hyperlink', 'upload', 'traffic', 'submit'],
      note: {
        title: 'Как сейчас',
        text: 'Сайты публикуют не только через FTP, но и через Git (GitHub Pages, GitLab Pages), панели хостинга и автоматический деплой (CI/CD). Для продвижения в России важны Яндекс Вебмастер и Google Search Console.'
      },
      quiz: [
        { q: 'What is a web site compared to in the lesson?', o: ['A book', 'A newspaper', 'A library', 'A shop'] },
        { q: 'Which aspect means that the site is easy to find in search engines?', o: ['Visibility', 'Usability', 'Appearance', 'Content'] },
        { q: 'Why are splash pages rarely used on commercial sites?', o: ['Visitors are impatient and want content quickly', 'They are illegal', 'Browsers cannot show them', 'They only work with Flash'] }
      ],
      discuss: [
        { q: 'What is a web site? What is it compared to?', hint: 'упр. 1, вопрос 4', a: 'A web site is a collection of information about a particular topic, made up of web pages. It is compared to a book, where each page of the book is a web page.' },
        { q: 'Reveal basic aspects of a typical commercial web site design.', hint: 'упр. 2', a: 'Content — relevant information for the target audience; usability — a user-friendly site with simple, reliable navigation; appearance — a consistent, professional and appealing style; visibility — the site must be easy to find through major search engines and advertising.' },
        { q: 'What are the steps of creating a web site?', hint: 'упр. 1, вопрос 5', a: 'Plan the site; create the pages (HTML files with their own URLs); link them with a navigation menu; publish (upload) the files to a server; promote the site: submit it to search engines, exchange links and create affiliations with similar sites.' }
      ]
    },
    {
      id: 'l4', title: 'Front-end and Back-end', ru: 'Фронтенд и бэкенд', icon: 'columns', minutes: 5,
      paras: [
        {
          en: 'Web site design combines several disciplines: information systems, information technology and communication design. A web site is an information system, and its parts are often classified as the [[front end|front-end]] and the [[back end|back-end]].',
          ru: 'Проектирование сайтов объединяет несколько дисциплин: информационные системы, информационные технологии и коммуникационный дизайн. Сайт — это информационная система, и его части часто делят на фронтенд и бэкенд.'
        },
        {
          en: 'The front end is everything the user can see and hear: the page [[layout]], the [[user interface]], graphics, text and audio. The back end is invisible: the organisation and efficiency of the source code, scripted functions and the server-side components that process the data sent from the front end.',
          ru: 'Фронтенд — это всё, что пользователь может увидеть и услышать: макет страницы, пользовательский интерфейс, графика, текст и звук. Бэкенд невидим: это организация и эффективность исходного кода, скриптовые функции и серверные компоненты, которые обрабатывают данные, пришедшие с фронтенда.'
        },
        {
          en: 'In a small project, one multi-skilled person — a [[web master]] — can do everything. In a large project, a project manager organises [[collaborative]] work between specialists: designers, front-end and back-end developers, testers and content managers.',
          ru: 'В небольшом проекте всё может сделать один разносторонний специалист — веб-мастер. В крупном проекте менеджер проекта организует совместную работу специалистов: дизайнеров, фронтенд- и бэкенд-разработчиков, тестировщиков и контент-менеджеров.'
        }
      ],
      terms: ['front-end', 'back-end', 'layout', 'user-interface', 'collaborative', 'web-master'],
      note: {
        title: 'Как сейчас',
        text: 'Появилась профессия full-stack-разработчика — он работает и с фронтендом, и с бэкендом. Инструменты фронтенда: HTML, CSS, JavaScript/TypeScript, React, Vue. Бэкенда: PHP (Laravel), Python (Django), Node.js, Java, Go и базы данных PostgreSQL, MySQL.'
      },
      quiz: [
        { q: 'Which of these belongs to the front end?', o: ['Page layout and graphics', 'Database queries', 'Server configuration', 'Source code efficiency'] },
        { q: 'What does the back end do with data from the front end?', o: ['Processes it', 'Draws it on the screen', 'Prints it', 'Translates it'] },
        { q: 'Who can build a whole small website alone?', o: ['A multi-skilled web master', 'A search engine crawler', 'A screen reader', 'A focus group'] }
      ],
      discuss: [
        { q: 'What classification of web site components is proposed?', hint: 'упр. 1, вопрос 6', a: 'Components are divided into the front end — observable content such as layout, user interface, graphics, text and audio — and the back end — the organisation and efficiency of the source code, invisible scripted functions and server-side components that process the output from the front end.' },
        { q: 'Would you like to be a front-end or a back-end developer? Why?', hint: 'ваше мнение', a: 'Model answer: I would like to be a back-end developer because I enjoy logic, databases and algorithms more than visual design. / I prefer the front end because I like creating interfaces that people can see and use.' }
      ]
    },
    {
      id: 'l5', title: 'Accessible Web Design', ru: 'Доступный веб-дизайн', icon: 'access', minutes: 6,
      paras: [
        {
          en: '[[Accessibility|accessibility]] means that everyone, including people with disabilities, can use a web site. To be accessible, web pages must follow several principles.',
          ru: 'Доступность означает, что сайтом могут пользоваться все, включая людей с ограниченными возможностями. Чтобы быть доступными, страницы должны следовать нескольким принципам.'
        },
        {
          en: 'First, use [[semantic markup]] that gives the document a meaningful structure: headings, lists, paragraphs and navigation. Use a valid markup language that follows a published standard, a DTD or a Schema. Provide [[text equivalents|text-equivalent]] for all non-text content, such as images and multimedia.',
          ru: 'Во-первых, используйте семантическую разметку, которая придаёт документу осмысленную структуру: заголовки, списки, абзацы, навигацию. Пишите корректную разметку, соответствующую опубликованному стандарту — DTD или схеме. Давайте текстовые эквиваленты для всего нетекстового содержимого, например изображений и мультимедиа.'
        },
        {
          en: 'Second, write hyperlinks that make sense out of context, and avoid «Click here». Don\'t use frames, and use CSS rather than HTML tables for [[layout]]. Finally, write the page so that it stays clear when a [[screen reader]] reads the source code line by line. Tables used for design often turn into nonsense when they are read aloud.',
          ru: 'Во-вторых, пишите гиперссылки, понятные вне контекста, и избегайте «Нажмите здесь». Не используйте фреймы и применяйте для вёрстки CSS, а не HTML-таблицы. Наконец, пишите страницу так, чтобы она оставалась понятной, когда программа экранного доступа читает исходный код строка за строкой. Таблицы, использованные для оформления, при чтении вслух часто превращаются в бессмыслицу.'
        },
        {
          en: 'The W3C allows one exception: layout tables are acceptable if they still make sense when they are linearized, or if an alternative version is available. Accessibility is also changing because of Content Management Systems, which let people edit pages without knowing a programming language.',
          ru: 'W3C допускает одно исключение: таблицы для вёрстки приемлемы, если сохраняют смысл после линеаризации или если есть альтернативная версия. На доступность влияют и системы управления контентом (CMS), которые позволяют редактировать страницы без знания языка программирования.'
        }
      ],
      terms: ['accessibility', 'semantic-markup', 'text-equivalent', 'layout', 'screen-reader', 'hyperlink'],
      note: {
        title: 'Как сейчас',
        text: 'Современный стандарт доступности — WCAG 2.2. В HTML5 есть семантические теги <header>, <nav>, <main>, <article>, <footer>, а у изображений обязателен атрибут alt. Фреймы (<frame>) из HTML5 удалены. В учебнике сказано, что стандарты семантического веба задаёт IEEE, — на самом деле это делает W3C.'
      },
      quiz: [
        { q: 'Which link text is the most accessible?', o: ['Download the price list (PDF)', 'Click here', 'Here', 'More'] },
        { q: 'What should you use for page layout?', o: ['CSS', 'HTML tables', 'Frames', 'Plug-ins'] },
        { q: 'What is a text equivalent?', o: ['A text description of non-text content, like alt text for an image', 'A copy of the page in another language', 'A special font for screen readers', 'A hyperlink to the home page'] }
      ],
      discuss: [
        { q: 'State the main principles of web pages and sites to be accessible.', hint: 'упр. 3', a: 'Use semantic markup; use a valid markup language that conforms to a DTD or Schema; provide text equivalents for non-text content; write hyperlinks that make sense out of context; don\'t use frames; use CSS rather than tables for layout; make the page intelligible when a screen reader reads it line by line.' },
        { q: 'Why are layout tables a problem for screen readers?', hint: 'обсуждение', a: 'A screen reader reads the source code line by line. When tables are used for design, the reading order breaks and the information often becomes meaningless.' }
      ]
    },
    {
      id: 'l6', title: 'Website Planning', ru: 'Планирование сайта', icon: 'target', minutes: 7,
      paras: [
        {
          en: 'Before you create and upload a website, take time to plan exactly what it needs. The most important steps are to think about the audience, define the [[purpose]] and decide what content will be developed.',
          ru: 'Прежде чем создавать и загружать сайт, найдите время спланировать, что именно на нём нужно. Самые важные шаги — продумать аудиторию, определить цель и решить, какой контент будет создан.'
        },
        {
          en: 'Purpose. A purpose statement shows what the site will accomplish and what users will get from it. Set short-term and long-term goals and measurable objectives, so that you can track progress and understand whether the site is successful.',
          ru: 'Цель. Формулировка цели показывает, чего добьётся сайт и что получат пользователи. Поставьте краткосрочные и долгосрочные цели и измеримые задачи, чтобы отслеживать прогресс и понимать, успешен ли сайт.'
        },
        {
          en: 'Audience. The [[target audience]] is the group of people who are expected to visit the site. Make a list of their characteristics: who they are, what information they prefer, what computers and devices they use, and how experienced they are on the web.',
          ru: 'Аудитория. Целевая аудитория — это люди, которые, как ожидается, будут посещать сайт. Составьте список их характеристик: кто они, какую информацию предпочитают, какими компьютерами и устройствами пользуются и насколько опытны в интернете.'
        },
        {
          en: 'Content. Collect all the necessary content and organise it according to the audience\'s needs. Remove anything that does not support the purpose. Test the content on a [[focus group]], then group it into categories with short, descriptive titles. These titles become the links in your menu.',
          ru: 'Контент. Соберите весь нужный контент и упорядочьте его под потребности аудитории. Удалите всё, что не поддерживает цель. Проверьте контент на фокус-группе, затем разбейте его на категории с короткими понятными названиями. Эти названия станут ссылками в меню.'
        },
        {
          en: 'Compatibility and restrictions. Visitors use different browsers, screens and devices, so the [[compatibility]] of your site has limits. In the 2000s, Internet Explorer was the main [[restriction]]: it did not fully support W3C standards or PNG transparency. Many problems go unnoticed, so the only way to be sure is to test the site on each platform.',
          ru: 'Совместимость и ограничения. Посетители используют разные браузеры, экраны и устройства, поэтому совместимость сайта имеет пределы. В 2000-х главным ограничением был Internet Explorer: он не полностью поддерживал стандарты W3C и прозрачность PNG. Многие проблемы остаются незамеченными, поэтому единственный способ убедиться — протестировать сайт на каждой платформе.'
        }
      ],
      terms: ['purpose', 'target-audience', 'focus-group', 'compatibility', 'restriction', 'resolution'],
      note: {
        title: 'Как сейчас',
        text: 'Internet Explorer официально закрыт в 2022 году. Главное «ограничение» сегодня — множество мобильных устройств и размеров экранов, поэтому сайты делают адаптивными (responsive design). PNG, SVG и WebP поддерживаются всеми современными браузерами. В России сайт стоит проверять и в Яндекс Браузере.'
      },
      quiz: [
        { q: 'What should a purpose statement show?', o: ['What the site will accomplish and what users will get', 'The colours and fonts of the site', 'The price of hosting', 'The list of HTML tags'] },
        { q: 'What should you do with content that does not support the purpose?', o: ['Remove it', 'Put it on the home page', 'Translate it', 'Hide it on a splash page'] },
        { q: 'What is the only way to be sure a site works on a platform?', o: ['Test it on that platform', 'Read the W3C documentation', 'Add more plug-ins', 'Use a fixed layout'] }
      ],
      discuss: [
        { q: 'What points should be considered before creating and uploading a website? Cover each one.', hint: 'упр. 1, вопрос 7', a: 'Purpose — what the site will accomplish, with short- and long-term goals and measurable objectives. Audience — who will visit and what they need: audience characteristics, information preferences, computer specifications and web experience. Content — collect, organise and categorise it, and remove anything that does not support the purpose. Compatibility and restrictions — browsers, screen resolution, image formats; test on every platform.' },
        { q: 'Describe the target audience of this learning site.', hint: 'ваше мнение', a: 'Model answer: The target audience is ISIP students aged 16–20 who study English for IT. They use smartphones and PCs, prefer short interactive tasks, and have good web experience.' }
      ]
    },
    {
      id: 'l7', title: 'Web Design Debates', ru: 'Споры в веб-дизайне (текст «Issues»)', icon: 'flame', minutes: 8,
      paras: [
        {
          en: 'As in any collaborative work, web designers do not always agree. They have different goals and different methods, and some debates have lasted for years. Here are a few of them.',
          ru: 'Как и в любой совместной работе, веб-дизайнеры не всегда согласны друг с другом. У них разные цели и методы, и некоторые споры длятся годами. Вот несколько из них.'
        },
        {
          en: 'Liquid versus fixed layouts. A [[liquid layout]] stretches to fill the browser window, while a [[fixed layout]] always has the same width. [[Proponents|proponent]] of liquid layouts say that they use the whole screen. [[Detractors|detractor]] answer that very long lines are hard to read. With a liquid layout, the designer [[relinquishes|relinquish]] some control over how the page looks.',
          ru: '«Резиновая» или фиксированная вёрстка. Резиновый макет растягивается на всё окно браузера, а фиксированный всегда имеет одинаковую ширину. Сторонники резиновой вёрстки говорят, что она использует весь экран. Критики отвечают, что очень длинные строки трудно читать. При резиновой вёрстке дизайнер отказывается от части контроля над тем, как выглядит страница.'
        },
        {
          en: 'Flash. For years, Flash let designers create rich animations, but search engine [[crawlers|crawler]] could not read the text inside Flash, and users needed a plug-in. Some companies even [[banned|ban]] it. The argument [[subsided|subside]] only when HTML5 and CSS3 could do the same things without plug-ins.',
          ru: 'Flash. Много лет Flash позволял создавать эффектные анимации, но поисковые роботы не могли прочитать текст внутри Flash, а пользователям нужен был плагин. Некоторые компании даже запретили его. Спор утих, только когда HTML5 и CSS3 научились делать то же самое без плагинов.'
        },
        {
          en: 'CSS versus tables. Tables were created for [[tabular information]], such as timetables or price lists. Using them for page layout [[subverts|subvert]] the meaning of HTML. Modern designers [[forgo]] table layouts and build pages from [[div]] blocks and CSS [[templates|template]], even though every browser has its own [[quirks|quirk]].',
          ru: 'CSS или таблицы. Таблицы создавались для табличных данных, например расписаний или прайс-листов. Использование их для вёрстки подрывает смысл HTML. Современные дизайнеры отказываются от табличной вёрстки и строят страницы из блоков div и CSS-шаблонов, хотя у каждого браузера есть свои причуды.'
        },
        {
          en: 'Form versus function. Some designers care most about beauty: [[fonts|font]], colours and animation. Others care most about function: speed, clear lists with [[bullets|bullet]], easy navigation. The best sites are [[synergistic]]: form and function work together and make each other stronger.',
          ru: 'Форма или функция. Одни дизайнеры больше всего заботятся о красоте: шрифтах, цветах и анимации. Другие — о функции: скорости, понятных маркированных списках, удобной навигации. Лучшие сайты синергичны: форма и функция работают вместе и усиливают друг друга.'
        }
      ],
      terms: ['liquid-layout', 'fixed-layout', 'proponent', 'detractor', 'relinquish', 'crawler', 'ban', 'subside', 'tabular-information', 'subvert', 'forgo', 'div', 'template', 'quirk', 'font', 'bullet', 'synergistic'],
      note: {
        title: 'Как сейчас',
        text: 'Спор «резиновая или фиксированная» решила адаптивная вёрстка: CSS Flexbox, Grid и медиазапросы подстраивают макет под любой экран, а у текста есть максимальная ширина. Flash окончательно заблокирован браузерами с января 2021 года.'
      },
      quiz: [
        { q: 'What do detractors say about liquid layouts?', o: ['Very long lines are hard to read', 'They are too small', 'They need Flash', 'They are illegal'] },
        { q: 'Why couldn\'t search engines index Flash sites well?', o: ['Crawlers could not read the text inside Flash', 'Flash was too cheap', 'Flash used tables', 'Flash had no fonts'] },
        { q: 'What were tables originally created for?', o: ['Tabular information', 'Page layout', 'Animation', 'Navigation menus'] }
      ],
      discuss: [
        { q: 'Which layout do you prefer, liquid or fixed? Give arguments.', hint: 'упр. 8 · обсуждение', a: 'Model answer: I prefer a responsive layout, which combines both ideas. It is liquid on small screens and has a maximum width on large monitors, so lines stay easy to read.' },
        { q: 'Why do you think the Flash debate subsided?', hint: 'упр. 8 · обсуждение', a: 'Because HTML5, CSS3 and JavaScript made plug-ins unnecessary, mobile devices never supported Flash, and browsers finally banned it for security reasons.' },
        { q: 'Summarize the unit using the words from the vocabulary exercises.', hint: 'упр. 4', a: 'Model answer: The intent of web design is to create sites with markup languages and tags. Pages can be static or dynamic. A site has a front end and a back end. Good commercial sites care about content, usability, appearance and visibility, and they must be accessible. Before building a site, we define its purpose, audience and content and check compatibility. Designers still argue about layouts, plug-ins, tables and the balance of form and function.' }
      ]
    }
  ];
})();
