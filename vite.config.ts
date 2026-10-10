import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { testSelectionProbes } from '@variance-authority/sense/journal';

export default defineConfig({
  plugins: [react(), testSelectionProbes()],
  // A fixed port, so e2e.config.ts knows where the app is.
  server: { port: 5173, strictPort: true },
});
