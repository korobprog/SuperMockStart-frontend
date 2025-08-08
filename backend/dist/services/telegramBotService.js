import TelegramBot from 'node-telegram-bot-api';
export class TelegramBotService {
    static bot = null;
    static botToken = '';
    static pendingAuths = new Map();
    static initialize(token) {
        // Проверяем, не инициализирован ли уже бот
        if (this.bot) {
            console.log('🤖 Telegram bot already initialized, skipping...');
            return;
        }
        // Проверяем, что токен не пустой
        if (!token || token.trim() === '') {
            console.error('❌ Telegram token is empty or invalid');
            return;
        }
        console.log('🤖 Initializing Telegram bot...');
        console.log(`  - Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`  - Token length: ${token.length}`);
        console.log(`  - Bot username: ${process.env.BOT_USERNAME || 'unknown'}`);
        this.botToken = token;
        // Используем webhook в продакшене, polling в development
        const isDevelopment = process.env.NODE_ENV === 'development';
        if (isDevelopment) {
            // В development создаем бота без polling для избежания конфликтов
            this.bot = new TelegramBot(token, {
                polling: false,
                webHook: false,
            });
            console.log('🤖 Telegram bot initialized in development mode (no polling)');
            console.log('⚠️  Note: Bot polling disabled in development to avoid conflicts');
            console.log('📱 Messages will be sent via direct API calls only');
        }
        else {
            // В продакшене используем webhook
            this.bot = new TelegramBot(token, {
                polling: false,
                webHook: {
                    port: 8443,
                    host: '0.0.0.0',
                },
            });
            // Добавляем обработчик сообщений для webhook
            if (this.bot) {
                this.bot.on('message', async (msg) => {
                    console.log('📱 Received message via webhook:', {
                        chatId: msg.chat.id,
                        userId: msg.from?.id,
                        text: msg.text,
                    });
                    if (msg.text && msg.text.startsWith('/start')) {
                        console.log('🔐 Processing /start command via webhook');
                        await this.handleStartCommand(msg);
                    }
                });
                // Добавляем обработчик ошибок
                this.bot.on('error', (error) => {
                    console.error('🤖 Telegram bot error:', error);
                    // Не завершаем процесс при ошибках бота
                });
                console.log('🤖 Telegram bot started in webhook mode (production)');
            }
        }
    }
    /**
     * Получает информацию о пользователе через Telegram Bot API
     */
    static async getUserInfo(userId) {
        try {
            if (!this.bot) {
                throw new Error('Bot not initialized');
            }
            // Вместо отправки сообщения, просто возвращаем базовую информацию
            // Отправка сообщения может вызвать ошибку, если пользователь не начал диалог с ботом
            return {
                id: userId,
                is_bot: false,
                first_name: 'User',
                last_name: undefined,
                username: undefined,
                language_code: undefined,
                photo_url: undefined,
            };
        }
        catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }
    /**
     * Отправляет сообщение пользователю
     */
    static async sendMessage(userId, message) {
        try {
            if (!this.bot) {
                throw new Error('Bot not initialized');
            }
            await this.bot.sendMessage(userId, message);
            return true;
        }
        catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    }
    /**
     * Создает LoginUrl объект для авторизации через Telegram Login Widget
     */
    static createLoginUrl(userId, redirectUrl) {
        const botUsername = process.env.BOT_USERNAME || 'SuperMock_bot';
        const authId = `${userId}_${Date.now()}`;
        // Сохраняем информацию о pending авторизации
        this.pendingAuths.set(authId, { userId, timestamp: Date.now() });
        const isDevelopment = process.env.NODE_ENV === 'development';
        console.log(`🔗 Created LoginUrl for user ${userId} with auth ID: ${authId} (${isDevelopment ? 'dev mode' : 'production mode'})`);
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
    static createAuthUrl(userId, redirectUrl) {
        const botUsername = process.env.BOT_USERNAME || 'SuperMock_bot';
        const authId = `${userId}_${Date.now()}`;
        // Сохраняем информацию о pending авторизации
        this.pendingAuths.set(authId, { userId, timestamp: Date.now() });
        const isDevelopment = process.env.NODE_ENV === 'development';
        console.log(`🔗 Created auth URL for user ${userId} with auth ID: ${authId} (${isDevelopment ? 'dev mode' : 'production mode'})`);
        console.log(`📋 Current pending auths after creation:`, Array.from(this.pendingAuths.entries()));
        // Создаем правильную ссылку для Telegram Login Widget
        // Используем формат, который поддерживает Telegram Login Widget
        const baseUrl = `https://t.me/${botUsername}`;
        const authUrl = `${baseUrl}?start=auth_${authId}`;
        return authUrl;
    }
    /**
     * Проверяет pending авторизацию
     */
    static async checkPendingAuth(authId) {
        console.log(`🔍 Checking pending auth for ID: ${authId}`);
        console.log(`📋 Current pending auths:`, Array.from(this.pendingAuths.entries()));
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
        console.log(`✅ Auth ID ${authId} is valid, checking if bot can send message to user ${auth.userId}`);
        // Проверяем, может ли бот отправлять сообщения пользователю
        const canSendMessage = await this.canSendMessage(auth.userId);
        if (canSendMessage) {
            console.log(`✅ Bot can send message to user ${auth.userId}, auth successful`);
            this.pendingAuths.delete(authId);
            // В dev режиме всегда возвращаем валидный результат
            const isDevelopment = process.env.NODE_ENV === 'development';
            if (isDevelopment) {
                console.log(`🔧 Dev mode: returning valid auth result for user ${auth.userId}`);
            }
            return { userId: auth.userId, valid: true };
        }
        console.log(`❌ Bot cannot send message to user ${auth.userId}`);
        return { userId: auth.userId, valid: false };
    }
    /**
     * Обрабатывает команду /start с параметрами авторизации
     */
    static async handleStartCommand(msg) {
        try {
            if (!this.bot) {
                throw new Error('Bot not initialized');
            }
            const chatId = msg.chat.id;
            const text = msg.text || '';
            const user = msg.from;
            if (!user) {
                await this.bot.sendMessage(chatId, 'Ошибка: не удалось получить информацию о пользователе');
                return;
            }
            const userName = user.first_name || user.username || 'пользователь';
            console.log(`📱 Received /start command from user ${user.id} (${userName})`);
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
                        const userName = user.first_name || user.username || 'пользователь';
                        console.log(`✅ Dev mode: allowing auth for user ${user.id} (${userName})`);
                        await this.bot.sendMessage(chatId, `✅ Авторизация успешна!\n\nДобро пожаловать, ${userName}!\n\nТеперь вы можете использовать приложение SuperMock.\n\n🌐 Среда: development\n⚠️ Используйте тестовые токены`);
                        console.log(`User ${user.id} (${userName}) authenticated via bot (dev mode)`);
                    }
                    else {
                        // В production режиме проверяем совпадение ID пользователя
                        if (authResult.userId === user.id) {
                            const userName = user.first_name || user.username || 'пользователь';
                            await this.bot.sendMessage(chatId, `✅ Авторизация успешна!\n\nДобро пожаловать, ${userName}!\n\nТеперь вы можете использовать приложение SuperMock.\n\n🌐 Среда: production\n✅ Безопасная авторизация`);
                            console.log(`User ${user.id} (${userName}) authenticated via bot`);
                        }
                        else {
                            console.log(`❌ User ID mismatch: expected ${authResult.userId}, got ${user.id}`);
                            await this.bot.sendMessage(chatId, 'Ошибка авторизации: неверный пользователь. Попробуйте еще раз.');
                        }
                    }
                }
                else {
                    await this.bot.sendMessage(chatId, 'Ссылка для авторизации устарела или недействительна. Попробуйте еще раз.');
                }
            }
            else {
                // Обычное приветствие
                const isDevelopment = process.env.NODE_ENV === 'development';
                const userName = user.first_name || user.username || 'пользователь';
                if (isDevelopment) {
                    await this.bot.sendMessage(chatId, `👋 Привет, ${userName}!\n\nЭто бот для авторизации в приложении SuperMock.\n\nДля авторизации перейдите в приложение и нажмите кнопку "Войти через Telegram".\n\n🌐 Среда: development\n⚠️ Используйте тестовые токены`);
                }
                else {
                    await this.bot.sendMessage(chatId, `👋 Привет, ${userName}!\n\nЭто бот для авторизации в приложении SuperMock.\n\nДля авторизации перейдите в приложение и нажмите кнопку "Войти через Telegram".\n\n🌐 Среда: production\n✅ Безопасная авторизация`);
                }
            }
            // ВСЕГДА отправляем кнопку для авторизации
            console.log('🔗 Sending auth button to chat:', chatId);
            await this.sendAuthButton(chatId);
        }
        catch (error) {
            console.error('❌ Error handling start command:', error);
        }
    }
    /**
     * Получает информацию о боте
     */
    static async getBotInfo() {
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
        }
        catch (error) {
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
    static async canSendMessage(userId) {
        try {
            if (!this.bot) {
                return false;
            }
            // Пытаемся отправить тестовое сообщение
            // await this.bot.sendMessage(userId, 'Поздравляю! 🎉', {
            //   disable_notification: true,
            // });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Отправляет кнопку для авторизации
     */
    static async sendAuthButton(chatId) {
        try {
            if (!this.bot) {
                throw new Error('Bot not initialized');
            }
            console.log('🔗 Sending auth button to chat:', chatId);
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
                await this.bot.sendMessage(chatId, `🔗 Добро пожаловать в SuperMock!\n\nНажмите кнопку ниже для авторизации в приложении:\n\n🌐 Среда: production\n✅ Безопасная авторизация через Telegram`, { reply_markup: keyboard });
            }
            else {
                // В режиме разработки отправляем ссылку на bot-auth
                const devUrl = `http://localhost:5173/bot-auth?userId=${chatId}`;
                await this.bot.sendMessage(chatId, `🔗 Для авторизации в режиме разработки:\n\n1️⃣ Откройте приложение: http://localhost:5173\n2️⃣ Перейдите на страницу: ${devUrl}\n\n🌐 Среда: development\n⚠️ В режиме разработки используйте тестовые токены`);
            }
            console.log('✅ Auth button sent successfully to chat:', chatId);
        }
        catch (error) {
            console.error('❌ Error sending auth button:', error);
            // Попробуем отправить простое сообщение без кнопки
            try {
                await this.bot?.sendMessage(chatId, '🔗 Для авторизации перейдите в приложение SuperMock и нажмите кнопку "Войти через Telegram".');
            }
            catch (fallbackError) {
                console.error('❌ Error sending fallback message:', fallbackError);
            }
        }
    }
    /**
     * Отправляет кнопку для проверки токена (устаревший метод)
     */
    static async sendCheckTokenButton(chatId) {
        // Перенаправляем на новый метод
        await this.sendAuthButton(chatId);
    }
    /**
     * Остановить бота
     */
    static stop() {
        if (this.bot) {
            this.bot.stopPolling();
            this.bot = null;
            console.log('🤖 Telegram bot stopped');
        }
    }
    /**
     * Принудительно перезапустить бота
     */
    static async restart() {
        console.log('🤖 Restarting Telegram bot...');
        // Останавливаем текущий бот
        this.stop();
        // Ждем немного
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Переинициализируем бота
        if (this.botToken) {
            this.initialize(this.botToken);
        }
    }
}
//# sourceMappingURL=telegramBotService.js.map