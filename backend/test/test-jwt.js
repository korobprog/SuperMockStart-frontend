import { JwtUtils } from '../src/utils/jwt.ts';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Инициализируем JWT утилиты
JwtUtils.initialize(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  process.env.JWT_EXPIRES_IN || '7d'
);

async function testJWT() {
  try {
    console.log('🔍 Тестирование JWT токенов...');

    // Тест 1: Генерация простого токена
    console.log('\n📝 Тест 1: Генерация простого токена');
    const testUser = {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
    };

    const simpleToken = JwtUtils.generateToken(testUser);
    console.log(
      '✅ Простой токен сгенерирован:',
      simpleToken.substring(0, 50) + '...'
    );

    // Тест 2: Верификация простого токена
    console.log('\n🔍 Тест 2: Верификация простого токена');
    const verifiedSimple = JwtUtils.verifyToken(simpleToken);
    console.log('✅ Простой токен верифицирован:', verifiedSimple);

    // Тест 3: Генерация расширенного токена
    console.log('\n📝 Тест 3: Генерация расширенного токена');
    const extendedUser = {
      id: '1',
      telegramId: '123456789',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    };

    const extendedToken = JwtUtils.generateExtendedToken(
      extendedUser,
      'telegram'
    );
    console.log(
      '✅ Расширенный токен сгенерирован:',
      extendedToken.substring(0, 50) + '...'
    );

    // Тест 4: Верификация расширенного токена
    console.log('\n🔍 Тест 4: Верификация расширенного токена');
    const verifiedExtended = JwtUtils.verifyExtendedToken(extendedToken);
    console.log('✅ Расширенный токен верифицирован:', verifiedExtended);

    // Тест 5: Тестовый токен
    console.log('\n📝 Тест 5: Генерация тестового токена');
    const testToken = JwtUtils.generateTestToken();
    console.log(
      '✅ Тестовый токен сгенерирован:',
      testToken.substring(0, 50) + '...'
    );

    // Тест 6: Верификация тестового токена
    console.log('\n🔍 Тест 6: Верификация тестового токена');
    const verifiedTest = JwtUtils.verifyToken(testToken);
    console.log('✅ Тестовый токен верифицирован:', verifiedTest);

    // Тест 7: Проверка истечения токена
    console.log('\n⏰ Тест 7: Проверка истечения токена');
    const isExpired = JwtUtils.isTokenExpired(testToken);
    console.log('✅ Токен истек:', isExpired);

    // Тест 8: Декодирование токена
    console.log('\n🔓 Тест 8: Декодирование токена');
    const decoded = JwtUtils.decodeToken(testToken);
    console.log('✅ Токен декодирован:', decoded);

    console.log('\n🎉 Все тесты JWT прошли успешно!');
  } catch (error) {
    console.error('❌ Ошибка в тестах JWT:', error);
  }
}

testJWT();
