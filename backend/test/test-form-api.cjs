const https = require('https');
const http = require('http');

async function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testFormAPI() {
  try {
    // Получаем тестовый токен
    const tokenResponse = await makeRequest('http://localhost:3001/api/auth/test-token', {
      method: 'GET'
    });
    
    if (!tokenResponse.data.success) {
      console.error('Ошибка получения токена:', tokenResponse.data.error);
      return;
    }
    
    const token = tokenResponse.data.data.token;
    console.log('Получен токен:', token.substring(0, 50) + '...');
    
    // Тестируем отправку формы
    const formData = {
      profession: 'frontend-developer',
      country: 'RU',
      language: 'ru',
      experience: '0-0',
      email: 'test@example.com'
    };
    
    const formResponse = await makeRequest('http://localhost:3001/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    console.log('Статус ответа:', formResponse.status);
    console.log('Результат:', JSON.stringify(formResponse.data, null, 2));
    
  } catch (error) {
    console.error('Ошибка тестирования:', error);
  }
}

testFormAPI();
