(() => {
  'use strict';
  const palette = document.querySelector('#paper-palette');
  const toggle = document.querySelector('#paper-toggle');
  const colors = { cream: '#fbf7ee', blue: '#eef5fa', pink: '#fcf0ee', green: '#f0f5e9' };
  const setPaper = (paper) => {
    if (!Object.hasOwn(colors, paper)) return;
    document.documentElement.style.setProperty('--paper', colors[paper]);
    document.querySelector('meta[name="theme-color"]').content = colors[paper];
    document.querySelectorAll('.paper-swatch').forEach((button) => {
      const selected = button.dataset.paper === paper;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };
  try { setPaper(localStorage.getItem('iamgeorge-paper') || 'cream'); } catch {}
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

  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('[data-section-link]')];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('.about-prose-section').forEach((section) => observer.observe(section));
  }

  const localizeLabels = () => {
    const english = window.GeorgeI18n?.lang === 'en';
    document.querySelector('.about-name-paper').setAttribute('aria-label', english ? 'About George Fang' : 'George Fang 的基本资料');
    document.querySelector('.about-index nav').setAttribute('aria-label', english ? 'Contents of this note' : '关于页面目录');
    document.querySelector('#about-note').setAttribute('aria-label', english ? 'A note from George’s dad about this website' : '爸爸写的网站说明');
  };
  document.addEventListener('iamgeorge:languagechange', localizeLabels);
  localizeLabels();
})();
