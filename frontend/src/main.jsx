

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import Tailwind-enabled CSS file
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Import the translation setup

ReactDOM.createRoot(document.getElementById("root")).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);
