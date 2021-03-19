import React from 'react';
import { render } from 'react-dom';
import App from '@layouts/App'
import { BrowserRouter } from 'react-router-dom'
// 연결법

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
