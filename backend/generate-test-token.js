import { JwtUtils } from './src/utils/jwt.js';
import { UserService } from './src/services/userService.js';

async function generateTestToken() {
  try {
    // Создаем или находим тестового пользователя
    const userResult = await UserService.findOrCreateTelegramUser({
      id: 123456789,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    });

    if (!userResult.success || !userResult.data) {
      console.error('Ошибка создания пользователя:', userResult.error);
      return;
    }

    // Генерируем расширенный токен
    const token = JwtUtils.generateExtendedToken(userResult.data, 'telegram');

    console.log('Тестовый расширенный токен:');
    console.log(token);
    console.log('\nПользователь:');
    console.log(JSON.stringify(userResult.data, null, 2));

    // Декодируем токен для проверки
    const decoded = JwtUtils.verifyExtendedToken(token);
    console.log('\nДекодированный токен:');
    console.log(JSON.stringify(decoded, null, 2));
  } catch (error) {
    console.error('Ошибка генерации токена:', error);
  }
}

generateTestToken();
