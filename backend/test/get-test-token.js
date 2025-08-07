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

async function getTestToken() {
  try {
    console.log('Получаем расширенный токен для тестового пользователя...');

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
      { userId: 123456789 }
    );

    if (response.status === 200 && response.data.success) {
      const token = response.data.data.token;
      console.log('\n✅ Тестовый расширенный токен получен:');
      console.log(token);

      console.log('\n📋 Информация о пользователе:');
      console.log(JSON.stringify(response.data.data.user, null, 2));

      console.log('\n🔧 Для использования в браузере:');
      console.log('localStorage.setItem("telegram_token", "' + token + '");');

      console.log('\n🌐 Для тестирования API:');
      console.log(
        'curl -H "Authorization: Bearer ' +
          token +
          '" http://localhost:3001/api/calendar/sessions/test-session-1'
      );
    } else {
      console.error('❌ Ошибка получения токена:', response.data.error);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

getTestToken();
