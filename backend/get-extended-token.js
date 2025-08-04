import http from 'http';

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
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

async function getExtendedToken() {
  try {
    // Telegram ID из вашего токена (1736594064)
    const telegramId = '1736594064';

    console.log('Получаем расширенный токен для пользователя...');

    const response = await makeRequest(
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
        userId: telegramId,
      }
    );

    console.log('Статус ответа:', response.status);
    console.log('Данные ответа:', JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.success) {
      console.log('\n✅ Расширенный токен получен!');
      console.log('🔧 Для использования в браузере:');
      console.log(
        `localStorage.setItem("extended_token", "${response.data.data.token}");`
      );
    }
  } catch (error) {
    console.error('Ошибка получения токена:', error);
  }
}

getExtendedToken();
