import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ERPProvider } from './context/ERPContext.jsx';
import { AgentProvider } from './context/AgentContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ERPProvider>
        <AgentProvider>
          <App />
        </AgentProvider>
      </ERPProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
