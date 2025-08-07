import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.tsx';
import './styles/tailwind.css';
import './styles/calendar.scss';
import { cleanupInvalidData } from './utils/auth';

// Очищаем некорректные данные из localStorage при инициализации приложения
cleanupInvalidData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
