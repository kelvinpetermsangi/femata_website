import './bootstrap';

import type { Page } from '@inertiajs/core';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './hooks/useLanguage';
import {
    defaultContactInfo,
    defaultSiteBranding,
    defaultSiteFooter,
} from './lib/siteDefaults';
import { ThemeProvider } from './hooks/useTheme';
import { getPreviewPage } from './lib/preview';
import { getPreviewPath, isPreviewMode } from './lib/previewRouting';

const appName = import.meta.env.VITE_APP_NAME || 'FEMATA';
const el = document.getElementById('app');
const previewPath = getPreviewPath();
const previewState = isPreviewMode() ? getPreviewPage(previewPath) : null;
const previewPage: Page | undefined = previewState
    ? {
          component: previewState.component,
          props: {
              ...previewState.props,
              errors: {},
              auth: {
                  user: null,
              },
              flash: {
                  success: null,
                  error: null,
              },
              siteBranding: defaultSiteBranding,
              siteFooter: defaultSiteFooter,
              siteContact: defaultContactInfo,
          },
          url: previewPath,
          version: null,
          clearHistory: false,
          encryptHistory: false,
          flash: {},
          rememberedState: {},
      }
    : undefined;

createInertiaApp({
    page: previewPage,
    title: (title) => (title ? `${title} | ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <LanguageProvider>
                    <App {...props} />
                </LanguageProvider>
            </ThemeProvider>,
        );
    },
    progress: {
        color: '#b88a2e',
    },
});
