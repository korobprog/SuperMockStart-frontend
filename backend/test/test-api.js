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

async function testAPI() {
  try {
    // Получаем расширенный токен
    console.log('Получаем расширенный токен...');
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
      { userId: 123456789 }
    );

    console.log(
      'Токен получен:',
      tokenResponse.status,
      tokenResponse.data.success ? 'Успешно' : 'Ошибка'
    );

    if (!tokenResponse.data.success) {
      console.error('Ошибка получения токена:', tokenResponse.data.error);
      return;
    }

    const token = tokenResponse.data.data.token;
    console.log('Токен:', token.substring(0, 50) + '...');

    // Тестируем получение сессии
    console.log('\nТестируем получение сессии...');
    const sessionResponse = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/calendar/sessions/test-session-1',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(
      'Сессия получена:',
      sessionResponse.status,
      sessionResponse.data.success ? 'Успешно' : 'Ошибка'
    );

    if (sessionResponse.data.success) {
      console.log(
        'Данные сессии:',
        JSON.stringify(sessionResponse.data.data, null, 2)
      );
    } else {
      console.error('Ошибка получения сессии:', sessionResponse.data.error);
    }

    // Тестируем получение отзывов
    console.log('\nТестируем получение отзывов...');
    const feedbackResponse = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/feedback/sessions/test-session-1',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(
      'Отзывы получены:',
      feedbackResponse.status,
      feedbackResponse.data.success ? 'Успешно' : 'Ошибка'
    );

    if (feedbackResponse.data.success) {
      console.log(
        'Данные отзывов:',
        JSON.stringify(feedbackResponse.data.data, null, 2)
      );
    } else {
      console.error('Ошибка получения отзывов:', feedbackResponse.data.error);
    }
  } catch (error) {
    console.error('Ошибка тестирования API:', error);
  }
}

testAPI();
