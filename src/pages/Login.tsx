import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getBotUsername } from '../utils/telegramConfig';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bot = getBotUsername() || 'SuperMock_bot';

  useEffect(() => {
    setError(null);
    // Define global callback for Telegram widget
    (window as any).onTelegramAuth = async (userData: any) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/telegram-widget`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(userData),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.success === false) {
          throw new Error(data?.error || 'Auth failed');
        }
        const returnTo = searchParams.get('returnTo') || '/';
        navigate(returnTo);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Auth error');
      }
    };

    // Inject Telegram widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    (script as any).setAttribute('data-telegram-login', bot);
    (script as any).setAttribute('data-size', 'large');
    (script as any).setAttribute('data-userpic', 'false');
    (script as any).setAttribute('data-request-access', 'write');
    (script as any).setAttribute('data-onauth', 'onTelegramAuth(user)');

    const node = containerRef.current;
    if (node) node.innerHTML = '';
    node?.appendChild(script);

    return () => {
      if (node) node.innerHTML = '';
      delete (window as any).onTelegramAuth;
    };
  }, [bot, navigate, searchParams]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Вход через Telegram</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div ref={containerRef} className="flex items-center justify-center" />
          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}
          <Button variant="ghost" onClick={() => navigate('/')}>На главную</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;