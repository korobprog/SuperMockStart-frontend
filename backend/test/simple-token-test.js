import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key-change-in-production';

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

function verifyTestToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, payload: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function testToken() {
  console.log('🔍 Testing JWT token generation and verification...');

  // Генерируем токен
  const token = generateTestToken();
  console.log('🔑 Generated token:', token.substring(0, 50) + '...');
  console.log('🔑 Token length:', token.length);

  // Проверяем формат JWT
  const parts = token.split('.');
  console.log('🔍 JWT format check:', {
    hasThreeParts: parts.length === 3,
    partsCount: parts.length,
  });

  // Декодируем payload без верификации
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('📋 JWT payload:', {
      userId: payload.userId,
      userDbId: payload.userDbId,
      authType: payload.authType,
      role: payload.role,
      exp: new Date(payload.exp * 1000).toISOString(),
    });
  } catch (error) {
    console.log('❌ Failed to decode JWT payload:', error.message);
  }

  // Верифицируем токен
  const verification = verifyTestToken(token);
  if (verification.success) {
    console.log('✅ Token verification successful');
    console.log('👤 User data:', {
      userId: verification.payload.userId,
      userDbId: verification.payload.userDbId,
      firstName: verification.payload.firstName,
      role: verification.payload.role,
    });
  } else {
    console.log('❌ Token verification failed:', verification.error);
  }

  // Тестируем с неправильным секретом
  console.log('🔍 Testing with wrong secret...');
  const wrongVerification = jwt.verify(token, 'wrong-secret');
  console.log('❌ This should have failed, but got:', wrongVerification);
}

testToken();
