import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload, TelegramUser, User, ExtendedJwtPayload, UserRole } from '../types/index.js';

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
  static generateExtendedToken(user: User, authType: 'email' | 'telegram'): string {
    const payload: ExtendedJwtPayload = {
      userId: authType === 'telegram' ? parseInt(user.telegramId || '0') : user.id,
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName,
      role: user.role,
      authType,
      // Для email авторизации добавляем ID пользователя в отдельное поле
      ...(authType === 'email' && { userDbId: user.id }),
    };

    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  /**
   * Создает JWT токен для пользователя Telegram
   */
  static generateTelegramToken(user: TelegramUser, role: UserRole = UserRole.USER): string {
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

    const payload: JwtPayload = {
      userId: testUser.id,
      username: testUser.username,
      firstName: testUser.first_name,
      lastName: testUser.last_name,
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
      const decoded = jwt.verify(token, this.secret) as ExtendedJwtPayload;
      return decoded;
    } catch (error) {
      console.error('Extended JWT verification failed:', error);
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
