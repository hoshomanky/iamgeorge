(() => {
  'use strict';
  const source = document.querySelector('#memories-gallery-data');
  const grid = document.querySelector('[data-memories-gallery]');
  if (!source || !grid || !window.GeorgeDayContent) return;
  // Image/title links open the day. Only separate enlargement links use the viewer.
  try {
    const gallery = JSON.parse(source.textContent);
    if (Array.isArray(gallery)) window.GeorgeDayContent.enhanceGallery(grid, gallery);
  } catch { /* Keep the static photographs and context links available. */ }
})();
