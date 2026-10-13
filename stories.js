(() => {
  'use strict';

  const page = document.body.dataset.storyPage;
  const i18n = window.GeorgeI18n;
  const t = (key, variables) => i18n.t(key, variables);
  const localized = (story) => i18n.lang === 'en' ? { ...story, ...story.translations.en } : story;
  const tagLabel = (tag) => i18n.lang === 'en' ? tag.labelEn : tag.label;
  const $ = (selector) => document.querySelector(selector);
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
  const isDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  };
  const prettyDate = (value) => {
    if (i18n.lang === 'en') return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
    const [year, month, day] = value.split('-');
    return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
  };
  const storyHref = (id) => `story.html?id=${encodeURIComponent(id)}&lang=${i18n.lang}`;
  const eventLabel = (story) => story.eventDate ? prettyDate(story.eventDate) : localized(story).eventDateLabel || t('dateUnknown');
  const addEventDate = (element, story) => {
    if (story.eventDate) {
      const time = make('time', '', eventLabel(story));
      time.dateTime = story.eventDate;
      element.append(time);
    } else {
      element.textContent = eventLabel(story);
    }
  };
  const chronological = (first, second) => {
    if (first.eventDate && second.eventDate) return first.eventDate.localeCompare(second.eventDate) || first.addedDate.localeCompare(second.addedDate) || first.id.localeCompare(second.id);
    if (first.eventDate) return -1;
    if (second.eventDate) return 1;
    return first.addedDate.localeCompare(second.addedDate) || first.id.localeCompare(second.id);
  };

  // Public data contains only reviewed stories. Private material stays outside dist.
  const validateCollection = (data) => {
    if (!data || data.version !== 1 || !Array.isArray(data.tags) || !Array.isArray(data.stories)) throw new Error('Invalid collection');
    const tagIds = new Set();
    const storyIds = new Set();
    data.tags.forEach((tag) => {
      if (!tag || !hasText(tag.id) || tag.id === 'all' || !hasText(tag.label) || !hasText(tag.labelEn) || tagIds.has(tag.id)) throw new Error('Invalid tag');
      tagIds.add(tag.id);
    });
    data.stories.forEach((story) => {
      if (!story || !hasText(story.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(story.id) || storyIds.has(story.id) || !hasText(story.title) || !hasText(story.excerpt) || !hasText(story.sourceLabel)) throw new Error('Invalid story');
      if (!Array.isArray(story.paragraphs) || !story.paragraphs.length || !story.paragraphs.every(hasText)) throw new Error('Invalid paragraphs');
      const english = story.translations?.en;
      if (!english || !['title', 'excerpt', 'sourceLabel', 'narrator', 'eventDateLabel'].every((key) => hasText(english[key])) || !Array.isArray(english.paragraphs) || !english.paragraphs.length || !english.paragraphs.every(hasText)) throw new Error('Invalid English story');
      if (!Array.isArray(story.tags) || !story.tags.every((id) => tagIds.has(id)) || !isDate(story.addedDate)) throw new Error('Invalid story metadata');
      if (story.eventDate !== null && !isDate(story.eventDate)) throw new Error('Invalid event date');
      if (story.eventDateLabel !== undefined && !hasText(story.eventDateLabel)) throw new Error('Invalid date label');
      if (!Array.isArray(story.relatedIds) || !story.relatedIds.every(hasText)) throw new Error('Invalid related stories');
      storyIds.add(story.id);
    });
    if (!data.stories.every((story) => story.relatedIds.every((id) => storyIds.has(id)))) throw new Error('Missing related story');
    return data;
  };

  const loadCollection = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('content/stories.json', { cache: 'no-cache', signal: controller.signal });
      if (!response.ok) throw new Error('Story collection unavailable');
      return validateCollection(await response.json());
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const setupPaper = () => {
    const palette = $('#paper-palette');
    const toggle = $('#paper-toggle');
    if (!palette || !toggle) return;
    const colors = { cream: '#fbf7ee', blue: '#eef5fa', pink: '#fcf0ee', green: '#f0f5e9' };
    const setPaper = (paper) => {
      if (!Object.prototype.hasOwnProperty.call(colors, paper)) return;
      document.documentElement.style.setProperty('--paper', colors[paper]);
      $('meta[name="theme-color"]').content = colors[paper];
      document.querySelectorAll('.paper-swatch').forEach((button) => {
        const selected = button.dataset.paper === paper;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    };
    try { setPaper(localStorage.getItem('iamgeorge-paper') || 'cream'); } catch { setPaper('cream'); }
    const close = () => { palette.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      palette.hidden = !palette.hidden;
      toggle.setAttribute('aria-expanded', String(!palette.hidden));
    });
    document.querySelectorAll('.paper-swatch').forEach((button) => button.addEventListener('click', () => {
      setPaper(button.dataset.paper);
      try { localStorage.setItem('iamgeorge-paper', button.dataset.paper); } catch {}
      close();
      toggle.focus();
    }));
    document.addEventListener('click', (event) => { if (!event.target.closest('.paper-control')) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !palette.hidden) { close(); toggle.focus(); } });
  };

  const sticker = (id) => {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(namespace, 'use');
    use.setAttribute('href', `assets/stickers.svg#${id}`);
    svg.append(use);
    return svg;
  };

  const renderTags = (element, ids, tags) => {
    element.replaceChildren();
    ids.forEach((id) => element.append(make('span', 'story-tag', tags.get(id))));
  };

  const setupCollection = () => {
    const search = $('#story-search');
    const clear = $('#clear-search');
    const order = $('#story-order');
    const grid = $('#story-grid');
    const status = $('#collection-status');
    const message = $('#collection-message');
    const action = $('#collection-message-action');
    const more = $('#more-stories');
    const initial = new URLSearchParams(window.location.search);
    let activeTag = initial.get('tag') || 'all';
    let data;
    let loadState = 'loading';
    let lastMessage;
    let limit = 12;
    search.value = (initial.get('q') || '').slice(0, 200);
    order.value = initial.get('order') === 'time' ? 'time' : 'newest';

    const saveView = () => {
      const url = new URL(window.location.href);
      const query = search.value.trim();
      query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
      activeTag !== 'all' ? url.searchParams.set('tag', activeTag) : url.searchParams.delete('tag');
      order.value === 'time' ? url.searchParams.set('order', 'time') : url.searchParams.delete('order');
      try { window.history.replaceState(null, '', url); } catch {}
    };

    const showMessage = (title, description, buttonText, callback) => {
      lastMessage = [title, description, buttonText, callback];
      message.hidden = false;
      $('#collection-message-title').textContent = t(title);
      $('#collection-message-text').textContent = t(description);
      action.hidden = !buttonText;
      action.textContent = buttonText ? t(buttonText) : '';
      action.onclick = callback || null;
    };

    const render = () => {
      if (!data) return;
      const tagNames = new Map(data.tags.map((tag) => [tag.id, tagLabel(tag)]));
      const query = search.value.trim().toLocaleLowerCase('zh-CN');
      const stories = data.stories.filter((story) => {
        if (activeTag !== 'all' && !story.tags.includes(activeTag)) return false;
        const english = story.translations.en;
        const haystack = [story.title, story.excerpt, ...story.paragraphs, english.title, english.excerpt, ...english.paragraphs, ...data.tags.filter((tag) => story.tags.includes(tag.id)).flatMap((tag) => [tag.label, tag.labelEn])].join(' ').toLocaleLowerCase('zh-CN');
        return !query || haystack.includes(query);
      });
      stories.sort(order.value === 'time' ? chronological : (first, second) => second.addedDate.localeCompare(first.addedDate) || first.id.localeCompare(second.id));
      grid.replaceChildren();
      message.hidden = true;
      more.hidden = stories.length <= limit;
      clear.hidden = !search.value;
      $('#time-order-note').hidden = order.value !== 'time';
      document.querySelectorAll('.theme-chip').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.tag === activeTag));
        button.textContent = button.dataset.tag === 'all' ? t('allTheme') : tagNames.get(button.dataset.tag);
      });
      status.textContent = t(query || activeTag !== 'all' ? 'foundStories' : 'storyCount', { count: stories.length, noun: stories.length === 1 ? 'story' : 'stories' });
      const icons = ['music', 'flower', 'star', 'cloud', 'sun', 'heart'];
      stories.slice(0, limit).forEach((story, index) => {
        const text = localized(story);
        const card = make('article', 'story-card');
        const link = make('a');
        link.href = storyHref(story.id);
        const top = make('div', 'story-card-topline');
        top.append(make('span', '', 'A LITTLE STORY'), sticker(icons[index % icons.length]));
        const title = make('h3', '', text.title);
        const excerpt = make('p', 'story-card-excerpt', text.excerpt);
        const tags = make('div', 'story-card-tags');
        renderTags(tags, story.tags, tagNames);
        const bottom = make('div', 'story-card-bottom');
        const date = make('span', 'story-card-date');
        addEventDate(date, story);
        const arrow = make('span', '', '↗');
        arrow.setAttribute('aria-hidden', 'true');
        bottom.append(date, arrow);
        link.append(top, title, excerpt, tags, bottom);
        card.append(link);
        grid.append(card);
      });
      if (!stories.length) {
        if (data.stories.length) {
          showMessage('searchEmptyTitle', 'searchEmptyText', 'showAll', () => {
            search.value = '';
            activeTag = 'all';
            limit = 12;
            render();
            search.focus();
          });
        } else {
          showMessage('emptyBookTitle', 'emptyBookText');
        }
      }
      saveView();
    };

    const load = async () => {
      loadState = 'loading'; status.textContent = t('loadingBook');
      grid.setAttribute('aria-busy', 'true');
      message.hidden = true;
      more.hidden = true;
      try {
        data = await loadCollection();
        loadState = 'ready';
        if (activeTag !== 'all' && !data.tags.some((tag) => tag.id === activeTag)) activeTag = 'all';
        const themes = $('#story-themes');
        themes.replaceChildren();
        [{ id: 'all', label: t('allTheme'), labelEn: t('allTheme') }, ...data.tags.filter((tag) => data.stories.some((story) => story.tags.includes(tag.id)))].forEach((tag) => {
          const button = make('button', 'theme-chip', tagLabel(tag));
          button.type = 'button';
          button.dataset.tag = tag.id;
          button.setAttribute('aria-pressed', String(tag.id === activeTag));
          button.addEventListener('click', () => { activeTag = tag.id; limit = 12; render(); });
          themes.append(button);
        });
        $('#story-controls').hidden = false;
        render();
      } catch {
        data = undefined;
        loadState = 'failed';
        grid.replaceChildren();
        $('#story-controls').hidden = true;
        status.textContent = t('unavailableBook');
        showMessage('unavailableTitle', 'unavailableText', 'retry', load);
      } finally {
        grid.setAttribute('aria-busy', 'false');
      }
    };

    search.addEventListener('input', () => { limit = 12; render(); });
    clear.addEventListener('click', () => { search.value = ''; limit = 12; render(); search.focus(); });
    order.addEventListener('change', () => { limit = 12; render(); });
    $('#story-search-form').addEventListener('submit', (event) => { event.preventDefault(); render(); });
    more.addEventListener('click', () => {
      const previousLimit = limit;
      limit += 12;
      render();
      const firstNewStory = grid.children[previousLimit]?.querySelector('a');
      if (firstNewStory) firstNewStory.focus();
    });
    document.addEventListener('iamgeorge:languagechange', () => {
      if (data) render();
      else {
        status.textContent = t(loadState === 'failed' ? 'unavailableBook' : 'loadingBook');
        if (!message.hidden && lastMessage) showMessage(...lastMessage);
      }
    });
    load();
  };

  const setupDetail = () => {
    const id = new URLSearchParams(window.location.search).get('id');
    const status = $('#detail-status');
    const message = $('#detail-message');
    const retry = $('#detail-retry');
    let loadedData;
    let lastMessage;
    const showMessage = (title, description, canRetry) => {
      lastMessage = [title, description, canRetry];
      status.hidden = true;
      message.hidden = false;
      $('#detail-message-title').textContent = t(title);
      $('#detail-message-text').textContent = t(description);
      retry.hidden = !canRetry;
    };
    if (!id) {
      showMessage('pickStoryTitle', 'pickStoryText', false);
      document.addEventListener('iamgeorge:languagechange', () => showMessage(...lastMessage));
      return;
    }

    const load = async () => {
      status.hidden = false;
      status.textContent = t('loadingStory');
      message.hidden = true;
      try {
        const data = loadedData || await loadCollection();
        loadedData = data;
        const story = data.stories.find((entry) => entry.id === id);
        if (!story) {
          showMessage('missingStoryTitle', 'missingStoryText', false);
          return;
        }
        const text = localized(story);
        document.title = `${text.title} · I AM GEORGE`;
        $('meta[name="description"]').content = text.excerpt;
        $('#detail-title').textContent = text.title;
        const tagNames = new Map(data.tags.map((tag) => [tag.id, tagLabel(tag)]));
        renderTags($('#detail-tags'), story.tags, tagNames);
        $('#detail-event-date').replaceChildren();
        addEventDate($('#detail-event-date'), story);
        $('#detail-paragraphs').replaceChildren(...text.paragraphs.map((paragraph) => make('p', '', paragraph)));
        $('#detail-source').textContent = text.sourceLabel;
        $('#detail-narrator').textContent = t('narratorMoment', { narrator: text.narrator });
        const added = make('time', '', t('addedDate', { date: prettyDate(story.addedDate) }));
        added.dateTime = story.addedDate;
        $('#detail-added-date').replaceChildren(added);
        $('#story-article').hidden = false;
        $('#story-share').hidden = false;
        status.hidden = true;

        const ordered = [...data.stories].sort(chronological);
        const index = ordered.findIndex((entry) => entry.id === id);
        const neighbours = $('#story-neighbours');
        neighbours.replaceChildren();
        [[ordered[index - 1], 'previous-story', 'previousStory'], [ordered[index + 1], 'next-story', 'nextStory']].forEach(([entry, className, label]) => {
          if (!entry) return;
          const link = make('a', className);
          link.href = storyHref(entry.id);
          link.append(make('small', '', t(label)), make('span', '', localized(entry).title));
          neighbours.append(link);
        });
        neighbours.hidden = !neighbours.children.length;
        const related = [...new Set(story.relatedIds)].filter((relatedId) => relatedId !== id).map((relatedId) => data.stories.find((entry) => entry.id === relatedId));
        const relatedLinks = $('#related-story-links');
        relatedLinks.replaceChildren();
        related.forEach((entry) => {
          const link = make('a', '', localized(entry).title);
          link.href = storyHref(entry.id);
          relatedLinks.append(link);
        });
        $('#related-stories').hidden = !related.length;
      } catch {
        showMessage('unavailableTitle', 'unavailableText', true);
      }
    };
    retry.addEventListener('click', load);
    $('#copy-story-link').addEventListener('click', async () => {
      const url = new URL('story.html', window.location.href);
      url.searchParams.set('id', id);
      url.searchParams.set('lang', i18n.lang);
      const shareStatus = $('#share-status');
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url.href);
        shareStatus.dataset.message = 'copied'; shareStatus.textContent = t('copied');
        $('#manual-copy-label').hidden = true;
        $('#manual-story-link').hidden = true;
      } catch {
        shareStatus.dataset.message = 'copyFailed'; shareStatus.textContent = t('copyFailed');
        const input = $('#manual-story-link');
        $('#manual-copy-label').hidden = false;
        input.hidden = false;
        input.value = url.href;
        input.focus();
        input.select();
      }
    });
    document.addEventListener('iamgeorge:languagechange', () => {
      if (loadedData) load();
      else if (!message.hidden && lastMessage) showMessage(...lastMessage);
      else status.textContent = t('loadingStory');
      const shareStatus = $('#share-status');
      if (shareStatus.dataset.message) shareStatus.textContent = t(shareStatus.dataset.message);
      const input = $('#manual-story-link');
      if (input.value) {
        const url = new URL(input.value);
        url.searchParams.set('lang', i18n.lang);
        input.value = url.href;
      }
    });
    load();
  };

  setupPaper();
  if (page === 'collection') setupCollection();
  if (page === 'detail') setupDetail();
})();
