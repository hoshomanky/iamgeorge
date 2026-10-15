(() => {
  'use strict';
  const source = document.querySelector('#memories-gallery-data');
  const grid = document.querySelector('[data-memories-gallery]');
  if (!source || !grid || !window.GeorgeDayContent) return;
  // The complete album is already in HTML. Failure leaves ordinary image links.
  try {
    const gallery = JSON.parse(source.textContent);
    if (Array.isArray(gallery)) window.GeorgeDayContent.enhanceGallery(grid, gallery);
  } catch { /* Keep the static photographs and context links available. */ }
})();
