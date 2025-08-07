import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TelegramDevPanelProps {
  onAuthSuccess?: (user: any) => void;
  onAuthError?: (error: string) => void;
}

const TelegramDevPanel: React.FC<TelegramDevPanelProps> = ({
  onAuthSuccess,
  onAuthError,
}) => {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    id: '123456789',
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    photo_url: '',
    auth_date: Math.floor(Date.now() / 1000).toString(),
    hash: 'test_hash',
  });

  const testTelegramAuth = async () => {
    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || 'https://api.supermock.ru';

      const response = await fetch(`${API_URL}/api/auth/telegram-widget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(testData.id),
          first_name: testData.first_name,
          last_name: testData.last_name,
          username: testData.username,
          photo_url: testData.photo_url,
          auth_date: parseInt(testData.auth_date),
          hash: testData.hash,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Test auth successful:', data);
        onAuthSuccess?.(data.data.user);
      } else {
        console.error('❌ Test auth failed:', data);
        onAuthError?.(data.error || 'Test authentication failed');
      }
    } catch (error) {
      console.error('❌ Test auth error:', error);
      onAuthError?.('Test authentication error');
    } finally {
      setLoading(false);
    }
  };

  const updateTestData = (field: string, value: string) => {
    setTestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Telegram Auth Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-id">User ID</Label>
          <Input
            id="test-id"
            value={testData.id}
            onChange={(e) => updateTestData('id', e.target.value)}
            placeholder="123456789"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-first-name">First Name</Label>
          <Input
            id="test-first-name"
            value={testData.first_name}
            onChange={(e) => updateTestData('first_name', e.target.value)}
            placeholder="Test"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-last-name">Last Name</Label>
          <Input
            id="test-last-name"
            value={testData.last_name}
            onChange={(e) => updateTestData('last_name', e.target.value)}
            placeholder="User"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-username">Username</Label>
          <Input
            id="test-username"
            value={testData.username}
            onChange={(e) => updateTestData('username', e.target.value)}
            placeholder="testuser"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-auth-date">Auth Date</Label>
          <Input
            id="test-auth-date"
            value={testData.auth_date}
            onChange={(e) => updateTestData('auth_date', e.target.value)}
            placeholder={Math.floor(Date.now() / 1000).toString()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-hash">Hash</Label>
          <Input
            id="test-hash"
            value={testData.hash}
            onChange={(e) => updateTestData('hash', e.target.value)}
            placeholder="test_hash"
          />
        </div>
        <Button
          onClick={testTelegramAuth}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Telegram Auth'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TelegramDevPanel;
