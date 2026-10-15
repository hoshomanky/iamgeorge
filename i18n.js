(() => {
  'use strict';
  const dictionary = {
    wallTitle: ['洋芋的每一天。', 'Every day of George’s life.'], wallDays: ['{count} 个日子', '{count} days'],
    wallDate: ['选一个日子', 'Choose a date'], wallYear: ['找到某一年', 'Find a year'], wallHint: ['点选圆点，看看这一天。也可以直接选择日期。', 'Select a dot to explore a day, or choose a date.'],
    wallKeyboard: ['用左右键选择前后一天，上下键选择相邻行，Enter 打开日期卡。', 'Use arrow keys to move between days and Enter to open the day preview.'],
    wallLabel: ['{count} 个日期圆点，从左到右、从上到下按时间排列。灰色表示尚无公开内容，彩色表示已有公开内容，颜色对应四季月份。', '{count} daily dots in chronological order, from left to right and top to bottom. Gray dots have no published memories; colored dots have published memories, with colors representing the seasons.'],
    wallWinter: ['12–2 月 · 淡蓝', 'Dec–Feb · Blue'], wallSpring: ['3–5 月 · 嫩绿', 'Mar–May · Green'], wallSummer: ['6–8 月 · 暖黄', 'Jun–Aug · Yellow'], wallAutumn: ['9–11 月 · 珊瑚', 'Sep–Nov · Coral'],
    wallEmpty: ['等待补充 · 灰色', 'Awaiting memories · Gray'], wallPublished: ['灰色日子等待补充，有公开内容的日子按四季着色', 'Gray days await memories; days with published memories take on seasonal colors'], wallPickTitle: ['轻点一个日子', 'Select a day'], wallPickText: ['故事、照片，都可以从这一天慢慢翻开。', 'Open a day to discover its stories and photographs.'],
    dayPreview: ['这一天', 'This day'], closeDayPreview: ['收起日期卡', 'Close day preview'], openThisDay: ['打开这一天 →', 'Open this day →'], moreDayPhotos: ['再看 {count} 张照片', 'View {count} more photos'],
    dayStoryCount: ['{count} 篇故事', '{count} {noun}'], dayPhotoCount: ['{count} 张照片', '{count} {noun}'], dayArtCount: ['{count} 件作品', '{count} {noun}'], dayAudioCount: ['{count} 段声音', '{count} {noun}'], dayVideoCount: ['{count} 段视频', '{count} {noun}'],
    viewPhoto: ['放大查看：{title}', 'View larger: {title}'], photoViewer: ['照片与作品', 'Photos and artwork'], closePhoto: ['关闭大图', 'Close image'], previousPhoto: ['上一张', 'Previous image'], nextPhoto: ['下一张', 'Next image'], photoPosition: ['第 {current} / {total} 张', '{current} of {total}'], originalPhoto: ['打开完整图片', 'Open full-size image'], photoUnavailable: ['图片暂时未能显示，可以打开完整图片查看。', 'The image could not be displayed. You can open the full-size image.'],
    backToDay: ['← 回到这一天', '← Back to this day'],
    skip: ['跳到正文', 'Skip to content'], brandHome: ['IAMGEORGE 首页', 'IAMGEORGE home'], brandSubtitle: ['洋芋的小小世界', 'George’s little world'],
    mainNav: ['主要导航', 'Main navigation'], languageGroup: ['阅读语言', 'Reading language'],
    navWorld: ['他的世界', 'His world'], navStories: ['小小故事册', 'Little stories'], navCreations: ['小小画廊', 'Little gallery'], navMemories: ['留住的时光', 'Moments to keep'], navLetters: ['写给洋芋', 'Letters to George'], navAbout: ['关于 IAMGEORGE', 'About IAMGEORGE'],
    paperToggle: ['换个纸色', 'Paper color'], paperChangeTitle: ['换一种纸色', 'Choose a paper color'], paperTitle: ['今天用哪张纸？', 'Which paper today?'], paperGroup: ['页面纸色', 'Page paper color'], paperCream: ['奶油白', 'Cream'], paperBlue: ['浅浅蓝', 'Pale blue'], paperPink: ['淡淡粉', 'Soft pink'], paperGreen: ['嫩嫩绿', 'Light green'],
    backTop: ['回到顶部', 'Back to top'], footerStory: ['他的故事，我们慢慢讲。', 'We’ll tell his story, a little at a time.'], footerDecoration: ['彩色小图形为网站装饰。', 'The colorful shapes are website decorations.'],
    aboutTitle: ['关于 IAMGEORGE · I AM GEORGE', 'About IAMGEORGE · I AM GEORGE'], aboutDescription: ['爸爸和家人为洋芋建立的小小数字世界。关于这个网站，以及我们如何保存他的故事。', 'A little digital world made for George by his dad and family. About this website and how we preserve his story.'], backWorld: ['← 回到洋芋的世界', '← Back to George’s world'],
    homeTitle: ['I AM GEORGE · 洋芋的小小世界', 'I AM GEORGE · George’s little world'], homeDescription: ['欢迎来到洋芋的小小世界。通过真实的生活故事和作品，慢慢认识 George Fang，方智灏。', 'Welcome to George’s little world. Get to know George Fang, 方智灏, through his real stories and creations.'],
    welcome: ['欢迎来到<br>洋芋的小小世界<span class="coral">。</span>', 'Welcome to<br>George’s little world<span class="coral">.</span>'], heroDescription: ['这里有五彩缤纷的颜色，<br>也有值得慢慢讲的小故事。', 'A world full of color,<br>and little stories to tell in our own time.'], explore: ['一起逛逛', 'Come explore'], heroFootnote: ['从一个小片段开始，慢慢认识他。', 'Start with one little moment. Get to know him gradually.'],
    stickerBoard: ['可以轻点移动的彩色贴纸墙', 'A colorful sticker wall. Tap a sticker to move it.'], hisColors: ['洋芋的色彩', 'George’s colors'], littleShapes: ['小小的图形，好多好多颜色。', 'Little shapes. Lots and lots of color.'], shuffleLabel: ['重新摆放彩色贴纸', 'Rearrange the colorful stickers'], shuffle: ['重新摆一摆', 'Shuffle them'], stickerNote: ['轻点小贴纸，挪一挪。', 'Tap a little sticker to move it.'],
    worldTitle: ['从这里，走进他的世界<span class="green">。</span>', 'Step into his world<span class="green">.</span>'], worldDescription: ['一张画，一段时光，一封信。<br>我们一点一点添进来。', 'A drawing, a moment, a letter.<br>We’ll add them a little at a time.'], worldCard: ['从爸爸讲的小故事开始。', 'Begin with stories his dad remembers.'], artCard: ['留给他画过的小小世界。', 'A place for the little worlds he drew.'], memoryCard: ['照片、声音，还有那一天。', 'Photos, familiar sounds, and the day they came from.'], letterCard: ['想说的话，慢慢写下来。', 'Take your time writing what you want to say.'],
    pianoRoad: ['去上钢琴课的路上', 'On the way to piano class'], readStory: ['读这个小故事', 'Read this little story'], openStorybook: ['翻开整个故事册', 'Open the storybook'],
    galleryTitle: ['那些小小的画<span class="blue">。</span>', 'Those little drawings<span class="blue">.</span>'], galleryDescription: ['爸爸说，他的画风很稳，<br>画的东西很小。', 'His dad remembers his steady drawing style,<br>and the small things he drew.'], addGradually: ['慢慢添进来', 'Added in our own time'], artPlaceholder: ['把一幅小小的画，<br>好好放在这里。', 'A place to keep<br>one little drawing.'], artReady: ['等家人准备好了，就来分享他的原作。', 'His original drawings will be shared when his family is ready.'], artDetails: ['每一个小细节，<br>都值得被看见。', 'Every little detail<br>deserves to be seen.'], decorationNote: ['页面里的彩色小图形是网站装饰，洋芋的画作会单独展示。', 'The colorful shapes on this page are website decorations. George’s own drawings will be shown separately.'],
    memoriesTitle: ['留住一张照片，<br>也留住那一天<span class="yellow">。</span>', 'Keep a photograph.<br>Remember that day<span class="yellow">.</span>'], memoriesDescription: ['先看看照片，<br>再翻开背后的那一天。', 'Start with a photograph.<br>Then discover the day behind it.'], photoPlaceholder: ['给一张照片<br>留个位置', 'A place for<br>a photograph'], photoStory: ['那一天的故事，等你来讲。', 'The story of that day can be added in time.'], soundPlaceholder: ['留给一段熟悉的声音', 'A place for a familiar voice'],
    memoriesPageTitle: ['留住的时光 · I AM GEORGE', 'Moments to keep · I AM GEORGE'], memoriesPageDescription: ['翻看家人精选的照片与影像，从一个片段回到洋芋的那一天。', 'Browse photographs and moments selected by the family, and discover the days and stories behind them.'],
    memoriesPageHeading: ['留住的时光<span class="yellow">。</span>', 'Moments to keep<span class="yellow">.</span>'], memoriesIntro: ['从一张照片开始，慢慢翻看。想知道背后的故事，也可以回到那一天。', 'Start with a photograph and take your time. You can also visit the day behind it and read its story.'], memoriesSelection: ['挑出来的几个片段', 'A few moments to keep'], openMemories: ['翻开留住的时光', 'Browse moments to keep'], memoryBrowse: ['翻阅回忆', 'Ways to explore'], memoriesEndnote: ['照片背后的故事，我们慢慢讲。', 'We’ll tell the stories behind these photographs, a little at a time.'], memoriesEmpty: ['等家人选好，再把一些片段放在这里。', 'The family will add a few selected moments here when they are ready.'], memoryDayLink: ['看看这一天', 'See this day'], memoryStoryLink: ['读相关故事', 'Read the story'], storyMemoriesLink: ['想先看看照片？翻开留住的时光 →', 'Start with photographs in Moments to keep →'],
    lettersTitle: ['洋芋，<br>今天想跟你说<span class="coral">……</span>', 'George,<br>today I want to tell you<span class="coral">…</span>'], lettersDescription: ['短短几句话，也可以是一封信。<br>写好了，就留在自己身边。', 'A few words can be a letter, too.<br>When it’s ready, keep it with you.'], letterDear: ['亲爱的洋芋：', 'Dear George,'], letterPlaceholder: ['今天，我想跟你说……', 'Today, I want to tell you…'], letterPrivate: ['文字不会上传；下载后保存在你的设备上。', 'Your words stay here. The downloaded file is saved on your device.'], letterDownload: ['下载这封信', 'Download this letter'], letterRequired: ['先写下想对洋芋说的话。', 'First, write what you would like to say to George.'], letterDownloaded: ['已准备好文字文件，请在设备上确认下载。', 'Your text file is ready. Check the download on your device.'], letterFileTitle: ['写给洋芋', 'Letters to George'], letterFilename: ['写给洋芋', 'letter-to-george'],
    collectionTitle: ['小小故事册 · I AM GEORGE', 'Little stories · I AM GEORGE'], collectionDescription: ['按日期或主题，慢慢翻阅洋芋的故事与资料。', 'Browse George’s stories and memories by date or theme.'], storybookTitle: ['小小故事册<span class="coral">。</span>', 'Little stories<span class="coral">.</span>'], storybookIntro: ['每一天都有自己的位置。<br>故事也可以按主题慢慢翻。', 'A place for every day.<br>Stories to browse by theme, too.'], bookCover: ['一个片段，<br>也是一页。', 'One little moment.<br>One more page.'], allStories: ['所有故事', 'All stories'], findStory: ['找个小故事', 'Find a little story'], searchPlaceholder: ['一句话、一件小事……', 'A few words, a little moment…'], clear: ['清除', 'Clear'], readingOrder: ['阅读顺序', 'Reading order'], newest: ['最近添入', 'Recently added'], chronological: ['按故事时间', 'By story date'], byTheme: ['按主题翻翻', 'Browse by theme'], timeOrderNote: ['有日期的故事按时间排列，日期尚未注明的放在后面。', 'Dated stories appear in order. Stories whose dates are still unknown follow them.'], loadingBook: ['正在翻开故事册……', 'Opening the storybook…'], moreStories: ['再翻几页', 'Turn a few more pages'], noScriptBook: ['请启用浏览器的 JavaScript 来翻阅故事册。', 'Please enable JavaScript in your browser to browse the storybook.'], noScriptHome: ['也可以先回首页读这个小片段。', 'You can also read this little moment on the home page.'], bookEndnote: ['故事一点一点添进来，记得的日期也可以慢慢补上。', 'We’ll add stories little by little, and their dates as we remember them.'],
    browseModes: ['浏览故事册', 'Browse the storybook'], dayByDay: ['每一天', 'Day by day'], byThemeMode: ['按主题', 'By theme'], chooseDay: ['选一天，翻开看看。', 'Choose a day to open.'], everyDayHere: ['从 2019 年 10 月 31 日到 2025 年 11 月 23 日，每一天都在这里。', 'Every day from October 31, 2019 to November 23, 2025 has a place here.'], yearLabel: ['年份', 'Year'], monthLabel: ['月份', 'Month'], previousMonth: ['上个月', 'Previous month'], nextMonth: ['下个月', 'Next month'], datesThisMonth: ['当月日期', 'Dates this month'], hasPublicContents: ['小点表示当天已有公开内容', 'A dot marks a day with published memories'], loadingCalendar: ['正在铺开这些日子……', 'Laying out the days…'], calendarUnavailable: ['点墙暂时没能打开，请刷新页面再试。', 'The days could not be opened. Please refresh the page and try again.'], publicDay: ['已有公开资料', 'Published memories'], dayTitle: ['每一天 · I AM GEORGE', 'Day by day · I AM GEORGE'], dayDescription: ['翻开洋芋生命中的某一天，读当天已经公开的故事与资料。', 'Open a day in George’s life and explore the stories and memories shared for it.'], backCalendar: ['← 回到每一天', '← Back to day by day'], loadingDay: ['正在翻开这一天……', 'Opening this day…'], dayPlace: ['每一天都有自己的位置。', 'A place for every day.'], dayEmpty: ['这一天，等我们慢慢补充。', 'We will add to this day, little by little.'], dayEmptyNote: ['目前没有公开资料。', 'There are no published memories for this day yet.'], invalidDay: ['没有找到这一天，请从点墙选择。', 'This date is outside the available range. Please choose a day.'], dayUnavailable: ['这一天暂时没能打开，请检查网络后再试。', 'This day could not be opened. Check your connection and try again.'], continueDays: ['继续翻阅日子', 'Continue through the days'], previousDay: ['← 前一天', '← Previous day'], nextDay: ['后一天 →', 'Next day →'], copyDayLink: ['复制这一天的链接', 'Copy link to this day'], dayStory: ['小故事', 'Little story'], dayPhoto: ['照片', 'Photo'], dayArt: ['画作', 'Artwork'], dayAudio: ['声音', 'Audio'], dayVideo: ['视频', 'Video'], dayReadStory: ['读这个故事 →', 'Read this story →'], dayRelatedStory: ['相关故事', 'Related story'], entryCount: ['现在有 {count} 份内容', '{count} {noun} so far'], foundEntries: ['找到 {count} 份内容', '{count} {noun} found'],
    detailTitle: ['一个小故事 · I AM GEORGE', 'A little story · I AM GEORGE'], detailDescription: ['读一个关于洋芋的小故事，根据爸爸的真实讲述整理。', 'A little story about George, edited from his dad’s own account.'], backStorybook: ['← 回到小小故事册', '← Back to the storybook'], returnStorybook: ['回到小小故事册', 'Back to the storybook'], loadingStory: ['正在翻开这一页……', 'Opening this page…'], familyMoment: ['家人记得的一个小片段', 'A little moment his family remembers'], narratorMoment: ['{narrator}记得的一个小片段', 'A little moment remembered by {narrator}'], copyStoryLink: ['复制这个故事的链接', 'Copy this story’s link'], manualCopy: ['可以选中下面的链接，手动复制。', 'Select the link below to copy it manually.'], continueStories: ['继续读故事', 'Continue reading'], relatedTitle: ['还可以读读', 'More little stories'], retry: ['重新翻开', 'Try opening it again'], noScriptStory: ['请启用浏览器的 JavaScript 来阅读这一页。', 'Please enable JavaScript in your browser to read this page.'],
    seeThisDay: ['看看这一天 →', 'See this day →'],
    shareMemoryTitle: ['分享一段关于洋芋的回忆', 'Share a memory of Yang Yu'],
    shareMemoryDescription: ['如果你也记得洋芋的一个小故事，或有想对家人说的话，可以在这里留下。', 'If you remember a little story about Yang Yu, or have something you would like to say to his family, you can leave it here.'],
    shareMemoryOpen: ['打开分享表单', 'Open the sharing form'],
    shareMemoryNotice: ['将在新页面打开飞书表单。提交的内容不会自动公开到网站。', 'The Feishu form will open in a new tab. Your submission will not be published automatically on this website.'],
    shareMemoryFooter: ['分享一段回忆', 'Share a memory'],
    fullAvatarAlt: ['洋芋拿着红玫瑰、露齿笑着的卡通形象', 'A cartoon avatar of Yang Yu holding a red rose with a toothy smile'],
    fullAvatarCaption: ['卡通形象 · 背景经 AI 处理', 'Cartoon avatar · background edited with AI'],
    dateUnknown: ['故事发生日期尚未注明', 'Story date not yet recorded'], itemDateUnknown: ['具体日期尚未注明', 'Exact date not yet recorded'], foundStories: ['找到 {count} 个小故事', '{count} little {noun} found'], storyCount: ['现在有 {count} 个小故事', '{count} little {noun} so far'], allTheme: ['全部故事', 'All stories'], searchEmptyTitle: ['还没找到这个小故事', 'We haven’t found that little story'], searchEmptyText: ['试试换个词，或者回到全部故事慢慢翻。', 'Try another word, or take your time browsing all the stories.'], showAll: ['看看全部故事', 'See all stories'], emptyBookTitle: ['故事册等着添上第一篇', 'A storybook waiting for its first page'], emptyBookText: ['等家人准备好了，就把一个小片段放在这里。', 'The family will add a little moment when they’re ready.'], unavailableBook: ['故事册暂时没有打开', 'The storybook couldn’t be opened'], unavailableTitle: ['这一页暂时没能打开', 'This page couldn’t be opened'], unavailableText: ['请检查网络后，再试着翻开一次。', 'Check your connection, then try opening it again.'], pickStoryTitle: ['先从故事册挑一页', 'Choose a page from the storybook'], pickStoryText: ['每一个小故事，都在故事册里。', 'You’ll find each little story in the storybook.'], missingStoryTitle: ['没有找到这一页', 'We couldn’t find this page'], missingStoryText: ['这个链接可能有误。可以回到故事册，看看已经添入的小故事。', 'This link may be incorrect. Go back to the storybook to see the stories already added.'], addedDate: ['{date}添入故事册', 'Added to the storybook on {date}'], previousStory: ['← 前一个小故事', '← Previous little story'], nextStory: ['下一个小故事 →', 'Next little story →'], copied: ['链接已复制，可以分享这一页。', 'Link copied. You can share this page.'], copyFailed: ['浏览器没有自动复制，请手动复制下面的链接。', 'The browser couldn’t copy the link. Please copy it below.'],
    stickerMove: ['挪动{name}贴纸 {number}', 'Move {name} sticker {number}'], stickerTap: ['轻点挪动{name}贴纸', 'Tap to move the {name} sticker'],
    flower: ['花朵', 'flower'], star: ['星星', 'star'], rainbow: ['彩虹', 'rainbow'], heart: ['爱心', 'heart'], sun: ['太阳', 'sun'], cloud: ['云朵', 'cloud'], pencil: ['铅笔', 'pencil'], music: ['音符', 'music note'], leaf: ['叶子', 'leaf'], checker: ['彩色方格', 'colorful checkerboard'], spiral: ['小旋涡', 'little spiral'], sparkle: ['闪光', 'sparkle']
  };
  const supported = (value) => value === 'en' || value === 'zh';
  const query = new URLSearchParams(window.location.search).get('lang');
  let saved;
  try { saved = localStorage.getItem('iamgeorge-language'); } catch {}
  const routes = window.GeorgeRoutes;
  const renderedLanguage = document.body?.dataset.staticLang;
  let language = supported(query) ? query : supported(renderedLanguage) ? renderedLanguage : supported(saved) ? saved : 'zh';
  if (routes) {
    const target = routes.localize(window.location.href, language);
    const currentPath = routes.comparable(window.location.href).split(/[?#]/)[0];
    const targetPath = routes.comparable(target).split(/[?#]/)[0];
    if (currentPath !== targetPath) window.location.replace(target);
    else if (routes.comparable(target) !== routes.comparable(window.location.href)) {
      try { window.history.replaceState(window.history.state, '', target); } catch {}
    }
  }
  if (supported(query)) { try { localStorage.setItem('iamgeorge-language', language); } catch {} }
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  const t = (key, variables = {}) => {
    const pair = dictionary[key];
    const value = pair ? pair[language === 'en' ? 1 : 0] : key;
    return value.replace(/\{(\w+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(variables, name) ? String(variables[name]) : match);
  };
  const refresh = () => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((element) => { element.innerHTML = t(element.dataset.i18nHtml); });
    ['aria-label', 'title', 'placeholder', 'content', 'alt'].forEach((attribute) => {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => { element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`))); });
    });
    document.querySelectorAll('[data-set-lang]').forEach((button) => {
      if (button.tagName === 'A') {
        button.href = routes.localize(window.location.href, button.dataset.setLang);
        if (button.dataset.setLang === language) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      } else button.setAttribute('aria-pressed', String(button.dataset.setLang === language));
    });
    if (document.body?.dataset.i18nTitle) document.title = t(document.body.dataset.i18nTitle);
    // Preserve the destination path, story ID, filter query, and anchor.
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.hasAttribute('download') || link.hasAttribute('data-set-lang')) return;
      if (routes) { link.setAttribute('href', routes.localize(href, language)); return; }
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || !/\.html$/.test(url.pathname)) return;
        url.searchParams.set('lang', language);
        link.setAttribute('href', `${url.pathname.split('/').pop()}${url.search}${url.hash}`);
      } catch {}
    });
  };
  const setLanguage = (lang) => {
    if (!supported(lang) || lang === language) return;
    if (routes) {
      try { localStorage.setItem('iamgeorge-language', lang); } catch {}
      window.location.assign(routes.localize(window.location.href, lang));
      return;
    }
    language = lang;
    try { localStorage.setItem('iamgeorge-language', lang); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    try { window.history.replaceState(null, '', url); } catch {}
    refresh();
    document.dispatchEvent(new CustomEvent('iamgeorge:languagechange', { detail: { lang } }));
  };
  window.GeorgeI18n = { get lang() { return language; }, t, refresh };
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-set-lang]');
    if (button) { event.preventDefault(); setLanguage(button.dataset.setLang); }
  });
  refresh();
})();
