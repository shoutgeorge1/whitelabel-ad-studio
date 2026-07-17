import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ProductApp from './product/ProductApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.startsWith('/studio') ? <ProductApp /> : <App />}
  </StrictMode>
);
