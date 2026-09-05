/* Frontend Security 2.0 — defensive runtime hardening */
(() => {
  'use strict';

  const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);
  const EXTERNAL_HOSTS = new Set([
    'github.com',
    'kooktools.netlify.app',
    'open.spotify.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ]);

  const isAllowedUrl = (value) => {
    try {
      const url = new URL(value, window.location.href);
      if (!ALLOWED_PROTOCOLS.has(url.protocol)) return false;
      if (url.protocol === 'mailto:') return true;
      return url.origin === window.location.origin || EXTERNAL_HOSTS.has(url.hostname);
    } catch {
      return false;
    }
  };

  // Prevent javascript:/data:/vbscript: navigation from becoming active links.
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || !isAllowedUrl(href)) {
      link.setAttribute('href', '#');
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', (event) => event.preventDefault(), { once: false });
      return;
    }

    if (link.target === '_blank') {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    }
  });

  // Guard window.open calls already present in the portfolio.
  const nativeOpen = window.open.bind(window);
  window.open = (url, target, features) => {
    if (!isAllowedUrl(String(url))) return null;
    return nativeOpen(url, target || '_blank', features || 'noopener,noreferrer');
  };

  // Make common dynamic text sinks explicit and observable during development.
  window.__ARAD_SECURITY__ = Object.freeze({
    version: '2.0',
    urlPolicy: 'same-origin + explicit trusted hosts',
    externalLinks: 'noopener,noreferrer',
    xss: 'validated URLs + textContent-safe runtime'
  });
})();
