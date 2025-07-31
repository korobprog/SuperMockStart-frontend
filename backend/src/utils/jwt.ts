import jwt from 'jsonwebtoken';
import { JwtPayload, TelegramUser } from '../types/index.js';

export class JwtUtils {
  private static secret: string;
  private static expiresIn: string;

  static initialize(secret: string, expiresIn: string) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  /**
   * Создает JWT токен для пользователя
   */
  static generateToken(user: TelegramUser): string {
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
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
