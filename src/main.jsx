import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(
  (() => {
    const app = document.createElement('div');
    app.className = "h-screen"
    document.body.prepend(app);
    document.body.querySelector("a") ? document.body.querySelector("a").style.display = "none" : null
    return app;
  })(),
).render(
    <App />
);
