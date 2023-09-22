import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { client } from './config/apollo.ts';
import { GlobalStateProvider } from '@/hooks';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <GlobalStateProvider>
          <App />
        </GlobalStateProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
