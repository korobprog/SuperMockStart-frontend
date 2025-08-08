import { PrismaClient } from '@prisma/client';
import { JwtUtils } from '../src/utils/jwt.js';
import { AuthService } from '../src/services/authService.js';

const prisma = new PrismaClient();

// Инициализируем JWT утилиты
JwtUtils.initialize('your-secret-key-change-in-production', '7d');

async function testTokenVerification() {
  try {
    console.log('🔍 Testing token verification...');

    // Получаем тестового пользователя
    const testUser = await prisma.users.findUnique({
      where: { telegramId: '123456789' },
    });

    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    console.log('✅ Test user found:', {
      id: testUser.id,
      telegramId: testUser.telegramId,
      firstName: testUser.firstName,
      role: testUser.role,
    });

    // Генерируем токен для тестового пользователя
    const token = JwtUtils.generateExtendedToken(testUser, 'telegram');
    console.log('🔑 Generated token:', token.substring(0, 50) + '...');

    // Проверяем токен через AuthService
    console.log('🔍 Verifying token through AuthService...');
    const verificationResult = await AuthService.verifyExtendedToken(token);

    console.log('🔍 Verification result:', {
      success: verificationResult.success,
      error: verificationResult.error,
      userFound: !!verificationResult.data,
    });

    if (verificationResult.success && verificationResult.data) {
      console.log('✅ Token verification successful');
      console.log('👤 User data:', {
        id: verificationResult.data.id,
        telegramId: verificationResult.data.telegramId,
        firstName: verificationResult.data.firstName,
        role: verificationResult.data.role,
      });
    } else {
      console.log('❌ Token verification failed:', verificationResult.error);
    }

    // Проверяем токен через JwtUtils
    console.log('🔍 Verifying token through JwtUtils...');
    const jwtPayload = JwtUtils.verifyExtendedToken(token);

    if (jwtPayload) {
      console.log('✅ JWT verification successful');
      console.log('📋 JWT payload:', {
        userId: jwtPayload.userId,
        userDbId: jwtPayload.userDbId,
        authType: jwtPayload.authType,
        role: jwtPayload.role,
        exp: new Date(jwtPayload.exp * 1000).toISOString(),
      });
    } else {
      console.log('❌ JWT verification failed');
    }
  } catch (error) {
    console.error('❌ Token verification test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTokenVerification();
