import React from 'react';
import ReactDOM from 'react-dom/client';
import * as App from 'src/components/app';
import 'src/assets/styles/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App.Component />
  </React.StrictMode>
);
