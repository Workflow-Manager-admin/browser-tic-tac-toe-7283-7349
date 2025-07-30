import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Mount full modern Tic-Tac-Toe UI
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
