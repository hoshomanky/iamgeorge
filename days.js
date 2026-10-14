(() => {
  'use strict';

  const i18n = window.GeorgeI18n;
  const t = (key, variables) => i18n.t(key, variables);
  const $ = (selector) => document.querySelector(selector);
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const isDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  };
  const asDate = (value) => new Date(`${value}T00:00:00Z`);
  const iso = (value) => value.toISOString().slice(0, 10);
  const moveDate = (value, days) => {
    const next = asDate(value);
    next.setUTCDate(next.getUTCDate() + days);
    return iso(next);
  };
  const labelDate = (value) => i18n.lang === 'en'
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(asDate(value))
    : `${value.slice(0, 4)} 年 ${Number(value.slice(5, 7))} 月 ${Number(value.slice(8))} 日`;
  const dayHref = (value) => `day.html?date=${value}&lang=${i18n.lang}`;
  const calendarHref = (value) => `stories.html?view=days&date=${value}&restore=1&lang=${i18n.lang}`;
  const setupPaper = () => {
    if (!$('#paper-toggle')) return;
    const colors = { cream: '#fbf7ee', blue: '#eef5fa', pink: '#fcf0ee', green: '#f0f5e9' };
    const toggle = $('#paper-toggle');
    const palette = $('#paper-palette');
    const choose = (name) => {
      if (!Object.prototype.hasOwnProperty.call(colors, name)) return;
      document.documentElement.style.setProperty('--paper', colors[name]);
      $('meta[name="theme-color"]').content = colors[name];
      document.querySelectorAll('.paper-swatch').forEach((button) => {
        const active = button.dataset.paper === name;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-pressed', String(active));
      });
    };
    try { choose(localStorage.getItem('iamgeorge-paper') || 'cream'); } catch { choose('cream'); }
    toggle.addEventListener('click', () => {
      palette.hidden = !palette.hidden;
      toggle.setAttribute('aria-expanded', String(!palette.hidden));
    });
    document.querySelectorAll('.paper-swatch').forEach((button) => button.addEventListener('click', () => {
      choose(button.dataset.paper);
      try { localStorage.setItem('iamgeorge-paper', button.dataset.paper); } catch {}
      palette.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }));
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.paper-control')) { palette.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !palette.hidden) { palette.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    });
  };

  const setupDetail = () => {
    const content = window.GeorgeDayContent;
    const query = new URLSearchParams(window.location.search);
    const requested = query.get('date');
    const scrollKey = `iamgeorge:day:${requested}`;
    let data, error = false, restored = false;
    const saveScroll = () => {
      try { sessionStorage.setItem(scrollKey, String(window.scrollY)); } catch {}
    };
    window.addEventListener('pagehide', saveScroll);
    $('#day-entries').addEventListener('click', (event) => { if (event.target.closest('a')) saveScroll(); });
    const render = () => {
      if (!data || !isDate(requested) || requested < data.calendar.start || requested > data.calendar.end) {
        $('#day-title').textContent = t('dayTitle').split(' · ')[0];
        $('#day-error').hidden = false;
        $('#day-error-text').textContent = t(error ? 'dayUnavailable' : 'invalidDay');
        $('#retry-day').hidden = !error;
        $('#day-subtitle').hidden = true;
        $('#day-content-count').hidden = true;
        $('#day-entries').replaceChildren();
        $('#day-neighbours').hidden = true;
        $('.day-share').hidden = true;
        return;
      }
      $('#day-error').hidden = true;
      $('#day-subtitle').hidden = false;
      $('#day-neighbours').hidden = false;
      $('.day-share').hidden = false;
      const pretty = labelDate(requested);
      $('#day-title').textContent = pretty;
      document.title = `${pretty} · I AM GEORGE`;
      $('#back-to-calendar').href = calendarHref(requested);
      const before = moveDate(requested, -1), after = moveDate(requested, 1);
      $('#previous-day').hidden = before < data.calendar.start;
      $('#next-day').hidden = after > data.calendar.end;
      if (before >= data.calendar.start) $('#previous-day').href = dayHref(before);
      if (after <= data.calendar.end) $('#next-day').href = dayHref(after);
      const items = content.entriesForDate(data, requested);
      $('#day-content-count').textContent = content.counts(items);
      $('#day-content-count').hidden = !items.length;
      content.renderFull($('#day-entries'), items, requested, data);
      if (!restored) {
        restored = true;
        let position;
        if (query.get('restore') === '1') { try { position = Number(sessionStorage.getItem(scrollKey)); } catch {} }
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
          if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
          else if (Number.isFinite(position)) window.scrollTo({ top: position, behavior: 'instant' });
        }));
      }
    };
    const getData = () => {
      $('#day-error').hidden = true;
      $('#day-title').textContent = t('loadingDay');
      return content.load().then((loaded) => { data = loaded; error = false; render(); })
        .catch(() => { error = true; render(); });
    };
    $('#retry-day').addEventListener('click', getData);
    $('#copy-day-link').addEventListener('click', async () => {
      const url = new URL('day.html', window.location.href);
      url.searchParams.set('date', requested);
      url.searchParams.set('lang', i18n.lang);
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url.href);
        $('#day-share-status').dataset.message = 'copied';
        $('#day-share-status').textContent = t('copied');
        $('#manual-day-link-label').hidden = true;
        $('#manual-day-link').hidden = true;
      } catch {
        $('#day-share-status').dataset.message = 'copyFailed';
        $('#day-share-status').textContent = t('copyFailed');
        $('#manual-day-link-label').hidden = false;
        const input = $('#manual-day-link');
        input.hidden = false;
        input.value = url.href;
        input.focus(); input.select();
      }
    });
    document.addEventListener('iamgeorge:languagechange', () => {
      if (data || error || !isDate(requested)) render();
      const status = $('#day-share-status');
      if (status.dataset.message) status.textContent = t(status.dataset.message);
      const input = $('#manual-day-link');
      if (input.value) { const url = new URL(input.value); url.searchParams.set('lang', i18n.lang); input.value = url.href; }
    });
    if (!isDate(requested)) { render(); return; }
    getData();
  };
  if (document.body.dataset.dayPage === 'detail') { setupPaper(); setupDetail(); }
})();
