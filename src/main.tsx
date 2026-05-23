import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
<<<<<<< HEAD
import { Toaster } from 'react-hot-toast';
=======
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
<<<<<<< HEAD
    <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
=======
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
  </StrictMode>
);
