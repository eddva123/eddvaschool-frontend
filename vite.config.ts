import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Institute tenant URLs: http://demo-school.localhost:5173
  },
  optimizeDeps: {
<<<<<<< HEAD
    include: ['lucide-react'],
=======
    exclude: ['lucide-react'],
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
  },
});
