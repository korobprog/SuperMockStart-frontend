const fetch = require('node-fetch');

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

async function testBotAuth() {
  try {
    console.log('🧪 Testing bot authentication in dev mode...\n');

    // Генерируем случайный userId для тестирования
    const userId = Math.floor(Math.random() * 1000000) + 100000;
    console.log(`📱 Using test userId: ${userId}`);

    // 1. Создаем URL для авторизации
    console.log('\n1️⃣ Creating auth URL...');
    const authUrlResponse = await fetch(
      `${API_URL}/api/telegram-bot/auth-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          redirectUrl: 'http://localhost:5173/auth-callback',
        }),
      }
    );

    if (!authUrlResponse.ok) {
      throw new Error(`Failed to create auth URL: ${authUrlResponse.status}`);
    }

    const authUrlData = await authUrlResponse.json();
    console.log('✅ Auth URL created successfully');
    console.log(`🔗 Auth URL: ${authUrlData.data.authUrl}`);

    // 2. Проверяем, может ли бот отправлять сообщения пользователю
    console.log('\n2️⃣ Checking if bot can send messages...');
    const canSendResponse = await fetch(
      `${API_URL}/api/telegram-bot/can-send-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (canSendResponse.ok) {
      const canSendData = await canSendResponse.json();
      console.log(`✅ Bot can send messages: ${canSendData.success}`);
    } else {
      console.log(
        '❌ Bot cannot send messages (this is expected if user has not started the bot)'
      );
    }

    // 3. Пытаемся верифицировать пользователя
    console.log('\n3️⃣ Attempting to verify user...');
    const verifyResponse = await fetch(
      `${API_URL}/api/telegram-bot/verify-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ User verification successful');
      console.log(`👤 User: ${JSON.stringify(verifyData.data.user, null, 2)}`);
      console.log(`🔑 Token: ${verifyData.data.token.substring(0, 20)}...`);
    } else {
      const errorData = await verifyResponse.json();
      console.log(`❌ User verification failed: ${errorData.error}`);
    }

    console.log('\n🎉 Test completed!');
    console.log('\n📝 Instructions:');
    console.log('1. Open the auth URL in your browser');
    console.log('2. Start the bot with /start command');
    console.log('3. Follow the authentication flow');
    console.log('4. Check the console for detailed logs');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBotAuth();
