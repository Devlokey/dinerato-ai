import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { ERPProvider } from './context/ERPContext.jsx';
import { AgentProvider } from './context/AgentContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ERPProvider>
        <AgentProvider>
          <App />
        </AgentProvider>
      </ERPProvider>
    </HashRouter>
  </React.StrictMode>,
);
