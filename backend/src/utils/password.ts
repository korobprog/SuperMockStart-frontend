import bcrypt from 'bcryptjs';

/**
 * Утилиты для работы с паролями
 */
export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Хэширует пароль с использованием bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Ошибка при хэшировании пароля');
    }
  }

  /**
   * Проверяет соответствие пароля хэшу
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Генерирует случайный пароль
   */
  static generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Обеспечиваем наличие хотя бы одного символа каждого типа
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specials = '!@#$%^&*';
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specials[Math.floor(Math.random() * specials.length)];
    
    // Заполняем остальную часть случайными символами
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Перемешиваем символы
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Проверяет силу пароля
   */
  static checkPasswordStrength(password: string): {
    score: number; // 0-4
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    // Длина
    if (password.length >= 8) score++;
    else feedback.push('Добавьте больше символов (минимум 8)');

    if (password.length >= 12) score++;

    // Строчные буквы
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Добавьте строчные буквы');

    // Заглавные буквы
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Добавьте заглавные буквы');

    // Цифры
    if (/\d/.test(password)) score++;
    else feedback.push('Добавьте цифры');

    // Специальные символы
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score++;
    } else {
      feedback.push('Добавьте специальные символы');
    }

    // Проверка на повторяющиеся символы
    if (/(.)\1{2,}/.test(password)) {
      score--;
      feedback.push('Избегайте повторяющихся символов');
    }

    // Проверка на простые последовательности
    const sequences = ['123', 'abc', 'qwe', 'password', 'admin'];
    const lowerPassword = password.toLowerCase();
    for (const seq of sequences) {
      if (lowerPassword.includes(seq)) {
        score--;
        feedback.push('Избегайте простых последовательностей и распространенных слов');
        break;
      }
    }

    return {
      score: Math.max(0, Math.min(4, score)),
      feedback,
      isStrong: score >= 3,
    };
  }
}