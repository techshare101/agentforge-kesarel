import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

const root = createRoot(rootElement);

// Render the app inside StrictMode for development checks
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log("🔥 AgentForge Kesarel initialized");
