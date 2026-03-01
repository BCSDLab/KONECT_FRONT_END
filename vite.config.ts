import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryRelease = process.env.SENTRY_RELEASE;

const shouldUploadSourcemaps = Boolean(sentryOrg && sentryProject && sentryAuthToken);

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: shouldUploadSourcemaps ? 'hidden' : false,
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    svgr({ include: '**/*.svg' }),
    ...(shouldUploadSourcemaps
      ? [
          sentryVitePlugin({
            org: sentryOrg,
            project: sentryProject,
            authToken: sentryAuthToken,
            telemetry: false,
            release: sentryRelease ? { name: sentryRelease } : undefined,
            sourcemaps: {
              filesToDeleteAfterUpload: ['dist/**/*.map'],
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
  },
});
