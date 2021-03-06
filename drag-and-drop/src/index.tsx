import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as App from 'src/containers/app';

const root = ReactDOMClient.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App.Component />
  </React.StrictMode>
);
