import http from 'http';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsedData,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testNewAuth() {
  try {
    console.log('🧪 Тестируем новую реализацию аутентификации...');

    // Получаем расширенный токен через существующий эндпоинт
    console.log('📤 Получаем расширенный токен...');
    const tokenResponse = await makeRequest(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/test-token-user',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        userId: '1736594064', // Ваш Telegram ID
      }
    );

    console.log('📥 Статус ответа:', tokenResponse.status);
    console.log(
      '📥 Данные ответа:',
      JSON.stringify(tokenResponse.data, null, 2)
    );

    if (tokenResponse.status === 200 && tokenResponse.data.success) {
      const token = tokenResponse.data.data.token;
      console.log('\n✅ Расширенный токен получен!');
      console.log('🔑 Токен:', token.substring(0, 50) + '...');

      // Тестируем верификацию расширенного токена
      console.log('\n🔍 Тестируем верификацию расширенного токена...');
      const verifyResponse = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/verify-extended-token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📥 Статус верификации:', verifyResponse.status);
      console.log(
        '📥 Данные верификации:',
        JSON.stringify(verifyResponse.data, null, 2)
      );

      if (verifyResponse.status === 200 && verifyResponse.data.success) {
        console.log('\n✅ Расширенный токен работает корректно!');
        console.log(
          '👤 Пользователь:',
          verifyResponse.data.data.firstName,
          verifyResponse.data.data.lastName
        );
        console.log('🆔 ID пользователя:', verifyResponse.data.data.id);

        // Тестируем API с новым токеном
        console.log('\n🧪 Тестируем API с новым токеном...');
        const apiResponse = await makeRequest({
          hostname: 'localhost',
          port: 3001,
          path: '/api/calendar/sessions/test-session-1',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📥 Статус API:', apiResponse.status);
        console.log(
          '📥 Данные API:',
          JSON.stringify(apiResponse.data, null, 2)
        );

        if (apiResponse.status === 200) {
          console.log('\n🎉 Все работает! Долгосрочное решение реализовано!');
          console.log('\n🔧 Для использования в браузере:');
          console.log(`localStorage.setItem("telegram_token", "${token}");`);
          console.log(
            '\n📝 Теперь при аутентификации через Telegram будет автоматически возвращаться расширенный токен!'
          );
        } else {
          console.log('\n❌ API не работает с новым токеном');
        }
      } else {
        console.log('\n❌ Ошибка верификации расширенного токена');
      }
    } else {
      console.log('\n❌ Ошибка получения расширенного токена');
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testNewAuth();
