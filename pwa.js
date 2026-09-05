(() => {
  const manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = 'site.webmanifest';
  document.head.appendChild(manifest);

  const theme = document.createElement('meta');
  theme.name = 'theme-color';
  theme.content = '#07090d';
  document.head.appendChild(theme);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
