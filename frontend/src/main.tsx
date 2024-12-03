import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> 화상채팅 때문에 제거해봄
  <App />,
  // </React.StrictMode>,
);
