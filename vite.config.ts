/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import string from 'vite-plugin-string'; // ✅ Correct


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    string({ include: ['**/*.geojson'] }) // ✅ for .geojson files
  ],
  base: "gis-mapping-capstone2025",
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
});
