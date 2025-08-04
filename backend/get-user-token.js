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

async function getUserToken() {
  try {
    console.log('🔑 Получаем расширенный токен для пользователя 1033361917...');

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
        userId: '1033361917', // Ваш Telegram ID
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

      // Декодируем токен для проверки
      try {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        );
        console.log('\n🔍 Декодированный токен:');
        console.log('  userId:', payload.userId);
        console.log('  userDbId:', payload.userDbId);
        console.log('  authType:', payload.authType);
        console.log('  username:', payload.username);
        console.log('  firstName:', payload.firstName);
        console.log('  lastName:', payload.lastName);
      } catch (error) {
        console.error('❌ Ошибка декодирования токена:', error);
      }

      console.log('\n🔧 Для использования в браузере:');
      console.log(`localStorage.setItem("telegram_token", "${token}");`);
      console.log('\n📝 Или для extended_token:');
      console.log(`localStorage.setItem("extended_token", "${token}");`);

      console.log(
        '\n🎯 Теперь кнопка "Завершить собеседование" должна работать!'
      );
    } else {
      console.log('\n❌ Ошибка получения токена');
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

getUserToken();
