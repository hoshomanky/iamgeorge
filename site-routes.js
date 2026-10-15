(() => {
  'use strict';
  const published = {"stories":["piano-car-nap","three-names","kindergarten-helper-2025-10-13","mum-phone-in-lift-2025-10-14"],"days":["2025-10-13","2025-10-14","2025-10-15","2025-10-16"]};
  const stories = new Set(published.stories);
  const days = new Set(published.days);
  const bases = new Set(['index', 'about', 'stories', 'story', 'day', 'memories']);
  const file = (kind, lang, id) => {
    const name = `${kind}${id ? `-${id}` : ''}${lang === 'en' ? '.en' : ''}`;
    return name === 'index' ? '/' : `/${name}`;
  };
  const page = (kind, lang) => file(kind, lang);
  const story = (id, lang) => stories.has(id) ? file('story', lang, id) : `${page('story', lang)}?id=${encodeURIComponent(id)}`;
  const day = (date, lang) => days.has(date) ? file('day', lang, date) : `${page('day', lang)}?date=${encodeURIComponent(date)}`;
  const localize = (href, lang) => {
    if (!href || href.startsWith('#')) return href;
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return href;
      let name = url.pathname.slice(1).replace(/\.html$/, '').replace(/\.en$/, '') || 'index';
      let kind, id;
      if (bases.has(name)) {
        kind = name;
        if (kind === 'story' && stories.has(url.searchParams.get('id'))) {
          id = url.searchParams.get('id'); url.searchParams.delete('id');
        }
        if (kind === 'day' && days.has(url.searchParams.get('date'))) {
          id = url.searchParams.get('date'); url.searchParams.delete('date');
        }
      } else if (name.startsWith('story-') && stories.has(name.slice(6))) {
        kind = 'story'; id = name.slice(6);
      } else if (name.startsWith('day-') && days.has(name.slice(4))) {
        kind = 'day'; id = name.slice(4);
      } else return href;
      url.searchParams.delete('lang');
      return file(kind, lang, id) + url.search + url.hash;
    } catch { return href; }
  };
  // Cloudflare removes .html. Treat that alias as the same page to avoid loops.
  const comparable = (value) => {
    const url = new URL(value, window.location.href);
    return (url.pathname.replace(/\.html$/, '').replace(/^\/index$/, '/') || '/') + url.search + url.hash;
  };
  // Sharing is always a clean production URL, including while previewing locally.
  const shareStory = (id, lang) => new URL(story(id, lang), 'https://iamgeorge.si').href;
  const shareDay = (date, lang) => new URL(day(date, lang), 'https://iamgeorge.si').href;
  window.GeorgeRoutes = { page, story, day, localize, comparable, shareStory, shareDay };
})();
