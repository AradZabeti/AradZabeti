(() => {
  'use strict';

  const init = () => {
    const body = document.body;
    if (!body) return;

    // Skip repeated navigation for keyboard and assistive-technology users.
    if (!document.getElementById('a11y-skip-link')) {
      const skip = document.createElement('a');
      skip.id = 'a11y-skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Skip to main content';
      Object.assign(skip.style, {
        position: 'fixed', left: '12px', top: '12px', zIndex: '10000',
        padding: '10px 14px', borderRadius: '10px', background: '#f7f7fb',
        color: '#08080c', font: '600 12px Inter, system-ui, sans-serif',
        transform: 'translateY(-180%)', transition: 'transform .2s ease',
        textDecoration: 'none'
      });
      skip.addEventListener('focus', () => { skip.style.transform = 'translateY(0)'; });
      skip.addEventListener('blur', () => { skip.style.transform = 'translateY(-180%)'; });
      body.prepend(skip);
    }

    const main = document.querySelector('main') || document.querySelector('.wrap');
    if (main && !main.id) main.id = 'main-content';
    if (main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');

    // Make decorative images explicitly decorative and ensure meaningful images have alt text.
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) img.setAttribute('alt', '');
      if (!img.getAttribute('alt') && !img.hasAttribute('aria-hidden')) img.setAttribute('aria-hidden', 'true');
    });

    // Give icon-only controls an accessible name without overriding existing labels.
    document.querySelectorAll('button, a').forEach((el) => {
      if (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) return;
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) return;
      const title = el.getAttribute('title');
      if (title) el.setAttribute('aria-label', title);
    });

    // Keyboard-visible focus indicator.
    if (!document.getElementById('a11y-style')) {
      const style = document.createElement('style');
      style.id = 'a11y-style';
      style.textContent = `
        :where(a,button,input,select,textarea,[tabindex]):focus-visible {
          outline: 2px solid #67e8f9 !important;
          outline-offset: 3px !important;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Announce dynamic status updates when a status node already exists.
    document.querySelectorAll('.statusline, [data-status]').forEach((el) => {
      if (!el.hasAttribute('aria-live')) el.setAttribute('aria-live', 'polite');
    });

    // Keep modal dialogs discoverable to assistive technologies when opened by the existing UI.
    document.querySelectorAll('.modal').forEach((modal) => {
      if (!modal.hasAttribute('role')) modal.setAttribute('role', 'dialog');
      if (!modal.hasAttribute('aria-modal')) modal.setAttribute('aria-modal', 'true');
      if (!modal.hasAttribute('aria-label')) modal.setAttribute('aria-label', 'Interactive dialog');
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
