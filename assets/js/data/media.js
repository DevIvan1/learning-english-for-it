/* Podcasts and animated video lessons. Audio is produced by the browser's built-in
   speech synthesis, so nothing is downloaded from external services. */
(function () {
  'use strict';
  const DS = (window.DS = window.DS || {});

  const KATE = { name: 'Kate', role: 'ведущая', voice: 'f', cls: 'a' };
  const MAX = { name: 'Max', role: 'студент ИСиП, 2 курс', voice: 'm', cls: 'b' };
  const ALEX = { name: 'Alex', role: 'тимлид веб-студии', voice: 'm', cls: 'b' };
  const TOM = { name: 'Tom', role: 'QA-инженер, тестирует доступность', voice: 'm', cls: 'b' };

  DS.podcasts = [
    {
      id: 'p1', n: 1, title: 'My First Website: Static or Dynamic?', ru: 'Мой первый сайт: статический или динамический?',
      desc: 'Макс сделал сайт для пиццерии и понял, почему статических страниц бывает недостаточно.',
      cover: 'linear-gradient(135deg, #f59e0b, #ef4444)', icon: 'server', level: 'A2–B1',
      speakers: { a: KATE, b: MAX },
      words: ['static-page', 'dynamic-page', 'web-master', 'submit', 'client-side', 'server-side-scripting', 'purpose'],
      lines: [
        ['a', 'Hi everyone, and welcome to DevSpeak, the podcast about English for IT students. I\'m Kate, and today my guest is Max, a second-year student who has just built his first real website. Hi, Max!', 'Всем привет и добро пожаловать в DevSpeak — подкаст об английском для студентов-айтишников. Я Кейт, и сегодня мой гость — Макс, студент второго курса, который только что сделал свой первый настоящий сайт. Привет, Макс!'],
        ['b', 'Hi, Kate! Thanks for inviting me.', 'Привет, Кейт! Спасибо за приглашение.'],
        ['a', 'So, tell us about the project. What kind of site did you build?', 'Итак, расскажи о проекте. Какой сайт ты сделал?'],
        ['b', 'It\'s a website for a small pizza café near our college. At first, I made it completely static: just HTML and CSS files.', 'Это сайт для маленькой пиццерии рядом с нашим колледжем. Сначала я сделал его полностью статическим: только файлы HTML и CSS.'],
        ['a', 'Static means that the pages don\'t change, right?', 'Статический — значит, страницы не меняются, верно?'],
        ['b', 'Exactly. A static page looks the same for every visitor until somebody edits the file by hand. And that was the problem. The owner changed the menu almost every week, and every time he called me.', 'Именно. Статическая страница выглядит одинаково для всех, пока кто-нибудь не отредактирует файл вручную. В этом и была проблема. Владелец менял меню почти каждую неделю и каждый раз звонил мне.'],
        ['a', 'So you became their full-time web master!', 'То есть ты стал их штатным веб-мастером!'],
        ['b', 'Pretty much! So I decided to make the menu dynamic. Now the dishes and prices are stored in a database, and a PHP script builds the page on the server for every request.', 'Практически! Поэтому я решил сделать меню динамическим. Теперь блюда и цены хранятся в базе данных, а PHP-скрипт собирает страницу на сервере при каждом запросе.'],
        ['a', 'So the owner can update the menu himself?', 'Значит, владелец может сам обновлять меню?'],
        ['b', 'Yes, through a simple admin form. He submits the new prices, and the site shows them immediately. No more phone calls at midnight.', 'Да, через простую форму администратора. Он отправляет новые цены, и сайт сразу их показывает. Больше никаких звонков в полночь.'],
        ['a', 'Did you use any client-side scripting?', 'А клиентские скрипты ты использовал?'],
        ['b', 'A little JavaScript. When you add a pizza to your order, the total price updates without reloading the page. The script changes the DOM right in the browser.', 'Немного JavaScript. Когда добавляешь пиццу в заказ, итоговая цена обновляется без перезагрузки страницы. Скрипт изменяет DOM прямо в браузере.'],
        ['a', 'So you combined both approaches: server-side and client-side.', 'То есть ты объединил оба подхода: серверный и клиентский.'],
        ['b', 'Right. I think most real projects do that.', 'Да. Думаю, так делает большинство реальных проектов.'],
        ['a', 'What was the hardest part?', 'Что было самым сложным?'],
        ['b', 'Honestly, the planning. I started coding before I understood the purpose of the site. Next time I\'ll define the audience and the content first.', 'Честно говоря, планирование. Я начал писать код, ещё не поняв цель сайта. В следующий раз сначала определю аудиторию и контент.'],
        ['a', 'Great advice. Thank you, Max! And thank you all for listening to DevSpeak. See you next time!', 'Отличный совет. Спасибо, Макс! И спасибо всем, кто слушал DevSpeak. До встречи!']
      ],
      quiz: [
        { q: 'What kind of site did Max build?', o: ['A website for a pizza café', 'An online computer shop', 'A blog about games', 'The college website'] },
        { q: 'Why did Max make the menu dynamic?', o: ['The owner changed the menu very often', 'Static sites are not allowed', 'The café wanted animations', 'Search engines cannot read static pages'] },
        { q: 'What does JavaScript do on Max\'s site?', o: ['Updates the total price without reloading', 'Stores prices in the database', 'Uploads files to the server', 'Sends emails to the owner'] }
      ]
    },
    {
      id: 'p2', n: 2, title: 'Front-end or Back-end? Choosing Your Path', ru: 'Фронтенд или бэкенд? Выбираем путь',
      desc: 'Тимлид Алекс объясняет разницу между профессиями и зачем разработчику английский.',
      cover: 'linear-gradient(135deg, #6366f1, #06b6d4)', icon: 'columns', level: 'B1',
      speakers: { a: KATE, b: ALEX },
      words: ['front-end', 'back-end', 'layout', 'user-interface', 'compatibility', 'collaborative', 'submit'],
      lines: [
        ['a', 'Welcome back to DevSpeak! Many students ask me the same question: should I go into front-end or back-end development? To answer it, I\'ve invited Alex, a team lead at a web studio. Hello, Alex!', 'С возвращением в DevSpeak! Многие студенты задают мне один и тот же вопрос: идти во фронтенд или в бэкенд? Чтобы ответить, я пригласила Алекса, тимлида веб-студии. Здравствуй, Алекс!'],
        ['b', 'Hello, Kate. That\'s a great question to start with.', 'Привет, Кейт. Отличный вопрос для начала.'],
        ['a', 'Let\'s begin with the basics. What is the front end?', 'Начнём с основ. Что такое фронтенд?'],
        ['b', 'The front end is everything the user can see and hear: the layout, the user interface, graphics, text and audio. Front-end developers work with HTML, CSS and JavaScript.', 'Фронтенд — это всё, что пользователь видит и слышит: макет, интерфейс, графика, текст и звук. Фронтенд-разработчики работают с HTML, CSS и JavaScript.'],
        ['a', 'And the back end?', 'А бэкенд?'],
        ['b', 'The back end is the invisible part. It\'s the source code, the scripts and the server-side components that process the data coming from the front end. For example, when you submit a login form, the back end checks your password.', 'Бэкенд — невидимая часть. Это исходный код, скрипты и серверные компоненты, которые обрабатывают данные с фронтенда. Например, когда ты отправляешь форму входа, бэкенд проверяет пароль.'],
        ['a', 'Which one is more difficult?', 'Что из этого сложнее?'],
        ['b', 'Neither. They\'re just different. Front-end people need a good eye for design and patience with browser compatibility. Back-end people need to love logic, databases and security.', 'Ни то ни другое. Они просто разные. Фронтендерам нужны чувство дизайна и терпение к совместимости браузеров. Бэкендерам нужно любить логику, базы данных и безопасность.'],
        ['a', 'Can one person do both?', 'Может ли один человек делать и то и другое?'],
        ['b', 'Yes, we call them full-stack developers. In a small project, one multi-skilled person can build the whole site. But in a big project, a project manager organises collaborative work between specialists.', 'Да, таких называют full-stack-разработчиками. В небольшом проекте один разносторонний человек может сделать весь сайт. Но в большом проекте менеджер организует совместную работу специалистов.'],
        ['a', 'What would you advise our students?', 'Что бы ты посоветовал нашим студентам?'],
        ['b', 'Try both. Build a small project from start to finish. You\'ll quickly feel what you enjoy more: making things look great or making things work fast.', 'Попробуйте и то и другое. Сделайте небольшой проект от начала до конца. Вы быстро почувствуете, что вам нравится больше: делать красиво или делать так, чтобы всё быстро работало.'],
        ['a', 'And what about English?', 'А как насчёт английского?'],
        ['b', 'It\'s essential. Documentation, error messages, Stack Overflow, code reviews: almost everything is in English. The better your English, the faster you grow.', 'Он необходим. Документация, сообщения об ошибках, Stack Overflow, код-ревью — почти всё на английском. Чем лучше ваш английский, тем быстрее вы растёте.'],
        ['a', 'Thanks, Alex! That\'s all for today. Keep coding and keep learning English!', 'Спасибо, Алекс! На сегодня всё. Продолжайте писать код и учить английский!']
      ],
      quiz: [
        { q: 'What does the back end do when you submit a login form?', o: ['Checks your password', 'Changes the font', 'Plays an animation', 'Draws the layout'] },
        { q: 'What do front-end developers need, according to Alex?', o: ['A good eye for design and patience with compatibility', 'Only knowledge of databases', 'A degree in physics', 'Flash and QuickTime'] },
        { q: 'What is Alex\'s main advice?', o: ['Try both and build a small project from start to finish', 'Always choose the back end', 'Never learn JavaScript', 'Work alone on big projects'] }
      ]
    },
    {
      id: 'p3', n: 3, title: 'Accessibility Is Not Optional', ru: 'Доступность — это не опция',
      desc: 'Том пользуется программой экранного доступа и рассказывает, какие ошибки на сайтах мешают ему больше всего.',
      cover: 'linear-gradient(135deg, #10b981, #3b82f6)', icon: 'access', level: 'B1',
      speakers: { a: KATE, b: TOM },
      words: ['accessibility', 'screen-reader', 'text-equivalent', 'hyperlink', 'semantic-markup', 'tabular-information', 'layout'],
      lines: [
        ['a', 'Hi, and welcome to DevSpeak. Today we\'re talking about accessibility. My guest is Tom, a QA engineer who tests websites for accessibility. Tom, you also use a screen reader yourself, right?', 'Привет и добро пожаловать в DevSpeak. Сегодня говорим о доступности. Мой гость — Том, QA-инженер, который тестирует сайты на доступность. Том, ты ведь и сам пользуешься программой экранного доступа?'],
        ['b', 'That\'s right, Kate. I have very low vision, so I use a screen reader every day. It reads the page aloud, line by line.', 'Верно, Кейт. У меня очень слабое зрение, поэтому я каждый день пользуюсь программой экранного доступа. Она читает страницу вслух, строка за строкой.'],
        ['a', 'What\'s the most common problem you meet?', 'С какой проблемой ты сталкиваешься чаще всего?'],
        ['b', 'Images without text equivalents. If a picture has no alt text, the screen reader just says «image», or it reads the file name, like «IMG underscore four thousand». That tells me nothing.', 'Изображения без текстовых эквивалентов. Если у картинки нет alt-текста, программа просто говорит «изображение» или читает имя файла, например «IMG подчёркивание четыре тысячи». Мне это ничего не говорит.'],
        ['a', 'Not very helpful! What else?', 'Не очень полезно! Что ещё?'],
        ['b', 'Links that say «Click here». I often jump from link to link, so every link must make sense out of context. «Download the timetable» is great. «Click here» is useless.', 'Ссылки «Нажмите здесь». Я часто перепрыгиваю от ссылки к ссылке, поэтому каждая ссылка должна быть понятна вне контекста. «Скачать расписание» — отлично. «Нажмите здесь» — бесполезно.'],
        ['a', 'Our textbook also says: don\'t use tables for layout.', 'В нашем учебнике тоже сказано: не используйте таблицы для вёрстки.'],
        ['b', 'Exactly. When a table is used for design, the reading order gets mixed up, and the information turns into nonsense. Use CSS for layout and keep tables for tabular information.', 'Именно. Когда таблица используется для оформления, порядок чтения путается и информация превращается в бессмыслицу. Используйте CSS для вёрстки, а таблицы оставьте для табличных данных.'],
        ['a', 'What about semantic markup?', 'А семантическая разметка?'],
        ['b', 'It\'s my best friend. When a page has real headings, lists and a navigation element, I can jump straight to the part I need. Without them, I have to listen to the whole page.', 'Это мой лучший друг. Когда на странице есть настоящие заголовки, списки и элемент навигации, я могу сразу перейти к нужной части. Без них приходится слушать всю страницу.'],
        ['a', 'Is accessibility only for people with disabilities?', 'Доступность нужна только людям с инвалидностью?'],
        ['b', 'Not at all. Captions help people in a noisy metro, good contrast helps on a sunny day, and a clear structure helps everyone, including search engines. Accessible sites are simply better sites.', 'Вовсе нет. Субтитры помогают в шумном метро, хороший контраст — в солнечный день, а понятная структура помогает всем, включая поисковые системы. Доступные сайты — просто лучшие сайты.'],
        ['a', 'Thank you, Tom. Listeners, check your projects today: add alt text and fix those «click here» links!', 'Спасибо, Том. Слушатели, проверьте свои проекты сегодня: добавьте alt-текст и исправьте ссылки «нажмите здесь»!']
      ],
      quiz: [
        { q: 'What does a screen reader do?', o: ['Reads the page aloud line by line', 'Makes the text bigger', 'Translates the page', 'Blocks advertisements'] },
        { q: 'Which link text does Tom call useless?', o: ['Click here', 'Download the timetable', 'Contact us', 'Price list (PDF)'] },
        { q: 'Who benefits from accessible sites, according to Tom?', o: ['Everyone', 'Only blind users', 'Only developers', 'Only search engines'] }
      ]
    },
    {
      id: 'p4', n: 4, title: 'Plan First, Code Later', ru: 'Сначала план, потом код',
      desc: 'Макс делает сайт для фитнес-клуба и проходит все шаги планирования: цель, аудитория, контент, совместимость.',
      cover: 'linear-gradient(135deg, #ec4899, #8b5cf6)', icon: 'target', level: 'B1',
      speakers: { a: KATE, b: MAX },
      words: ['purpose', 'target-audience', 'content', 'focus-group', 'compatibility', 'hyperlink'],
      lines: [
        ['a', 'Welcome to DevSpeak! Last time, Max told us that he started coding too early. Today he\'s back to talk about planning. Hi, Max!', 'Добро пожаловать в DevSpeak! В прошлый раз Макс рассказал, что начал писать код слишком рано. Сегодня он снова с нами, чтобы поговорить о планировании. Привет, Макс!'],
        ['b', 'Hi, Kate! Yes, I\'ve learned my lesson.', 'Привет, Кейт! Да, я усвоил урок.'],
        ['a', 'Your new client is a small fitness club, right? Where did you start this time?', 'Твой новый клиент — небольшой фитнес-клуб, верно? С чего ты начал на этот раз?'],
        ['b', 'With the purpose. I asked the owner: what should the website accomplish? She said she wanted more people to sign up for trial workouts. So that became our main goal.', 'С цели. Я спросил владелицу: чего должен добиться сайт? Она сказала, что хочет, чтобы больше людей записывалось на пробные тренировки. Это и стало нашей главной целью.'],
        ['a', 'Did you set measurable objectives?', 'Ты поставил измеримые задачи?'],
        ['b', 'Yes. Fifty new sign-ups a month through the site. That\'s a number we can track, so we\'ll know if the site is successful.', 'Да. Пятьдесят новых записей в месяц через сайт. Это число можно отслеживать, так что мы поймём, успешен ли сайт.'],
        ['a', 'Nice. What about the audience?', 'Отлично. А что с аудиторией?'],
        ['b', 'We made a list of audience characteristics. Most visitors are between twenty and forty, they use smartphones, and they want three things: prices, the timetable and the address.', 'Мы составили список характеристик аудитории. Большинству посетителей от двадцати до сорока лет, они пользуются смартфонами и хотят знать три вещи: цены, расписание и адрес.'],
        ['a', 'So you know their information preferences.', 'То есть ты знаешь их информационные предпочтения.'],
        ['b', 'Exactly. And their computer specifications: mostly phones, so the site must be mobile-first.', 'Именно. И их технику: в основном телефоны, поэтому сайт должен проектироваться в первую очередь под мобильные.'],
        ['a', 'How did you organise the content?', 'Как ты организовал контент?'],
        ['b', 'The owner gave me a lot of material: the history of the club, awards, fifty photos. We removed everything that didn\'t support the purpose. Then we grouped the rest into five categories: Prices, Timetable, Trainers, Trial Workout and Contacts. Those names became the menu links.', 'Владелица дала мне много материала: историю клуба, награды, пятьдесят фотографий. Мы убрали всё, что не поддерживало цель. Остальное сгруппировали в пять категорий: «Цены», «Расписание», «Тренеры», «Пробная тренировка» и «Контакты». Эти названия стали ссылками в меню.'],
        ['a', 'Did you test it?', 'Ты это тестировал?'],
        ['b', 'We showed the prototype to a small focus group: five club members. They found the sign-up button in seconds. And, of course, I tested the site in different browsers and on different phones.', 'Мы показали прототип небольшой фокус-группе — пятерым членам клуба. Они нашли кнопку записи за секунды. И, конечно, я протестировал сайт в разных браузерах и на разных телефонах.'],
        ['a', 'Plan first, code later. Thanks, Max! See you next week on DevSpeak.', 'Сначала план, потом код. Спасибо, Макс! Увидимся на следующей неделе в DevSpeak.']
      ],
      quiz: [
        { q: 'What was the main goal of the fitness club website?', o: ['More sign-ups for trial workouts', 'Selling sports clothes', 'Showing fifty photos', 'Winning a design award'] },
        { q: 'Which devices do most visitors use?', o: ['Smartphones', 'Tablets', 'Desktop PCs', 'Smart TVs'] },
        { q: 'How many people were in the focus group?', o: ['Five', 'Fifty', 'Twenty', 'Forty'] }
      ]
    },
    {
      id: 'p5', n: 5, title: 'The Great Debates of Web Design', ru: 'Великие споры веб-дизайна',
      desc: 'Резиновая вёрстка, Flash, таблицы и «форма или функция» — всё то, о чём текст «Issues», в живом разговоре.',
      cover: 'linear-gradient(135deg, #f43f5e, #f59e0b)', icon: 'flame', level: 'B1–B2',
      speakers: { a: KATE, b: ALEX },
      words: ['proponent', 'relinquish', 'subside', 'crawler', 'ban', 'tabular-information', 'subvert', 'forgo', 'quirk', 'font', 'synergistic'],
      lines: [
        ['a', 'Welcome to a special episode of DevSpeak: the great debates of web design! Alex is back with us. Hi, Alex!', 'Добро пожаловать на специальный выпуск DevSpeak: великие споры веб-дизайна! Алекс снова с нами. Привет, Алекс!'],
        ['b', 'Hi, Kate! I\'m ready to argue.', 'Привет, Кейт! Я готов спорить.'],
        ['a', 'Let\'s start with liquid versus fixed layouts. Which side were you on?', 'Начнём с «резиновой» и фиксированной вёрстки. На чьей ты был стороне?'],
        ['b', 'Years ago, I was a proponent of fixed layouts. I wanted full control. With a liquid layout, you relinquish some of that control: the page stretches, and the lines can get too long to read.', 'Много лет назад я был сторонником фиксированной вёрстки. Мне нужен был полный контроль. С резиновым макетом ты отказываешься от части контроля: страница растягивается, и строки могут стать слишком длинными для чтения.'],
        ['a', 'And now?', 'А сейчас?'],
        ['b', 'The debate has mostly subsided. We use responsive design: the layout is flexible, but it has a maximum width. In a way, both sides won.', 'Спор в основном утих. Мы используем адаптивный дизайн: макет гибкий, но у него есть максимальная ширина. В каком-то смысле победили обе стороны.'],
        ['a', 'Next: Flash. You worked with it, didn\'t you?', 'Дальше — Flash. Ты ведь с ним работал?'],
        ['b', 'I did. Flash sites looked amazing, but they had serious problems. Search engine crawlers couldn\'t read the text inside, so nobody could find the sites. Users needed a plug-in, and it had security holes. Many companies banned it.', 'Работал. Flash-сайты выглядели потрясающе, но у них были серьёзные проблемы. Поисковые роботы не могли прочитать текст внутри, поэтому такие сайты никто не находил. Пользователям нужен был плагин, а в нём были дыры в безопасности. Многие компании его запретили.'],
        ['a', 'What about tables versus CSS?', 'А таблицы против CSS?'],
        ['b', 'Tables are perfect for tabular information, like a timetable. But using them for layout subverts the whole idea of HTML. Now we forgo table layouts and use divs, Flexbox and Grid.', 'Таблицы идеальны для табличных данных, например расписания. Но их использование для вёрстки подрывает саму идею HTML. Теперь мы отказываемся от табличной вёрстки и используем div-блоки, Flexbox и Grid.'],
        ['a', 'Were there any quirks?', 'Были какие-то причуды?'],
        ['b', 'Oh, every browser had its own quirks! Internet Explorer was famous for them. We had to write special hacks just for it.', 'О, у каждого браузера были свои причуды! Internet Explorer ими славился. Нам приходилось писать специальные хаки только для него.'],
        ['a', 'Last one: form or function?', 'Последний вопрос: форма или функция?'],
        ['b', 'Both! Beautiful fonts and colours mean nothing if the page is slow. But a fast page that looks terrible won\'t keep visitors either. The best designs are synergistic: form and function make each other stronger.', 'И то и другое! Красивые шрифты и цвета ничего не значат, если страница медленная. Но и быстрая страница, которая выглядит ужасно, не удержит посетителей. Лучшие дизайны синергичны: форма и функция усиливают друг друга.'],
        ['a', 'Great ending. Thanks, Alex, and thank you all for listening!', 'Отличный финал. Спасибо, Алекс, и спасибо всем, кто слушал!']
      ],
      quiz: [
        { q: 'Why did Alex like fixed layouts years ago?', o: ['He wanted full control', 'They were cheaper', 'Clients hated liquid layouts', 'They loaded faster'] },
        { q: 'What ended the liquid vs fixed debate?', o: ['Responsive design', 'Flash', 'Table layouts', 'Splash pages'] },
        { q: 'What problem did Flash have with search engines?', o: ['Crawlers couldn\'t read the text inside', 'It was too popular', 'It used too many tables', 'It had no animations'] }
      ]
    }
  ];

  /* ---------- Video lessons ----------
     Each scene: type + visual data + say[] (English narration chunks) + sub[] (Russian subtitles).
     Elements with at:n appear when narration chunk n starts. */
  DS.videos = [
    {
      id: 'v1', n: 1, title: 'How a Web Page Reaches You', ru: 'Как веб-страница попадает к вам',
      desc: 'Запрос и ответ, статические и динамические страницы, серверные и клиентские сценарии.',
      thumb: 'linear-gradient(135deg, #6366f1, #06b6d4)', icon: 'globe',
      words: ['static-page', 'dynamic-page', 'response', 'server-side-scripting', 'client-side'],
      scenes: [
        { type: 'title', kicker: 'Video 1 · Unit 18', title: 'How a Web Page Reaches You', subtitle: 'Static and dynamic pages', icon: 'globe',
          say: ['Hello! In this video, you will learn how a web page travels from a server to your screen.', 'And you will see the difference between static and dynamic pages.'],
          sub: ['Привет! В этом видео вы узнаете, как веб-страница попадает с сервера на ваш экран.', 'И увидите разницу между статическими и динамическими страницами.'] },
        { type: 'flow', title: 'A static page', url: 'college.ru/about.html', items: [{ icon: 'file', text: 'about.html', at: 1 }], resAt: 1, note: 'The same page for every visitor', noteAt: 2,
          say: ['When you type a URL, your browser sends a request to a web server.', 'For a static page, the server simply finds a ready HTML file and sends it back as a response.', 'Every visitor gets exactly the same page, until a web master edits the file by hand.'],
          sub: ['Когда вы вводите URL, браузер отправляет запрос на веб-сервер.', 'Для статической страницы сервер просто находит готовый HTML-файл и отправляет его обратно в качестве ответа.', 'Каждый посетитель получает одну и ту же страницу, пока веб-мастер не отредактирует файл вручную.'] },
        { type: 'flow', title: 'A dynamic page', url: 'shop.ru/cart', items: [{ icon: 'code', text: 'PHP script', at: 1 }, { icon: 'database', text: 'database', at: 1 }, { icon: 'file', text: 'HTML for you', at: 2 }], resAt: 2, note: 'Built fresh for every request', noteAt: 2,
          say: ['A dynamic page works differently.', 'The server runs a script, for example in PHP or Python, and takes fresh data from a database.', 'Then it builds the HTML especially for this request. So the page can be different for every user, every time.'],
          sub: ['Динамическая страница работает иначе.', 'Сервер запускает скрипт, например на PHP или Python, и берёт свежие данные из базы данных.', 'Затем он собирает HTML специально для этого запроса. Поэтому страница может быть разной для каждого пользователя и каждый раз.'] },
        { type: 'code', title: 'Server-side scripting', file: 'hello.php',
          lines: [['<?php', 0], ['  $name = $_GET[\'name\'] ?? \'student\';', 0], ['  $hour = date(\'H\');', 0], ['?>', 0], ['<h1>Hello, <?= $name ?>!</h1>', 1, true], ['<p>It is <?= $hour ?> o\'clock now.</p>', 1, true]],
          caption: 'The browser receives only the finished HTML', captionAt: 1,
          say: ['Here is a tiny example of server-side scripting in PHP.', 'The server runs this code and greets the user by name. The browser receives only the finished HTML.'],
          sub: ['Вот маленький пример серверного сценария на PHP.', 'Сервер выполняет этот код и приветствует пользователя по имени. Браузер получает только готовый HTML.'] },
        { type: 'code', title: 'Client-side scripting', file: 'like.js',
          lines: [['const btn = document.querySelector(\'#like\');', 0], ['btn.addEventListener(\'click\', () => {', 0], ['  btn.textContent = \'Liked!\';', 1, true], ['  btn.classList.add(\'active\');', 1, true], ['});', 0]],
          caption: 'JavaScript changes the DOM without reloading the page', captionAt: 1,
          say: ['Content can also change on the client side, right in the browser.', 'This JavaScript changes elements of the DOM, the Document Object Model, without reloading the page.'],
          sub: ['Контент может меняться и на стороне клиента — прямо в браузере.', 'Этот JavaScript изменяет элементы DOM — объектной модели документа — без перезагрузки страницы.'] },
        { type: 'compare', title: 'Static vs Dynamic',
          left: { title: 'Static', icon: 'file', at: 1, items: ['Same content for everyone', 'Updated by hand', 'HTML and CSS files', 'Fast, simple and cheap'] },
          right: { title: 'Dynamic', icon: 'gear', at: 2, items: ['Adapts to the user', 'Updates automatically', 'PHP, Python, JavaScript', 'Uses a database'] },
          banner: 'Real projects combine both', bannerAt: 3,
          say: ['Let\'s compare.', 'Static pages are fast, simple and cheap, but they are updated by hand.', 'Dynamic pages adapt to the user and to the data, but they need programming and a server.', 'Most real web applications combine both approaches.'],
          sub: ['Давайте сравним.', 'Статические страницы быстрые, простые и дешёвые, но обновляются вручную.', 'Динамические страницы подстраиваются под пользователя и данные, но требуют программирования и сервера.', 'Большинство реальных веб-приложений сочетают оба подхода.'] },
        { type: 'question', q: 'A weather site shows the forecast for YOUR city. Is this page static or dynamic?', options: ['Static', 'Dynamic'], answer: 1, markAt: 1,
          say: ['Quick question. A weather site shows the forecast for your city. Is this page static or dynamic?', 'It\'s dynamic! The content depends on your location, the time and the data from a weather database.'],
          sub: ['Быстрый вопрос. Сайт погоды показывает прогноз для вашего города. Эта страница статическая или динамическая?', 'Динамическая! Контент зависит от вашего местоположения, времени и данных из базы погоды.'] },
        { type: 'outro', title: 'Great job!', words: ['static page', 'dynamic page', 'request', 'response', 'server-side', 'client-side', 'DOM'],
          say: ['Great job! Remember the key words: static, dynamic, request, response, server-side and client-side. See you in the next video!'],
          sub: ['Отличная работа! Запомните ключевые слова: static, dynamic, request, response, server-side и client-side. До встречи в следующем видео!'] }
      ],
      quiz: [
        { q: 'What does the server send back for a static page?', o: ['A ready HTML file', 'A new PHP script', 'The whole database', 'A plug-in'] },
        { q: 'What does JavaScript change in the browser?', o: ['Elements of the DOM', 'The database', 'The server', 'The domain name'] },
        { q: 'Which page adapts to the user?', o: ['A dynamic page', 'A static page', 'A splash page', 'A dead tree edition'] }
      ]
    },
    {
      id: 'v2', n: 2, title: 'Front-end & Back-end', ru: 'Фронтенд и бэкенд',
      desc: 'Из чего состоит сайт, как работает форма входа и чем занимаются фронтенд- и бэкенд-разработчики.',
      thumb: 'linear-gradient(135deg, #8b5cf6, #ec4899)', icon: 'columns',
      words: ['front-end', 'back-end', 'user-interface', 'layout', 'collaborative', 'web-master'],
      scenes: [
        { type: 'title', kicker: 'Video 2 · Unit 18', title: 'Front-end & Back-end', subtitle: 'Who does what in a web project', icon: 'columns',
          say: ['Every web site is an information system.', 'Its parts are usually divided into the front end and the back end. Let\'s see what that means.'],
          sub: ['Каждый веб-сайт — это информационная система.', 'Его части обычно делят на фронтенд и бэкенд. Давайте разберёмся, что это значит.'] },
        { type: 'layers',
          top: { title: 'Front-end', sub: 'what users see and hear', icon: 'monitor', at: 0, items: ['Page layout', 'User interface', 'Graphics', 'Text', 'Audio'] },
          link: 'data ↓   ↑ response', linkAt: 2,
          bottom: { title: 'Back-end', sub: 'what works behind the scenes', icon: 'server', at: 1, items: ['Source code', 'Scripted functions', 'Server-side components', 'Database'] },
          say: ['The front end is everything the user can see and hear: the page layout, the user interface, graphics, text and audio.', 'The back end is invisible. It includes the source code, scripted functions and server-side components.', 'The two parts are connected: the back end processes the data that comes from the front end.'],
          sub: ['Фронтенд — это всё, что пользователь может увидеть и услышать: макет страницы, интерфейс, графика, текст и звук.', 'Бэкенд невидим. Он включает исходный код, скриптовые функции и серверные компоненты.', 'Две части связаны: бэкенд обрабатывает данные, которые приходят с фронтенда.'] },
        { type: 'steps', title: 'Example: a login form',
          steps: [{ icon: 'keyboard', title: 'Type', text: 'You enter your login and password', at: 1 }, { icon: 'monitor', title: 'Send', text: 'The front end sends the form', at: 1 }, { icon: 'database', title: 'Check', text: 'The back end checks the database', at: 2 }, { icon: 'checkCircle', title: 'Response', text: '«Welcome back!»', at: 3 }],
          say: ['For example, imagine a login form.', 'You type your login and password, and the front end sends the form when you press the button.', 'The back end checks your password in the database.', 'Then it sends a response, and the front end shows the result: welcome back!'],
          sub: ['Например, представьте форму входа.', 'Вы вводите логин и пароль, и фронтенд отправляет форму, когда вы нажимаете кнопку.', 'Бэкенд проверяет ваш пароль в базе данных.', 'Затем он отправляет ответ, а фронтенд показывает результат: с возвращением!'] },
        { type: 'compare', title: 'Two professions',
          left: { title: 'Front-end developer', icon: 'palette', at: 0, items: ['HTML, CSS, JavaScript', 'React, Vue', 'A good eye for design', 'Browser compatibility'] },
          right: { title: 'Back-end developer', icon: 'server', at: 1, items: ['PHP, Python, Java, Go', 'SQL and databases', 'Logic and algorithms', 'Security'] },
          say: ['Front-end developers work with HTML, CSS and JavaScript. They need a good eye for design and patience with browser compatibility.', 'Back-end developers work with languages like PHP, Python or Java, and with databases. They love logic and security.'],
          sub: ['Фронтенд-разработчики работают с HTML, CSS и JavaScript. Им нужны чувство дизайна и терпение к совместимости браузеров.', 'Бэкенд-разработчики работают с языками вроде PHP, Python или Java и с базами данных. Они любят логику и безопасность.'] },
        { type: 'bullets', title: 'Who builds the site?',
          items: [{ icon: 'users', text: 'Small project → one multi-skilled web master', at: 1 }, { icon: 'layout', text: 'Big project → a team of specialists', at: 2 }, { icon: 'target', text: 'Project manager → collaborative design', at: 2 }, { icon: 'code', text: 'Full-stack developer → front end + back end', at: 3 }],
          say: ['So who builds a website?', 'In a small project, one multi-skilled person, often called a web master, can do everything.', 'In a big project, a project manager organises collaborative work between specialists.', 'And a developer who works on both sides is called full-stack.'],
          sub: ['Так кто же создаёт сайт?', 'В небольшом проекте всё может сделать один разносторонний специалист, которого часто называют веб-мастером.', 'В большом проекте менеджер проекта организует совместную работу специалистов.', 'А разработчика, который работает с обеими сторонами, называют full-stack.'] },
        { type: 'question', q: 'Where is your password checked?', options: ['On the front end', 'On the back end'], answer: 1, markAt: 1,
          say: ['Quick question: where is your password checked, on the front end or on the back end?', 'On the back end, of course! Security checks must happen on the server.'],
          sub: ['Быстрый вопрос: где проверяется ваш пароль — на фронтенде или на бэкенде?', 'На бэкенде, конечно! Проверки безопасности должны выполняться на сервере.'] },
        { type: 'outro', title: 'Well done!', words: ['front end', 'back end', 'user interface', 'layout', 'server-side', 'collaborative', 'web master', 'full-stack'],
          say: ['Well done! Now you know who does what in a web project. Practise these words in the games section!'],
          sub: ['Молодцы! Теперь вы знаете, кто чем занимается в веб-проекте. Потренируйте эти слова в разделе игр!'] }
      ],
      quiz: [
        { q: 'Which of these is part of the front end?', o: ['The user interface', 'Server-side components', 'The database', 'Source code efficiency'] },
        { q: 'What do we call a developer who works on both sides?', o: ['Full-stack', 'Crawler', 'Proponent', 'Screen reader'] },
        { q: 'Where must security checks happen?', o: ['On the server (back end)', 'In the CSS file', 'On the splash page', 'In the font'] }
      ]
    },
    {
      id: 'v3', n: 3, title: 'Accessible Web Design: 7 Rules', ru: 'Доступный веб-дизайн: 7 правил',
      desc: 'Семантическая разметка, alt-текст, понятные ссылки, CSS вместо таблиц — и почему это важно для всех.',
      thumb: 'linear-gradient(135deg, #10b981, #06b6d4)', icon: 'access',
      words: ['accessibility', 'semantic-markup', 'text-equivalent', 'screen-reader', 'layout'],
      scenes: [
        { type: 'title', kicker: 'Video 3 · Unit 18', title: 'Accessible Web Design', subtitle: '7 rules for websites everyone can use', icon: 'access',
          say: ['Accessibility means that everyone, including people with disabilities, can use your website.', 'Here are seven simple rules.'],
          sub: ['Доступность означает, что вашим сайтом могут пользоваться все, включая людей с ограниченными возможностями.', 'Вот семь простых правил.'] },
        { type: 'bullets', title: 'Rules 1–4',
          items: [{ n: 1, text: 'Use semantic markup', at: 0 }, { n: 2, text: 'Write valid markup (DTD or Schema)', at: 1 }, { n: 3, text: 'Add text equivalents (alt text)', at: 2 }, { n: 4, text: 'Write links that make sense out of context', at: 3 }],
          say: ['Rule one: use semantic markup, with real headings, lists and navigation.', 'Rule two: write valid markup that follows a published standard.', 'Rule three: give every image and video a text equivalent.', 'Rule four: write links that make sense out of context.'],
          sub: ['Правило первое: используйте семантическую разметку — настоящие заголовки, списки и навигацию.', 'Правило второе: пишите корректную разметку по опубликованному стандарту.', 'Правило третье: давайте каждому изображению и видео текстовый эквивалент.', 'Правило четвёртое: пишите ссылки, понятные вне контекста.'] },
        { type: 'code', title: 'Bad and good markup', file: 'index.html',
          lines: [['<!-- Bad -->', 0], ['<img src="img_4000.jpg">', 0], ['<a href="plan.pdf">Click here</a>', 0], ['', 0], ['<!-- Good -->', 2], ['<img src="team.jpg" alt="Our team at the office">', 2, true], ['<a href="plan.pdf">Download the study plan (PDF)</a>', 2, true]],
          say: ['Look at this example.', 'A screen reader cannot understand an image without alt text, and «click here» tells the user nothing.', 'The good version describes the image and says exactly where the link goes.'],
          sub: ['Посмотрите на этот пример.', 'Программа экранного доступа не поймёт изображение без alt-текста, а «нажмите здесь» ничего не говорит пользователю.', 'Хороший вариант описывает изображение и точно говорит, куда ведёт ссылка.'] },
        { type: 'bullets', title: 'Rules 5–7',
          items: [{ n: 5, text: 'Don\'t use frames', at: 0 }, { n: 6, text: 'Use CSS, not tables, for layout', at: 1 }, { n: 7, text: 'Keep the page clear when read line by line', at: 2 }],
          say: ['Rule five: don\'t use frames.', 'Rule six: use CSS rather than HTML tables for layout.', 'Rule seven: make sure the page still makes sense when a screen reader reads it line by line.'],
          sub: ['Правило пятое: не используйте фреймы.', 'Правило шестое: для вёрстки используйте CSS, а не HTML-таблицы.', 'Правило седьмое: убедитесь, что страница остаётся понятной, когда программа экранного доступа читает её строка за строкой.'] },
        { type: 'term', word: 'screen reader', ipa: '/ˈskriːn ˌriːdə/', ru: 'программа экранного доступа', example: 'A screen reader reads the content of the screen aloud.', exampleAt: 1,
          say: ['Key term: screen reader.', 'It is a program that reads the content of the screen aloud for blind and visually impaired users.'],
          sub: ['Ключевой термин: screen reader.', 'Это программа, которая читает содержимое экрана вслух для незрячих и слабовидящих пользователей.'] },
        { type: 'bullets', title: 'Accessibility helps everyone',
          items: [{ icon: 'access', text: 'People with disabilities', at: 0 }, { icon: 'phone', text: 'Captions in a noisy metro', at: 1 }, { icon: 'sun', text: 'Good contrast on a sunny day', at: 1 }, { icon: 'search', text: 'Clear structure for search engines', at: 1 }],
          say: ['And remember: accessibility helps everyone, not only people with disabilities.', 'Captions help in a noisy metro, good contrast helps in the sun, and a clear structure helps search engines too.'],
          sub: ['И помните: доступность помогает всем, а не только людям с ограниченными возможностями.', 'Субтитры помогают в шумном метро, хороший контраст — на солнце, а понятная структура помогает и поисковым системам.'] },
        { type: 'question', q: 'Which link text is better?', options: ['Click here', 'Download the timetable'], answer: 1, markAt: 1,
          say: ['Quick check. Which link text is better?', 'The second one! It makes sense even out of context.'],
          sub: ['Быстрая проверка. Какой текст ссылки лучше?', 'Второй! Он понятен даже вне контекста.'] },
        { type: 'outro', title: 'That\'s it!', words: ['accessibility', 'semantic markup', 'text equivalent', 'alt', 'screen reader', 'layout', 'frames'],
          say: ['That\'s it: seven rules for accessible design. Check your own project today!'],
          sub: ['Вот и всё: семь правил доступного дизайна. Проверьте свой проект уже сегодня!'] }
      ],
      quiz: [
        { q: 'What should every image have?', o: ['A text equivalent (alt text)', 'A plug-in', 'A frame', 'A table'] },
        { q: 'Which rule is correct?', o: ['Don\'t use frames', 'Use tables for layout', 'Write «Click here» links', 'Avoid headings'] },
        { q: 'Who benefits from accessibility?', o: ['Everyone', 'Only blind users', 'Only designers', 'Only search engines'] }
      ]
    },
    {
      id: 'v4', n: 4, title: 'Planning a Website in 4 Steps', ru: 'Планирование сайта за 4 шага',
      desc: 'Цель, аудитория, контент и совместимость — план, без которого не стоит начинать писать код.',
      thumb: 'linear-gradient(135deg, #f59e0b, #f43f5e)', icon: 'target',
      words: ['purpose', 'target-audience', 'content', 'focus-group', 'compatibility', 'restriction'],
      scenes: [
        { type: 'title', kicker: 'Video 4 · Unit 18', title: 'Planning a Website', subtitle: 'Purpose · Audience · Content · Compatibility', icon: 'target',
          say: ['Before you write a single line of code, you need a plan.', 'Let\'s go through the four steps of website planning.'],
          sub: ['Прежде чем написать хоть одну строку кода, нужен план.', 'Давайте пройдём четыре шага планирования сайта.'] },
        { type: 'steps', title: 'Four steps',
          steps: [{ icon: 'target', title: 'Purpose', text: 'Why?', at: 0 }, { icon: 'users', title: 'Audience', text: 'Who?', at: 0 }, { icon: 'list', title: 'Content', text: 'What?', at: 0 }, { icon: 'monitor', title: 'Compatibility', text: 'Where?', at: 0 }],
          say: ['There are four steps: purpose, audience, content, and compatibility. Let\'s look at each of them.'],
          sub: ['Есть четыре шага: цель, аудитория, контент и совместимость. Рассмотрим каждый из них.'] },
        { type: 'bullets', title: '1 · Purpose',
          items: [{ icon: 'target', text: 'What will the site accomplish?', at: 0 }, { icon: 'users', text: 'What will users get from it?', at: 0 }, { icon: 'rocket', text: 'Short-term and long-term goals', at: 1 }, { icon: 'checkCircle', text: 'Measurable objectives', at: 1 }],
          say: ['Step one is the purpose. A purpose statement shows what the site will accomplish and what users will get from it.', 'Set short-term and long-term goals, and measurable objectives, so you can track the site\'s success.'],
          sub: ['Шаг первый — цель. Формулировка цели показывает, чего добьётся сайт и что получат от него пользователи.', 'Поставьте краткосрочные и долгосрочные цели и измеримые задачи, чтобы отслеживать успех сайта.'] },
        { type: 'bullets', title: '2 · Audience',
          items: [{ icon: 'users', text: 'Audience characteristics', at: 1 }, { icon: 'info', text: 'Information preferences', at: 1 }, { icon: 'monitor', text: 'Computer specifications', at: 1 }, { icon: 'globe', text: 'Web experience', at: 1 }],
          say: ['Step two is the audience: the people who will visit your site.', 'Think about their characteristics, information preferences, computer specifications and web experience.'],
          sub: ['Шаг второй — аудитория: люди, которые будут посещать ваш сайт.', 'Подумайте об их характеристиках, информационных предпочтениях, технике и опыте работы в интернете.'] },
        { type: 'bullets', title: '3 · Content',
          items: [{ icon: 'folder', text: 'Collect all the content', at: 0 }, { icon: 'x', text: 'Remove what doesn\'t support the purpose', at: 0 }, { icon: 'users', text: 'Test it on a focus group', at: 1 }, { icon: 'list', text: 'Categories → menu links', at: 1 }],
          say: ['Step three is content. Collect everything you need, and remove anything that doesn\'t support the purpose.', 'Test it on a focus group, then group it into categories. The category names become your menu links.'],
          sub: ['Шаг третий — контент. Соберите всё необходимое и уберите всё, что не поддерживает цель.', 'Проверьте его на фокус-группе, затем разбейте на категории. Названия категорий станут ссылками меню.'] },
        { type: 'bullets', title: '4 · Compatibility',
          items: [{ icon: 'globe', text: 'Different browsers', at: 0 }, { icon: 'phone', text: 'Different screens and devices', at: 0 }, { icon: 'image', text: 'Image formats', at: 0 }, { icon: 'checkCircle', text: 'Test on every platform', at: 1 }],
          say: ['Step four: compatibility and restrictions. Your visitors use different browsers, screens and devices.', 'Many problems go unnoticed, so the only way to be sure is to test your site on each platform.'],
          sub: ['Шаг четвёртый — совместимость и ограничения. Посетители используют разные браузеры, экраны и устройства.', 'Многие проблемы остаются незамеченными, поэтому единственный способ убедиться — протестировать сайт на каждой платформе.'] },
        { type: 'question', q: 'A client says: «The website must bring us more sales». Which planning step is this?', options: ['Purpose', 'Audience', 'Content', 'Compatibility'], answer: 0, markAt: 1,
          say: ['Quick question. A client says: the website must bring us more sales. Which planning step is this?', 'It\'s the purpose! It describes what the website should accomplish.'],
          sub: ['Быстрый вопрос. Клиент говорит: сайт должен приносить нам больше продаж. Какой это шаг планирования?', 'Это цель! Она описывает, чего должен добиться сайт.'] },
        { type: 'outro', title: 'Plan first, code later!', words: ['purpose', 'target audience', 'content', 'focus group', 'compatibility', 'restriction'],
          say: ['Plan first, code later. Good luck with your projects!'],
          sub: ['Сначала план, потом код. Удачи в ваших проектах!'] }
      ],
      quiz: [
        { q: 'How many planning steps are there in the video?', o: ['Four', 'Two', 'Seven', 'Ten'] },
        { q: 'What do category names become?', o: ['Menu links', 'Fonts', 'Plug-ins', 'Passwords'] },
        { q: 'What is the only way to be sure the site works on a platform?', o: ['Test it on that platform', 'Ask the client', 'Use Flash', 'Buy a new server'] }
      ]
    }
  ];
})();
