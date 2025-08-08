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

async function testTokenAPI() {
  try {
    console.log('🔍 Testing token API endpoints...');

    // Генерируем тестовый токен
    const token = generateTestToken();
    console.log('🔑 Generated test token:', token.substring(0, 50) + '...');

    // Тест 1: Проверяем /api/auth/verify
    console.log('\n🔍 Testing /api/auth/verify...');
    const verifyResponse = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const verifyData = await verifyResponse.json();
    console.log('📊 Verify response status:', verifyResponse.status);
    console.log('📊 Verify response data:', verifyData);

    // Тест 2: Проверяем /api/auth/verify-extended-token
    console.log('\n🔍 Testing /api/auth/verify-extended-token...');
    const extendedResponse = await fetch(
      `${API_URL}/api/auth/verify-extended-token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const extendedData = await extendedResponse.json();
    console.log('📊 Extended verify response status:', extendedResponse.status);
    console.log('📊 Extended verify response data:', extendedData);

    // Тест 3: Проверяем /api/form (должен вернуть 401 если токен недействителен)
    console.log('\n🔍 Testing /api/form...');
    const formResponse = await fetch(`${API_URL}/api/form`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const formData = await formResponse.json();
    console.log('📊 Form response status:', formResponse.status);
    console.log('📊 Form response data:', formData);

    // Анализ результатов
    console.log('\n📋 Analysis:');
    if (verifyResponse.status === 200 && verifyData.success) {
      console.log('✅ /api/auth/verify - SUCCESS');
    } else {
      console.log('❌ /api/auth/verify - FAILED');
    }

    if (extendedResponse.status === 200 && extendedData.success) {
      console.log('✅ /api/auth/verify-extended-token - SUCCESS');
    } else {
      console.log('❌ /api/auth/verify-extended-token - FAILED');
    }

    if (formResponse.status === 200) {
      console.log('✅ /api/form - SUCCESS');
    } else if (formResponse.status === 401) {
      console.log('❌ /api/form - UNAUTHORIZED (token issue)');
    } else {
      console.log(`❌ /api/form - FAILED (status: ${formResponse.status})`);
    }
  } catch (error) {
    console.error('❌ API test error:', error);
  }
}

testTokenAPI();
