import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001';

async function testBotAPI() {
  console.log('🔧 Testing bot API...');

  try {
    // Тест 1: Проверяем информацию о боте
    console.log('\n1️⃣ Testing bot info...');
    const botInfoResponse = await fetch(`${API_URL}/api/telegram-bot/info`);
    const botInfo = await botInfoResponse.json();
    console.log('Bot info:', botInfo);

    // Тест 2: Создаем URL для авторизации
    console.log('\n2️⃣ Testing auth URL creation...');
    const authUrlResponse = await fetch(
      `${API_URL}/api/telegram-bot/auth-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 123456,
          redirectUrl: 'http://localhost:5173/bot-auth',
        }),
      }
    );
    const authUrlData = await authUrlResponse.json();
    console.log('Auth URL data:', authUrlData);

    if (authUrlData.success) {
      console.log('✅ Auth URL created successfully');
      console.log('🔗 Auth URL:', authUrlData.data.authUrl);
    } else {
      console.log('❌ Failed to create auth URL:', authUrlData.error);
    }

    // Тест 3: Проверяем, может ли бот отправлять сообщения
    console.log('\n3️⃣ Testing bot message capability...');
    const canSendResponse = await fetch(
      `${API_URL}/api/telegram-bot/can-send-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 123456,
        }),
      }
    );
    const canSendData = await canSendResponse.json();
    console.log('Can send message:', canSendData);
  } catch (error) {
    console.error('❌ Error testing bot API:', error);
  }
}

testBotAPI();
