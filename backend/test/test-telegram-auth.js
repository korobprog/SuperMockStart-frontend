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

async function testTelegramAuth() {
  try {
    console.log('🧪 Тестируем новую реализацию Telegram аутентификации...');

    // Создаем тестовые данные Telegram Web App
    const testInitData =
      'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A1736594064%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%2C%22is_bot%22%3Afalse%7D&auth_date=1754286980&hash=test_hash';

    console.log('📤 Отправляем запрос на аутентификацию...');
    const authResponse = await makeRequest(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/telegram',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        initData: testInitData,
      }
    );

    console.log('📥 Статус ответа:', authResponse.status);
    console.log(
      '📥 Данные ответа:',
      JSON.stringify(authResponse.data, null, 2)
    );

    if (authResponse.status === 200 && authResponse.data.success) {
      const token = authResponse.data.data.token;
      console.log('\n✅ Аутентификация успешна!');
      console.log('🔑 Получен токен:', token.substring(0, 50) + '...');

      // Тестируем расширенный токен
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
        } else {
          console.log('\n❌ API не работает с новым токеном');
        }
      } else {
        console.log('\n❌ Ошибка верификации расширенного токена');
      }
    } else {
      console.log('\n❌ Ошибка аутентификации');
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

testTelegramAuth();
