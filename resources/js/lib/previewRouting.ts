export function isPreviewMode() {
  return typeof window !== 'undefined' && !(document.getElementById('app')?.dataset.page);
}

export function getPreviewPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  if (!isPreviewMode()) {
    return window.location.pathname;
  }

  const path = new URLSearchParams(window.location.search).get('path');
  return path && path.startsWith('/') ? path : '/';
}

export function getPreviewHref(href: string) {
  if (!isPreviewMode()) {
    return href;
  }

  return `/preview.html?path=${encodeURIComponent(href)}`;
}
