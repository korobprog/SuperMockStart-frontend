import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.tsx';
// import './styles/calendar.scss';
import '/src/styles/tailwind.css';
import { cleanupInvalidData } from './utils/auth';
import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    
    // In production, also log to console for debugging
    if (process.env.NODE_ENV === 'production') {
      console.error('Production React Error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'sans-serif',
          background: '#f5f5f5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>
            Что-то пошло не так
          </h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Произошла ошибка при загрузке приложения. Попробуйте обновить страницу.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Обновить страницу
          </button>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#d32f2f' }}>
                Подробности ошибки (только в режиме разработки)
              </summary>
              <pre style={{ 
                background: '#fafafa', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '12px',
                overflow: 'auto',
                maxWidth: '80vw'
              }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize Telegram WebApp if available
if (window.Telegram?.WebApp) {
  try {
    window.Telegram.WebApp.ready();
    console.log('Telegram WebApp initialized');
  } catch (error) {
    console.warn('Failed to initialize Telegram WebApp:', error);
  }
}

// Очищаем некорректные данные из localStorage при инициализации приложения
cleanupInvalidData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);
