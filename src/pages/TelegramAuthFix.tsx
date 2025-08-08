import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const TelegramAuthFix: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // no-op
  }, []);

  const validateToken = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMessage(JSON.stringify(data));
    } catch (e) {
      setMessage('Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const getTestToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/test-token`);
      const data = await response.json();
      setMessage(JSON.stringify(data));
    } catch (e) {
      setMessage('Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Auth Fix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={validateToken} disabled={loading}>
            Validate Token
          </Button>
          <Button onClick={getTestToken} variant="outline" disabled={loading}>
            Get Test Token
          </Button>
          <Button onClick={() => navigate('/')} variant="ghost">
            На главную
          </Button>
          {message && <pre className="text-xs whitespace-pre-wrap">{message}</pre>}
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuthFix;
