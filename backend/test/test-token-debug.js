import fetch from 'node-fetch';

async function testTokenDebug() {
  try {
    console.log('🔍 Тестирование токена...');

    // Получаем тестовый токен
    console.log('📝 Получаем тестовый токен...');
    const tokenResponse = await fetch(
      `${
        process.env.VITE_API_URL || 'http://localhost:3001'
      }/api/auth/test-token`,
      {
        method: 'GET',
      }
    );

    if (!tokenResponse.ok) {
      console.error(
        '❌ Ошибка получения токена:',
        tokenResponse.status,
        tokenResponse.statusText
      );
      const errorData = await tokenResponse.text();
      console.error('Ошибка:', errorData);
      return;
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Токен получен:', tokenData.success ? 'успешно' : 'ошибка');

    if (!tokenData.success) {
      console.error('❌ Ошибка в ответе токена:', tokenData.error);
      return;
    }

    const token = tokenData.data.token;
    console.log('🔑 Токен:', token.substring(0, 50) + '...');

    // Тестируем верификацию токена
    console.log('🔍 Тестируем верификацию токена...');
    const verifyResponse = await fetch(
      `${process.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      '📊 Verify статус:',
      verifyResponse.status,
      verifyResponse.statusText
    );
    const verifyData = await verifyResponse.json();
    console.log('📊 Verify данные:', JSON.stringify(verifyData, null, 2));

    // Тестируем верификацию расширенного токена
    console.log('🔍 Тестируем верификацию расширенного токена...');
    const verifyExtendedResponse = await fetch(
      `${
        process.env.VITE_API_URL || 'http://localhost:3001'
      }/api/auth/verify-extended-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      '📊 Verify Extended статус:',
      verifyExtendedResponse.status,
      verifyExtendedResponse.statusText
    );
    const verifyExtendedData = await verifyExtendedResponse.json();
    console.log(
      '📊 Verify Extended данные:',
      JSON.stringify(verifyExtendedData, null, 2)
    );
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testTokenDebug();
