/**
 * Утилиты для валидации данных
 */

// Регулярное выражение для проверки email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Минимальные требования к паролю
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REQUIREMENTS = {
  minLength: PASSWORD_MIN_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationUtils {
  /**
   * Валидация email адреса
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email) {
      errors.push('Email обязателен');
      return { isValid: false, errors };
    }

    if (!EMAIL_REGEX.test(email)) {
      errors.push('Неверный формат email');
    }

    if (email.length > 254) {
      errors.push('Email слишком длинный');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация пароля
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Пароль обязателен');
      return { isValid: false, errors };
    }

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      errors.push(`Пароль должен содержать минимум ${PASSWORD_REQUIREMENTS.minLength} символов`);
    }

    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну заглавную букву');
    }

    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну строчную букву');
    }

    if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
      errors.push('Пароль должен содержать хотя бы одну цифру');
    }

    if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Пароль должен содержать хотя бы один специальный символ');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация имени пользователя
   */
  static validateName(name: string, fieldName: string = 'Имя'): ValidationResult {
    const errors: string[] = [];

    if (!name) {
      errors.push(`${fieldName} обязательно`);
      return { isValid: false, errors };
    }

    if (name.length < 2) {
      errors.push(`${fieldName} должно содержать минимум 2 символа`);
    }

    if (name.length > 50) {
      errors.push(`${fieldName} не должно превышать 50 символов`);
    }

    // Проверяем, что имя содержит только буквы, пробелы и дефисы
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name)) {
      errors.push(`${fieldName} может содержать только буквы, пробелы и дефисы`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация username
   */
  static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];

    if (!username) {
      return { isValid: true, errors }; // Username необязателен
    }

    if (username.length < 3) {
      errors.push('Username должен содержать минимум 3 символа');
    }

    if (username.length > 30) {
      errors.push('Username не должен превышать 30 символов');
    }

    // Username может содержать буквы, цифры, подчеркивания и дефисы
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
      errors.push('Username может содержать только буквы, цифры, подчеркивания и дефисы');
    }

    // Не должен начинаться с цифры
    if (/^\d/.test(username)) {
      errors.push('Username не может начинаться с цифры');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация данных регистрации
   */
  static validateRegistrationData(data: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    username?: string;
  }): ValidationResult {
    const allErrors: string[] = [];

    // Валидируем email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      allErrors.push(...emailValidation.errors);
    }

    // Валидируем пароль
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      allErrors.push(...passwordValidation.errors);
    }

    // Валидируем имя
    const firstNameValidation = this.validateName(data.firstName, 'Имя');
    if (!firstNameValidation.isValid) {
      allErrors.push(...firstNameValidation.errors);
    }

    // Валидируем фамилию (если указана)
    if (data.lastName) {
      const lastNameValidation = this.validateName(data.lastName, 'Фамилия');
      if (!lastNameValidation.isValid) {
        allErrors.push(...lastNameValidation.errors);
      }
    }

    // Валидируем username (если указан)
    if (data.username) {
      const usernameValidation = this.validateUsername(data.username);
      if (!usernameValidation.isValid) {
        allErrors.push(...usernameValidation.errors);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Очистка email (приведение к нижнему регистру, удаление пробелов)
   */
  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Очистка имени (удаление лишних пробелов, приведение первой буквы к верхнему регистру)
   */
  static sanitizeName(name: string): string {
    return name
      .trim()
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}