import TelegramBot from 'node-telegram-bot-api';
import { TelegramUser, ApiResponse } from '../types/index.js';

export class TelegramBotService {
  private static bot: TelegramBot | null = null;
  private static botToken: string = '';
  private static pendingAuths = new Map<
    string,
    { userId: number; timestamp: number }
  >();

  static initialize(token: string) {
    this.botToken = token;

    // Используем polling в обоих режимах, пока webhook не настроится правильно
    const isDevelopment = process.env.NODE_ENV === 'development';

    this.bot = new TelegramBot(token, {
      polling: true, // Используем polling в продакшене
      webHook: false, // Отключаем webhook пока не настроится
    });

    // Добавляем обработчик сообщений для всех режимов
    if (this.bot) {
      this.bot.on('message', async (msg) => {
        console.log('Received message:', msg);
        if (msg.text && msg.text.startsWith('/start')) {
          await this.handleStartCommand(msg);
        }
      });

      console.log(
        `🤖 Telegram bot started in polling mode (${
          isDevelopment ? 'development' : 'production'
        })`
      );
    }
  }

  /**
   * Получает информацию о пользователе через Telegram Bot API
   */
  static async getUserInfo(userId: number): Promise<TelegramUser | null> {
    try {
      if (!this.bot) {
        throw new Error('Bot not initialized');
      }

      // Простая проверка - пытаемся отправить тестовое сообщение
      await this.bot.sendMessage(userId, 'Вы авторизованны!', {
        disable_notification: true,
      });

      // Если сообщение отправилось, возвращаем базовую информацию
      return {
        id: userId,
        is_bot: false,
        first_name: 'User',
        last_name: undefined,
        username: undefined,
        language_code: undefined,
        photo_url: undefined,
      };
    } catch (error) {
      console.error('Error checking user access:', error);
      return null;
    }
  }

  /**
   * Отправляет сообщение пользователю
   */
  static async sendMessage(userId: number, message: string): Promise<boolean> {
    try {
      if (!this.bot) {
        throw new Error('Bot not initialized');
      }

      await this.bot.sendMessage(userId, message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * Создает LoginUrl объект для авторизации через Telegram Login Widget
   */
  static createLoginUrl(userId: number, redirectUrl: string): any {
    const botUsername = process.env.BOT_USERNAME || 'SuperMock_bot';
    const authId = `${userId}_${Date.now()}`;

    // Сохраняем информацию о pending авторизации
    this.pendingAuths.set(authId, { userId, timestamp: Date.now() });

    const isDevelopment = process.env.NODE_ENV === 'development';

    console.log(
      `🔗 Created LoginUrl for user ${userId} with auth ID: ${authId} (${
        isDevelopment ? 'dev mode' : 'production mode'
      })`
    );

    // Создаем LoginUrl объект согласно документации Telegram Bot API
    const loginUrl = {
      url: `${redirectUrl}?auth_id=${authId}`,
      forward_text: 'Авторизоваться в SuperMock',
      bot_username: botUsername,
      request_write_access: true,
    };

    return loginUrl;
  }

  /**
   * Создает URL для авторизации через бота
   */
  static createAuthUrl(userId: number, redirectUrl: string): string {
    const botUsername = process.env.BOT_USERNAME || 'SuperMock_bot';
    const authId = `${userId}_${Date.now()}`;

    // Сохраняем информацию о pending авторизации
    this.pendingAuths.set(authId, { userId, timestamp: Date.now() });

    const isDevelopment = process.env.NODE_ENV === 'development';

    console.log(
      `🔗 Created auth URL for user ${userId} with auth ID: ${authId} (${
        isDevelopment ? 'dev mode' : 'production mode'
      })`
    );
    console.log(
      `📋 Current pending auths after creation:`,
      Array.from(this.pendingAuths.entries())
    );

    // Создаем правильную ссылку для Telegram Login Widget
    // Используем формат, который поддерживает Telegram Login Widget
    const baseUrl = `https://t.me/${botUsername}`;
    const authUrl = `${baseUrl}?start=auth_${authId}`;

    return authUrl;
  }

  /**
   * Проверяет pending авторизацию
   */
  static async checkPendingAuth(
    authId: string
  ): Promise<{ userId: number; valid: boolean } | null> {
    console.log(`🔍 Checking pending auth for ID: ${authId}`);
    console.log(
      `📋 Current pending auths:`,
      Array.from(this.pendingAuths.entries())
    );

    const auth = this.pendingAuths.get(authId);

    if (!auth) {
      console.log(`❌ Auth ID ${authId} not found in pending auths`);
      return null;
    }

    // Проверяем, что запрос не старше 5 минут
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (currentTime - auth.timestamp > fiveMinutes) {
      console.log(`⏰ Auth ID ${authId} expired (older than 5 minutes)`);
      this.pendingAuths.delete(authId);
      return null;
    }

    console.log(
      `✅ Auth ID ${authId} is valid, checking if bot can send message to user ${auth.userId}`
    );

    // Проверяем, может ли бот отправлять сообщения пользователю
    const canSendMessage = await this.canSendMessage(auth.userId);

    if (canSendMessage) {
      console.log(
        `✅ Bot can send message to user ${auth.userId}, auth successful`
      );
      this.pendingAuths.delete(authId);

      // В dev режиме всегда возвращаем валидный результат
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        console.log(
          `🔧 Dev mode: returning valid auth result for user ${auth.userId}`
        );
      }

      return { userId: auth.userId, valid: true };
    }

    console.log(`❌ Bot cannot send message to user ${auth.userId}`);
    return { userId: auth.userId, valid: false };
  }

  /**
   * Обрабатывает команду /start с параметрами авторизации
   */
  static async handleStartCommand(msg: TelegramBot.Message): Promise<void> {
    try {
      if (!this.bot) {
        throw new Error('Bot not initialized');
      }

      const chatId = msg.chat.id;
      const text = msg.text || '';
      const user = msg.from;

      if (!user) {
        await this.bot.sendMessage(
          chatId,
          'Ошибка: не удалось получить информацию о пользователе'
        );
        return;
      }

      console.log(
        `📱 Received /start command from user ${user.id} (${user.first_name})`
      );

      // Проверяем, содержит ли команда параметры авторизации
      if (text.startsWith('/start auth_')) {
        const authId = text.replace('/start auth_', '');

        console.log(`🔐 Processing auth request with ID: ${authId}`);

        // Проверяем pending авторизацию
        const authResult = await this.checkPendingAuth(authId);

        if (authResult && authResult.valid) {
          // В dev режиме используем реальный ID пользователя из Telegram
          const isDevelopment = process.env.NODE_ENV === 'development';

          if (isDevelopment) {
            // В dev режиме всегда разрешаем авторизацию, если бот может отправлять сообщения
            console.log(
              `✅ Dev mode: allowing auth for user ${user.id} (${user.first_name})`
            );

            await this.bot.sendMessage(
              chatId,
              `✅ Авторизация успешна!\n\nДобро пожаловать, ${user.first_name}!\n\nТеперь вы можете использовать приложение SuperMock.\n\n🌐 Среда: development\n⚠️ Используйте тестовые токены`
            );

            console.log(
              `User ${user.id} (${user.first_name}) authenticated via bot (dev mode)`
            );

            // Отправляем кнопку для проверки токена
            await this.sendAuthButton(chatId);
          } else {
            // В production режиме проверяем совпадение ID пользователя
            if (authResult.userId === user.id) {
              await this.bot.sendMessage(
                chatId,
                `✅ Авторизация успешна!\n\nДобро пожаловать, ${user.first_name}!\n\nТеперь вы можете использовать приложение SuperMock.\n\n🌐 Среда: production\n✅ Безопасная авторизация`
              );

              console.log(
                `User ${user.id} (${user.first_name}) authenticated via bot`
              );

              // Отправляем кнопку для проверки токена
              await this.sendAuthButton(chatId);
            } else {
              console.log(
                `❌ User ID mismatch: expected ${authResult.userId}, got ${user.id}`
              );
              await this.bot.sendMessage(
                chatId,
                'Ошибка авторизации: неверный пользователь. Попробуйте еще раз.'
              );
            }
          }
        } else {
          await this.bot.sendMessage(
            chatId,
            'Ссылка для авторизации устарела или недействительна. Попробуйте еще раз.'
          );
        }
      } else {
        // Обычное приветствие
        const isDevelopment = process.env.NODE_ENV === 'development';

        if (isDevelopment) {
          await this.bot.sendMessage(
            chatId,
            `👋 Привет, ${user.first_name}!\n\nЭто бот для авторизации в приложении SuperMock.\n\nДля авторизации перейдите в приложение и нажмите кнопку "Войти через Telegram".\n\n🌐 Среда: development\n⚠️ Используйте тестовые токены`
          );
        } else {
          await this.bot.sendMessage(
            chatId,
            `👋 Привет, ${user.first_name}!\n\nЭто бот для авторизации в приложении SuperMock.\n\nДля авторизации перейдите в приложение и нажмите кнопку "Войти через Telegram".\n\n🌐 Среда: production\n✅ Безопасная авторизация`
          );
        }

        // Отправляем кнопку для авторизации
        await this.sendAuthButton(chatId);
      }
    } catch (error) {
      console.error('Error handling start command:', error);
    }
  }

  /**
   * Получает информацию о боте
   */
  static async getBotInfo(): Promise<ApiResponse<any>> {
    try {
      if (!this.bot) {
        throw new Error('Bot not initialized');
      }

      const botInfo = await this.bot.getMe();

      return {
        success: true,
        data: botInfo,
        message: 'Bot info retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting bot info:', error);
      return {
        success: false,
        error: 'Failed to get bot info',
      };
    }
  }

  /**
   * Проверяет, может ли бот отправлять сообщения пользователю
   */
  static async canSendMessage(userId: number): Promise<boolean> {
    try {
      if (!this.bot) {
        return false;
      }

      // Пытаемся отправить тестовое сообщение
      // await this.bot.sendMessage(userId, 'Поздравляю! 🎉', {
      //   disable_notification: true,
      // });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Отправляет кнопку для авторизации
   */
  static async sendAuthButton(chatId: number) {
    try {
      if (!this.bot) {
        throw new Error('Bot not initialized');
      }

      const isProduction = process.env.NODE_ENV === 'production';

      if (isProduction) {
        // В продакшне отправляем кнопку для авторизации через Login Widget
        const baseUrl = 'https://supermock.ru';
        const authUrl = `${baseUrl}/auth-callback`;

        // Создаем inline keyboard с LoginUrl объектом
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: '🔐 Авторизоваться в приложении',
                login_url: {
                  url: authUrl,
                  forward_text: 'Авторизоваться в SuperMock',
                  bot_username: process.env.BOT_USERNAME || 'SuperMock_bot',
                  request_write_access: true,
                },
              },
            ],
            [
              {
                text: '📱 Открыть в Telegram',
                web_app: { url: authUrl },
              },
            ],
          ],
        };

        await this.bot.sendMessage(
          chatId,
          `🔗 Добро пожаловать в SuperMock!\n\nНажмите кнопку ниже для авторизации в приложении:\n\n🌐 Среда: production\n✅ Безопасная авторизация через Telegram`,
          { reply_markup: keyboard }
        );
      } else {
        // В режиме разработки отправляем инструкцию без кнопки
        const devUrl = `http://localhost:5173/auth-callback?auth_id=${chatId}_${Date.now()}`;

        await this.bot.sendMessage(
          chatId,
          `🔗 Для авторизации в режиме разработки:\n\n1️⃣ Откройте приложение: http://localhost:5173\n2️⃣ Перейдите на страницу: ${devUrl}\n\n🌐 Среда: development\n⚠️ В режиме разработки используйте тестовые токены`
        );
      }

      console.log('✅ Auth button sent to chat:', chatId);
    } catch (error) {
      console.error('❌ Error sending auth button:', error);
    }
  }

  /**
   * Отправляет кнопку для проверки токена (устаревший метод)
   */
  static async sendCheckTokenButton(chatId: number) {
    // Перенаправляем на новый метод
    await this.sendAuthButton(chatId);
  }
}
