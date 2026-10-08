import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { initAuthStorage } from './utils/authUtils';

// Global styles
import "./assets/css/global.css";
import Router from './Router';

initAuthStorage();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
)