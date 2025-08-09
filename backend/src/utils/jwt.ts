import jwt, { SignOptions } from 'jsonwebtoken';
import {
  JwtPayload,
  TelegramUser,
  User,
  ExtendedJwtPayload,
  UserRole,
} from '../types/index.js';

export class JwtUtils {
  private static secret: string;
  private static expiresIn: string | number;

  static initialize(secret: string, expiresIn: string | number) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  /**
   * Создает JWT токен для пользователя (для обратной совместимости)
   */
  static generateToken(user: TelegramUser): string {
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  /**
   * Создает расширенный JWT токен для пользователя
   */
  static generateExtendedToken(
    user: User,
    authType: 'email' | 'telegram'
  ): string {
    console.log('🔍 generateExtendedToken called with:', {
      userId: user.id,
      telegramId: user.telegramId,
      authType,
    });

    const payload: ExtendedJwtPayload = {
      userId:
        authType === 'telegram'
          ? parseInt(user.telegramId || '0')
          : parseInt(user.id),
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName,
      role: user.role,
      authType,
      // Добавляем ID пользователя из базы данных для всех типов авторизации
      userDbId: user.id,
    };

    console.log('🔍 JWT payload:', payload);

    const options: SignOptions = { expiresIn: this.expiresIn };
    const token = jwt.sign(payload, this.secret, options);

    console.log('🔍 Generated token:', token.substring(0, 20) + '...');
    console.log('🔍 Token length:', token.length);

    return token;
  }

  /**
   * Создает JWT токен для пользователя Telegram
   */
  static generateTelegramToken(
    user: TelegramUser,
    role: UserRole = UserRole.USER
  ): string {
    const payload: ExtendedJwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      role,
      authType: 'telegram',
    };

    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  /**
   * Создает тестовый JWT токен для разработки
   */
  static generateTestToken(): string {
    const testUser: TelegramUser = {
      id: 123456789,
      is_bot: false,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
    };

    // Создаем расширенный токен для совместимости с middleware
    const payload: ExtendedJwtPayload = {
      userId: testUser.id,
      username: testUser.username,
      firstName: testUser.first_name,
      lastName: testUser.last_name,
      role: UserRole.USER,
      authType: 'telegram',
      userDbId: 'test-user-id', // Тестовый ID пользователя
    };

    const options: SignOptions = { expiresIn: '30d' }; // Тестовый токен на 30 дней
    return jwt.sign(payload, this.secret, options);
  }

  /**
   * Верифицирует JWT токен
   */
  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Верифицирует расширенный JWT токен
   */
  static verifyExtendedToken(token: string): ExtendedJwtPayload | null {
    try {
      console.log('🔍 JwtUtils.verifyExtendedToken called');
      console.log('🔍 token format check:', {
        isJWT: token.split('.').length === 3,
        parts: token.split('.').length,
      });

      const decoded = jwt.verify(token, this.secret) as ExtendedJwtPayload;

      console.log('🔍 JWT decoded successfully:', {
        userId: decoded.userId,
        userDbId: decoded.userDbId,
        authType: decoded.authType,
        role: decoded.role,
      });

      return decoded;
    } catch (error) {
      console.error('❌ Extended JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Проверяет роль пользователя в токене
   */
  static hasRole(token: string, requiredRole: UserRole): boolean {
    try {
      const decoded = this.verifyExtendedToken(token);
      if (!decoded) return false;

      // Администратор имеет доступ ко всем ролям
      if (decoded.role === UserRole.ADMIN) return true;

      return decoded.role === requiredRole;
    } catch (error) {
      console.error('Role verification failed:', error);
      return false;
    }
  }

  /**
   * Проверяет, является ли пользователь администратором
   */
  static isAdmin(token: string): boolean {
    return this.hasRole(token, UserRole.ADMIN);
  }

  /**
   * Декодирует JWT токен без верификации (для отладки)
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }

  /**
   * Проверяет, истек ли токен
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
