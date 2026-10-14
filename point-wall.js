(() => {
  'use strict';
  if (document.body.dataset.storyPage !== 'collection') return;
  const i18n = window.GeorgeI18n;
  const content = window.GeorgeDayContent;
  const t = (key, variables) => i18n.t(key, variables);
  const $ = (selector) => document.querySelector(selector);
  const query = new URLSearchParams(window.location.search);
  const storageKey = 'iamgeorge:point-wall';
  let remembered = {};
  try { remembered = JSON.parse(sessionStorage.getItem(storageKey)) || {}; } catch {}
  const returned = query.get('restore') === '1';
  const previous = returned ? remembered : history.state?.georgeWall || {};
  let data, dates = [], published = new Set(), selected = 0, opened = false, failed = false;
  let columns = 60, step = 10, width = 0, restored = false;
  let view = query.get('view') === 'days' ? 'days'
    : query.get('view') === 'themes' || query.has('tag') || query.has('q') || query.has('order') ? 'themes' : 'days';
  const canvas = $('#lifetime-wall');
  const tooltip = $('#wall-tooltip');
  const dateValue = () => dates[selected];
  const pretty = (value) => new Intl.DateTimeFormat(i18n.lang === 'en' ? 'en-US' : 'zh-CN',
    { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
  const snapshot = () => ({ date: dateValue(), open: opened, scrollY: window.scrollY, view });
  const save = () => {
    if (!data) return;
    const state = snapshot();
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    if (opened) url.searchParams.set('date', dateValue());
    else url.searchParams.delete('date');
    url.searchParams.delete('restore');
    try { history.replaceState({ ...history.state, georgeWall: state }, '', url); } catch {}
  };
  const showView = (next, remember = true) => {
    view = next;
    $('#day-browser').hidden = next !== 'days';
    $('#theme-browser').hidden = next !== 'themes';
    $('#day-mode').setAttribute('aria-selected', String(next === 'days'));
    $('#theme-mode').setAttribute('aria-selected', String(next === 'themes'));
    document.body.classList.toggle('showing-days', next === 'days');
    if (next === 'days') requestAnimationFrame(draw);
    if (remember) save();
  };
  const palette = (date) => {
    const month = Number(date.slice(5, 7));
    return month <= 2 || month === 12 ? '#2c63d8' : month <= 5 ? '#3c8865' : month <= 8 ? '#f2c847' : '#ec644c';
  };
  const draw = () => {
    if (!data || $('#day-browser').hidden) return;
    width = canvas.parentElement.getBoundingClientRect().width;
    if (!width) return;
    columns = width < 410 ? 32 : width < 580 ? 44 : 60;
    step = width / columns;
    const height = Math.ceil(dates.length / columns) * step;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.style.height = `${height}px`;
    canvas.dataset.dayCount = String(dates.length);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const radius = step * .31;
    dates.forEach((date, index) => {
      const x = (index % columns + .5) * step, y = (Math.floor(index / columns) + .5) * step;
      const hasContent = published.has(date);
      ctx.globalAlpha = hasContent ? .43 : 1;
      ctx.fillStyle = hasContent ? palette(date) : '#dededb';
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      if (hasContent) {
        ctx.globalAlpha = 1; ctx.fillStyle = '#293630'; ctx.beginPath(); ctx.arc(x, y, Math.max(1, radius * .28), 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#9570c4'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc((selected % columns + .5) * step, (Math.floor(selected / columns) + .5) * step, radius + 1.5, 0, Math.PI * 2); ctx.stroke();
  };
  const renderPreview = () => {
    const panel = $('#day-preview');
    if (!data) return;
    panel.hidden = false;
    panel.classList.toggle('is-open', opened);
    $('#close-day-preview').hidden = !opened;
    $('#open-day').hidden = !opened;
    $('#preview-neighbours').hidden = !opened;
    if (!opened) {
      $('#preview-date').textContent = t('wallPickTitle');
      $('#preview-count').textContent = '';
      $('#preview-count').hidden = true;
      const message = document.createElement('p'); message.className = 'preview-pick-text'; message.textContent = t('wallPickText');
      $('#preview-content').replaceChildren(message); return;
    }
    $('#preview-date').textContent = pretty(dateValue());
    const entries = content.entriesForDate(data, dateValue());
    $('#preview-count').textContent = content.counts(entries);
    $('#preview-count').hidden = !entries.length;
    content.preview($('#preview-content'), entries, dateValue());
    $('#open-day').href = window.GeorgeRoutes.localize(`day.html?date=${dateValue()}&from=wall`,i18n.lang);
  };
  const renderSelection = () => {
    if (!data) return;
    $('#wall-date').value = dateValue();
    $('#wall-year').value = dateValue().slice(0, 4);
    $('#wall-selected').textContent = pretty(dateValue());
    $('#wall-previous').disabled = selected === 0;
    $('#wall-next').disabled = selected === dates.length - 1;
    $('#preview-previous').disabled = selected === 0;
    $('#preview-next').disabled = selected === dates.length - 1;
    canvas.setAttribute('aria-label', `${t('wallLabel', { count: dates.length })} ${pretty(dateValue())}`);
    renderPreview(); draw();
  };
  const select = (index, open = true) => {
    if (!data) return;
    selected = Math.max(0, Math.min(dates.length - 1, index));
    opened = open;
    tooltip.hidden = true;
    renderSelection(); save();
  };
  const pointIndex = (event) => {
    if (!data || !step) return -1;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const col = Math.floor(x / step), row = Math.floor(y / step);
    const index = row * columns + col;
    return col >= 0 && col < columns && row >= 0 && index < dates.length ? index : -1;
  };
  let pointerStart;
  canvas.addEventListener('pointerdown', (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
  canvas.addEventListener('click', (event) => {
    if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 10) return;
    const index = pointIndex(event);
    if (index >= 0) select(index);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const index = pointIndex(event);
    if (index < 0) { tooltip.hidden = true; return; }
    tooltip.textContent = `${pretty(dates[index])}${published.has(dates[index]) ? ` · ${t('publicDay')}` : ''}`;
    tooltip.hidden = false;
    const rect = canvas.getBoundingClientRect();
    tooltip.style.left = `${Math.max(4, Math.min(event.clientX - rect.left + 10, width - tooltip.offsetWidth - 4))}px`;
    tooltip.style.top = `${Math.max(0, event.clientY - rect.top - 38)}px`;
  });
  canvas.addEventListener('pointerleave', () => { tooltip.hidden = true; });
  canvas.addEventListener('keydown', (event) => {
    if (!data) return;
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
    if (Object.prototype.hasOwnProperty.call(moves, event.key)) { event.preventDefault(); select(selected + moves[event.key]); }
    else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(event.key === 'Home' ? 0 : dates.length - 1); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(selected); }
  });
  $('#wall-date').addEventListener('change', (event) => {
    const index = dates.indexOf(event.target.value);
    if (index >= 0) select(index); else event.target.value = dateValue();
  });
  $('#wall-year').addEventListener('change', (event) => {
    const first = dates.findIndex((date) => date.startsWith(event.target.value));
    if (first >= 0) select(first);
  });
  $('#wall-previous').addEventListener('click', () => select(selected - 1));
  $('#wall-next').addEventListener('click', () => select(selected + 1));
  $('#preview-previous').addEventListener('click', () => select(selected - 1));
  $('#preview-next').addEventListener('click', () => select(selected + 1));
  $('#close-day-preview').addEventListener('click', () => {
    opened = false; renderPreview(); save(); canvas.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && opened && !document.querySelector('#day-photo-viewer[open]')) {
      opened = false; renderPreview(); save(); canvas.focus({ preventScroll: true });
    }
  });
  $('#day-preview').addEventListener('click', (event) => { if (event.target.closest('a')) save(); });
  $('#day-mode').addEventListener('click', () => showView('days'));
  $('#theme-mode').addEventListener('click', () => showView('themes'));
  $('#day-mode').addEventListener('keydown', (event) => { if (event.key === 'ArrowRight') { $('#theme-mode').focus(); showView('themes'); } });
  $('#theme-mode').addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') { $('#day-mode').focus(); showView('days'); } });
  window.addEventListener('pagehide', save);
  new ResizeObserver(draw).observe(canvas.parentElement);
  document.addEventListener('iamgeorge:languagechange', () => {
    if (data) {
      $('#wall-total').textContent = t('wallDays', { count: new Intl.NumberFormat(i18n.lang).format(dates.length) });
      renderSelection();
    } else $('#day-browser-status').textContent = t(failed ? 'calendarUnavailable' : 'loadingCalendar');
  });
  showView(view, false);
  $('#day-browser-status').textContent = t('loadingCalendar');
  content.load().then((collection) => {
    data = collection;
    const first = Date.parse(`${data.calendar.start}T00:00:00Z`);
    const total = Math.round((Date.parse(`${data.calendar.end}T00:00:00Z`) - first) / 86400000) + 1;
    dates = Array.from({ length: total }, (_, index) => new Date(first + index * 86400000).toISOString().slice(0, 10));
    published = new Set(data.calendar.days.map((day) => day.date));
    const requested = query.get('date') || previous.date;
    const index = dates.indexOf(requested);
    selected = index >= 0 ? index : 0;
    opened = index >= 0 && (query.has('date') || !!previous.open);
    const years = [...new Set(dates.map((date) => date.slice(0, 4)))];
    years.forEach((year) => { const option = document.createElement('option'); option.value = year; option.textContent = year; $('#wall-year').append(option); });
    $('#wall-year').disabled = false;
    const input = $('#wall-date'); input.min = data.calendar.start; input.max = data.calendar.end; input.disabled = false;
    for (const [selector, value] of [['#wall-start', data.calendar.start], ['#wall-end', data.calendar.end]]) {
      $(selector).textContent = value.replaceAll('-', '.'); $(selector).dateTime = value;
    }
    $('#wall-total').textContent = t('wallDays', { count: new Intl.NumberFormat(i18n.lang).format(total) });
    $('#day-browser-status').textContent = '';
    renderSelection();
    if (returned && !restored && Number.isFinite(previous.scrollY)) {
      restored = true;
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: previous.scrollY, behavior: 'instant' })));
    }
  }).catch(() => { failed = true; $('#day-browser-status').textContent = t('calendarUnavailable'); });
})();
