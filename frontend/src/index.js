import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// We don't import index.css here because we put all styles in App.css for you

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);