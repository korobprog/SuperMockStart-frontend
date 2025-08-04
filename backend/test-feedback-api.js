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

async function testFeedbackAPI() {
  try {
    // Новый токен
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1Njc4OSwidXNlcm5hbWUiOiJ0ZXN0XzEyMzQ1Njc4OSIsImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlVzZXIiLCJhdXRoVHlwZSI6InRlbGVncmFtIiwiaWF0IjoxNzU0Mjg2OTgwLCJleHAiOjE3NTQ4OTE3ODB9.lXnXWkzEEmbDJHdoYhwyQAyXkF3C8an2HvgSsC1W6A4';

    console.log('Тестируем получение отзывов с новым токеном...');

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

    console.log('Статус ответа:', feedbackResponse.status);
    console.log(
      'Данные ответа:',
      JSON.stringify(feedbackResponse.data, null, 2)
    );
  } catch (error) {
    console.error('Ошибка тестирования API:', error);
  }
}

testFeedbackAPI();
