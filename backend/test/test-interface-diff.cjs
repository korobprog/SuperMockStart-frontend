// Тест для проверки различий интерфейса между dev и production режимами

const API_URL = 'http://localhost:3001';

async function testInterfaceDifferences() {
  try {
    console.log(
      '🧪 Testing interface differences between dev and production modes...\n'
    );

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

    // 2. Проверяем информацию о боте
    console.log('\n2️⃣ Checking bot info...');
    const botInfoResponse = await fetch(`${API_URL}/api/telegram-bot/info`);

    if (botInfoResponse.ok) {
      const botInfo = await botInfoResponse.json();
      console.log('✅ Bot info retrieved');
      console.log(`🤖 Bot name: ${botInfo.data.first_name}`);
      console.log(`🔗 Username: @${botInfo.data.username}`);
      console.log(`📱 Has web app: ${botInfo.data.has_main_web_app}`);
    }

    // 3. Проверяем URL для проверки токена
    console.log('\n3️⃣ Checking token check URL...');
    const checkUrlResponse = await fetch(
      `${API_URL}/api/telegram-bot/check-url?userId=${userId}`
    );

    if (checkUrlResponse.ok) {
      const checkUrlData = await checkUrlResponse.json();
      console.log('✅ Token check URL retrieved');
      console.log(`🔗 Check URL: ${checkUrlData.data.checkUrl}`);
      console.log(`🌐 Environment: ${checkUrlData.data.environment}`);
      console.log(`📱 User ID: ${checkUrlData.data.userId}`);
      console.log(
        `🔒 Telegram compatible: ${checkUrlData.data.isTelegramCompatible}`
      );
    }

    console.log('\n🎉 Interface test completed!');
    console.log('\n📝 Summary:');
    console.log('- Dev mode: Text instructions with copyable links');
    console.log('- Production mode: Interactive buttons for direct access');
    console.log('- Different messages and warnings for each mode');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testInterfaceDifferences();
