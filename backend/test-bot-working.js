import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001';

async function testBotWorking() {
  console.log('🔧 Testing if bot is working...');

  try {
    // Ждем немного, чтобы бэкенд запустился
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Тест 1: Проверяем информацию о боте
    console.log('\n1️⃣ Testing bot info...');
    const botInfoResponse = await fetch(`${API_URL}/api/telegram-bot/info`);

    if (botInfoResponse.ok) {
      const botInfo = await botInfoResponse.json();
      console.log('✅ Bot info:', botInfo);
    } else {
      console.log('❌ Bot info failed:', botInfoResponse.status);
    }

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

    if (authUrlResponse.ok) {
      const authUrlData = await authUrlResponse.json();
      console.log('✅ Auth URL created successfully');
      console.log('🔗 Auth URL:', authUrlData.data.authUrl);

      // Показываем инструкцию для тестирования
      console.log('\n📋 To test the bot:');
      console.log(
        '1. Open this URL in your browser:',
        authUrlData.data.authUrl
      );
      console.log('2. Send /start to the bot');
      console.log('3. Check if the bot sends an auth message');
    } else {
      console.log('❌ Failed to create auth URL:', authUrlResponse.status);
    }
  } catch (error) {
    console.error('❌ Error testing bot:', error);
  }
}

testBotWorking();
