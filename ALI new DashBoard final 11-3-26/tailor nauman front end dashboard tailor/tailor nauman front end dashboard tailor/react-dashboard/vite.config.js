import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['firebase', 'firebase/firestore', 'firebase/app', 'firebase/analytics'],
  },
  server: {
    port: 5176,
  },
});
