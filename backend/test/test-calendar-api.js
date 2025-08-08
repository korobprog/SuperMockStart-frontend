import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key-change-in-production';
const API_URL = 'http://localhost:3001';

// Тестовые данные пользователя
const testUser = {
  id: 'user-1754639736402-is5cno2co',
  telegramId: '123456789',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER',
};

function generateTestToken() {
  const payload = {
    userId: parseInt(testUser.telegramId),
    username: testUser.username,
    firstName: testUser.firstName,
    lastName: testUser.lastName,
    role: testUser.role,
    authType: 'telegram',
    userDbId: testUser.id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 дней
  };

  return jwt.sign(payload, JWT_SECRET);
}

async function testCalendarAPI() {
  try {
    console.log('🔍 Testing calendar API endpoints...');

    // Генерируем тестовый токен
    const token = generateTestToken();
    console.log('🔑 Generated test token:', token.substring(0, 50) + '...');

    // Тест 1: Проверяем /api/calendar/slots/:profession
    console.log('\n🔍 Testing /api/calendar/slots/javascript...');
    const slotsResponse = await fetch(
      `${API_URL}/api/calendar/slots/javascript`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const slotsData = await slotsResponse.json();
    console.log('📊 Slots response status:', slotsResponse.status);
    console.log('📊 Slots response data:', slotsData);

    // Тест 2: Проверяем /api/calendar/queue (POST)
    console.log('\n🔍 Testing /api/calendar/queue (POST)...');
    const queueData = {
      profession: 'javascript',
      preferredDateTime: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(), // Завтра
      queueType: 'CANDIDATE',
    };

    const queueResponse = await fetch(`${API_URL}/api/calendar/queue`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queueData),
    });

    const queueResponseData = await queueResponse.json();
    console.log('📊 Queue response status:', queueResponse.status);
    console.log('📊 Queue response data:', queueResponseData);

    // Тест 3: Проверяем /api/calendar/queue/status
    console.log('\n🔍 Testing /api/calendar/queue/status...');
    const statusResponse = await fetch(`${API_URL}/api/calendar/queue/status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const statusData = await statusResponse.json();
    console.log('📊 Status response status:', statusResponse.status);
    console.log('📊 Status response data:', statusData);

    // Анализ результатов
    console.log('\n📋 Analysis:');
    if (slotsResponse.status === 200 && slotsData.success) {
      console.log('✅ /api/calendar/slots - SUCCESS');
    } else {
      console.log('❌ /api/calendar/slots - FAILED');
    }

    if (queueResponse.status === 200 && queueResponseData.success) {
      console.log('✅ /api/calendar/queue (POST) - SUCCESS');
    } else {
      console.log('❌ /api/calendar/queue (POST) - FAILED');
    }

    if (statusResponse.status === 200 && statusData.success) {
      console.log('✅ /api/calendar/queue/status - SUCCESS');
    } else {
      console.log('❌ /api/calendar/queue/status - FAILED');
    }
  } catch (error) {
    console.error('❌ Calendar API test error:', error);
  }
}

testCalendarAPI();
