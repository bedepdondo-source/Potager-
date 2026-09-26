import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function getHtmlEntries() {
  const entries: Record<string, string> = {
    main: path.resolve(__dirname, 'index.html'),
  };
  const rootFiles = fs.readdirSync(__dirname);
  for (const file of rootFiles) {
    if (file.endsWith('.html') && file !== 'index.html') {
      const name = path.basename(file, '.html');
      entries[name] = path.resolve(__dirname, file);
    }
  }
  const articlesDir = path.resolve(__dirname, 'articles');
  if (fs.existsSync(articlesDir)) {
    const articleFiles = fs.readdirSync(articlesDir);
    for (const file of articleFiles) {
      if (file.endsWith('.html')) {
        const name = `articles_${path.basename(file, '.html')}`;
        entries[name] = path.resolve(articlesDir, file);
      }
    }
  }
  return entries;
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: getHtmlEntries(),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
