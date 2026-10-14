(() => {
  'use strict';
  const i18n = window.GeorgeI18n;
  const t = (key, variables) => i18n.t(key, variables);
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const localized = (item) => i18n.lang === 'en' ? { ...item, ...item.translations.en } : item;
  const isImage = (item) => item.type === 'photo' || item.type === 'art';
  const isDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  };
  const validate = (data) => {
    if (!data || data.version !== 1 || !Array.isArray(data.stories) || !Array.isArray(data.media)
      || !data.calendar || !isDate(data.calendar.start) || !isDate(data.calendar.end)
      || data.calendar.start > data.calendar.end || !Array.isArray(data.calendar.days)) throw new Error('Invalid calendar');
    const entries = [...data.stories, ...data.media];
    const ids = new Set();
    for (const item of entries) {
      if (!item || !/^[a-z][a-z0-9-]*$/.test(item.id) || ids.has(item.id)
        || !['story', 'photo', 'art', 'audio', 'video'].includes(item.type)
        || typeof item.title !== 'string' || !item.translations?.en?.title
        || (item.eventDate !== null && !isDate(item.eventDate))) throw new Error('Invalid public item');
      if (item.type === 'story') {
        if (!Array.isArray(item.paragraphs) || !Array.isArray(item.translations.en.paragraphs)) throw new Error('Missing story prose');
      } else if (typeof item.file !== 'string' || !item.file.startsWith('assets/')
        || item.file.includes('..') || /[?#\\]/.test(item.file)
        || !item.alt || !item.translations.en.alt || !item.caption || !item.translations.en.caption) throw new Error('Invalid public media');
      ids.add(item.id);
    }
    const byId = new Map(entries.map((item) => [item.id, item]));
    const dates = new Set();
    for (const day of data.calendar.days) {
      if (!day || !isDate(day.date) || day.date < data.calendar.start || day.date > data.calendar.end
        || dates.has(day.date) || !Array.isArray(day.itemIds) || !day.itemIds.length
        || new Set(day.itemIds).size !== day.itemIds.length
        || !day.itemIds.every((id) => byId.get(id)?.eventDate === day.date)) throw new Error('Invalid day references');
      dates.add(day.date);
    }
    return data;
  };
  let pending;
  const load = () => {
    if (pending) return pending;
    pending = (async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch('content/stories.json', { cache: 'no-cache', signal: controller.signal });
        if (!response.ok) throw new Error('Missing public collection');
        return validate(await response.json());
      } finally { window.clearTimeout(timeout); }
    })().catch((error) => { pending = undefined; throw error; });
    return pending;
  };
  const indexes = new WeakMap();
  const entriesForDate = (data, date) => {
    if (!indexes.has(data)) indexes.set(data, {
      entries: new Map([...data.stories, ...data.media].map((item) => [item.id, item])),
      days: new Map(data.calendar.days.map((day) => [day.date, day.itemIds]))
    });
    const index = indexes.get(data);
    return (index.days.get(date) || []).map((id) => index.entries.get(id));
  };
  const counts = (items) => {
    const nouns = { story: ['dayStoryCount', 'story', 'stories'], photo: ['dayPhotoCount', 'photo', 'photos'],
      art: ['dayArtCount', 'artwork', 'artworks'], audio: ['dayAudioCount', 'recording', 'recordings'], video: ['dayVideoCount', 'video', 'videos'] };
    return Object.entries(nouns).map(([kind, [key, singular, plural]]) => {
      const count = items.filter((item) => item.type === kind).length;
      return count ? t(key, { count, noun: count === 1 ? singular : plural }) : '';
    }).filter(Boolean).join(' · ');
  };
  const storyHref = (id, date) => `story.html?id=${encodeURIComponent(id)}&lang=${i18n.lang}${date ? `&day=${date}` : ''}`;
  const dayHref = (date) => `day.html?date=${date}&lang=${i18n.lang}&from=wall`;
  const dimensionCache = new Map();
  const image = (item, className) => {
    const img = make('img', className);
    const text = localized(item);
    let dimensions = dimensionCache.get(item.file);
    if (!dimensions) { try { dimensions = JSON.parse(sessionStorage.getItem(`iamgeorge:image:${item.file}`)); } catch {} }
    if (dimensions?.width > 0 && dimensions?.height > 0) { img.width = dimensions.width; img.height = dimensions.height; }
    img.src = item.file;
    img.alt = text.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', () => {
      const size = { width: img.naturalWidth, height: img.naturalHeight };
      dimensionCache.set(item.file, size);
      try { sessionStorage.setItem(`iamgeorge:image:${item.file}`, JSON.stringify(size)); } catch {}
    }, { once: true });
    return img;
  };
  let viewer;
  let galleryItems = [];
  let galleryIndex = 0;
  let galleryOpener;
  const renderViewer = () => {
    if (!viewer || !galleryItems.length) return;
    const item = galleryItems[galleryIndex];
    const text = localized(item);
    viewer.querySelector('h2').textContent = text.title;
    const img = viewer.querySelector('img');
    img.src = item.file;
    img.alt = text.alt;
    viewer.querySelector('figcaption').textContent = text.caption;
    viewer.querySelector('[data-photo-position]').textContent = t('photoPosition', { current: galleryIndex + 1, total: galleryItems.length });
    viewer.querySelector('[data-photo-previous]').disabled = galleryIndex === 0;
    viewer.querySelector('[data-photo-next]').disabled = galleryIndex === galleryItems.length - 1;
    viewer.querySelector('[data-photo-original]').href = item.file;
    viewer.querySelector('[data-photo-error]').hidden = true;
    viewer.querySelector('[data-photo-close]').textContent = t('closePhoto');
    viewer.querySelector('[data-photo-previous]').textContent = `← ${t('previousPhoto')}`;
    viewer.querySelector('[data-photo-next]').textContent = `${t('nextPhoto')} →`;
    viewer.querySelector('[data-photo-original]').textContent = t('originalPhoto');
    viewer.querySelector('[data-photo-error]').textContent = t('photoUnavailable');
  };
  const openGallery = (items, index, opener) => {
    galleryItems = items;
    galleryIndex = index;
    galleryOpener = opener;
    if (!viewer) {
      viewer = make('dialog', 'day-photo-viewer');
      viewer.id = 'day-photo-viewer';
      viewer.setAttribute('aria-labelledby', 'photo-viewer-title');
      const close = make('button', 'photo-viewer-close'); close.type = 'button'; close.dataset.photoClose = '';
      const title = make('h2'); title.id = 'photo-viewer-title';
      const figure = make('figure'); figure.append(make('img'), make('figcaption'));
      const error = make('p', 'photo-viewer-error'); error.dataset.photoError = ''; error.hidden = true;
      const nav = make('div', 'photo-viewer-nav');
      const previous = make('button'); previous.type = 'button'; previous.dataset.photoPrevious = '';
      const position = make('span'); position.dataset.photoPosition = ''; position.setAttribute('aria-live', 'polite');
      const next = make('button'); next.type = 'button'; next.dataset.photoNext = '';
      const original = make('a', 'photo-viewer-original'); original.dataset.photoOriginal = ''; original.target = '_blank'; original.rel = 'noopener';
      nav.append(previous, position, next); viewer.append(close, title, figure, error, nav, original); document.body.append(viewer);
      close.addEventListener('click', () => viewer.close());
      previous.addEventListener('click', () => { galleryIndex--; renderViewer(); });
      next.addEventListener('click', () => { galleryIndex++; renderViewer(); });
      viewer.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' && galleryIndex > 0) { event.preventDefault(); galleryIndex--; renderViewer(); }
        if (event.key === 'ArrowRight' && galleryIndex < galleryItems.length - 1) { event.preventDefault(); galleryIndex++; renderViewer(); }
      });
      viewer.addEventListener('close', () => { if (galleryOpener?.isConnected) galleryOpener.focus({ preventScroll: true }); });
      viewer.addEventListener('click', (event) => {
        if (event.target !== viewer) return;
        const rect = viewer.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
      });
      viewer.querySelector('img').addEventListener('error', () => { viewer.querySelector('[data-photo-error]').hidden = false; });
    }
    renderViewer();
    if (!viewer.open) viewer.showModal();
  };
  const picture = (item, gallery, small = false) => {
    const figure = make('figure', small ? 'day-preview-figure' : 'day-album-figure');
    if (!small) figure.id = `memory-${item.id}`;
    const button = make('button', 'day-image-button'); button.type = 'button';
    button.setAttribute('aria-label', t('viewPhoto', { title: localized(item).title }));
    button.append(image(item));
    button.addEventListener('click', () => openGallery(gallery, gallery.indexOf(item), button));
    figure.append(button);
    if (!small) {
      const caption = make('figcaption');
      caption.append(make('strong', '', localized(item).title), make('p', '', localized(item).caption));
      figure.append(caption);
    }
    return figure;
  };
  const empty = (container) => container.append(make('p', 'day-empty-title', t('dayEmpty')), make('p', 'day-empty-note', t('dayEmptyNote')));
  const preview = (container, items, date) => {
    container.replaceChildren();
    if (!items.length) { empty(container); return; }
    const stories = items.filter((item) => item.type === 'story');
    const pictures = items.filter(isImage);
    stories.slice(0, 2).forEach((item) => {
      const text = localized(item); const article = make('article', 'day-preview-story');
      const link = make('a'); link.href = storyHref(item.id, date);
      link.append(make('h3', '', text.title), make('p', '', text.excerpt)); article.append(link); container.append(article);
    });
    if (pictures.length) {
      const grid = make('div', items.length === 1 ? 'day-preview-images is-single' : 'day-preview-images');
      pictures.slice(0, 3).forEach((item) => grid.append(picture(item, pictures, true)));
      if (pictures.length > 3) {
        const more = make('a', 'day-preview-more', t('moreDayPhotos', { count: pictures.length - 3 }));
        more.href = `${dayHref(date)}#memory-${pictures[3].id}`; grid.append(more);
      }
      container.append(grid);
      if (items.length === 1) container.append(make('p', 'day-preview-caption', localized(pictures[0]).caption));
    }
    items.filter((item) => !isImage(item) && item.type !== 'story').slice(0, 1).forEach((item) => {
      const text = localized(item); const link = make('a', 'day-preview-media', text.title);
      link.href = `${dayHref(date)}#memory-${item.id}`; container.append(link);
    });
  };
  const renderFull = (container, items, date, data) => {
    container.replaceChildren();
    if (!items.length) { empty(container); return; }
    const gallery = items.filter(isImage);
    for (let index = 0; index < items.length; index++) {
      const item = items[index]; const text = localized(item);
      if (isImage(item)) {
        const run = [item];
        while (index + 1 < items.length && isImage(items[index + 1])) run.push(items[++index]);
        const group = make('section', run.length === 1 ? 'day-album is-single' : 'day-album');
        group.setAttribute('aria-label', counts(run));
        run.forEach((entry) => {
          const figure = picture(entry, gallery);
          (entry.relatedIds || []).forEach((id) => {
            const story = data.stories.find((record) => record.id === id); if (!story) return;
            const link = make('a', 'day-entry-link', localized(story).title); link.href = storyHref(id, date);
            figure.querySelector('figcaption').append(link);
          });
          group.append(figure);
        }); container.append(group); continue;
      }
      const article = make('article', 'day-entry'); article.id = `memory-${item.id}`;
      const key = { story: 'dayStory', audio: 'dayAudio', video: 'dayVideo' }[item.type];
      article.append(make('p', 'eyebrow', t(key)), make('h2', '', text.title));
      if (item.type === 'story') {
        const body = make('div', 'day-story-prose');
        text.paragraphs.forEach((paragraph) => body.append(make('p', '', paragraph))); article.append(body);
        article.append(make('p', 'day-story-source', text.sourceLabel));
        const link = make('a', 'day-entry-link', t('dayReadStory')); link.href = storyHref(item.id, date); article.append(link);
      } else {
        const media = make(item.type === 'audio' ? 'audio' : 'video'); media.controls = true; media.preload = 'none'; media.src = item.file;
        media.setAttribute('aria-label', text.alt); article.append(media, make('p', 'day-entry-caption', text.caption));
        (item.relatedIds || []).forEach((id) => {
          const story = data.stories.find((entry) => entry.id === id); if (!story) return;
          const link = make('a', 'day-entry-link', localized(story).title); link.href = storyHref(id, date); article.append(link);
        });
      }
      container.append(article);
    }
  };
  document.addEventListener('iamgeorge:languagechange', () => { if (viewer?.open) renderViewer(); });
  window.GeorgeDayContent = { load, validate, entriesForDate, counts, preview, renderFull, isDate };
})();
