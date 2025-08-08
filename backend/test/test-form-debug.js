const fetch = require('node-fetch');

async function testFormAPI() {
  try {
    console.log('🔍 Тестирование API формы...');

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

    // Тестируем GET запрос к форме
    console.log('📋 Тестируем GET /api/form...');
    const getResponse = await fetch(
      `${process.env.VITE_API_URL || 'http://localhost:3001'}/api/form`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('📊 GET статус:', getResponse.status, getResponse.statusText);
    const getData = await getResponse.json();
    console.log('📊 GET данные:', JSON.stringify(getData, null, 2));

    // Тестируем POST запрос к форме
    console.log('📝 Тестируем POST /api/form...');
    const formData = {
      profession: 'frontend-developer',
      country: 'RU',
      language: 'ru',
      experience: '1-3',
      email: 'test@example.com',
      phone: '+7 (999) 123-45-67',
    };

    const postResponse = await fetch(
      `${process.env.VITE_API_URL || 'http://localhost:3001'}/api/form`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    console.log(
      '📊 POST статус:',
      postResponse.status,
      postResponse.statusText
    );
    const postData = await postResponse.json();
    console.log('📊 POST данные:', JSON.stringify(postData, null, 2));
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testFormAPI();
