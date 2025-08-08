import crypto from 'crypto';
export class TelegramUtils {
    static botToken;
    static initialize(token) {
        this.botToken = token;
        console.log('🔧 TelegramUtils initialized with token length:', token ? token.length : 0);
    }
    /**
     * Проверяет, инициализирован ли бот токен
     */
    static isInitialized() {
        if (!this.botToken) {
            console.error('❌ TelegramUtils not initialized with bot token');
            return false;
        }
        return true;
    }
    /**
     * Валидирует данные от Telegram Web App
     */
    static validateWebAppData(initData) {
        try {
            // Парсим initData
            const urlParams = new URLSearchParams(initData);
            const hash = urlParams.get('hash');
            if (!hash) {
                return null;
            }
            // Удаляем hash из данных для проверки
            urlParams.delete('hash');
            // Сортируем параметры по алфавиту
            const dataCheckString = Array.from(urlParams.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
            // Создаем секретный ключ
            const secretKey = crypto
                .createHmac('sha256', 'WebAppData')
                .update(this.botToken)
                .digest();
            // Вычисляем хеш
            const calculatedHash = crypto
                .createHmac('sha256', secretKey)
                .update(dataCheckString)
                .digest('hex');
            // Проверяем хеш
            if (calculatedHash !== hash) {
                return null;
            }
            // Парсим пользователя
            const userStr = urlParams.get('user');
            if (!userStr) {
                return null;
            }
            const user = JSON.parse(userStr);
            return {
                query_id: urlParams.get('query_id') || '',
                user,
                auth_date: parseInt(urlParams.get('auth_date') || '0'),
                hash,
                start_param: urlParams.get('start_param') || undefined,
                can_send_after: urlParams.get('can_send_after')
                    ? parseInt(urlParams.get('can_send_after'))
                    : undefined,
                chat_type: urlParams.get('chat_type') || undefined,
                chat_instance: urlParams.get('chat_instance') || undefined,
            };
        }
        catch (error) {
            console.error('Error validating Telegram Web App data:', error);
            return null;
        }
    }
    /**
     * Валидирует данные от Telegram Login Widget
     * Использует правильный алгоритм для Login Widget согласно документации
     */
    static validateWidgetData(widgetData) {
        try {
            // Проверяем инициализацию
            if (!this.isInitialized()) {
                console.error('❌ TelegramUtils not initialized');
                return false;
            }
            console.log('🔍 Validating Telegram Widget data:', {
                id: widgetData.id,
                first_name: widgetData.first_name,
                auth_date: widgetData.auth_date,
                has_hash: !!widgetData.hash,
                bot_token_length: this.botToken ? this.botToken.length : 0,
            });
            // Проверяем обязательные поля
            if (!widgetData.id ||
                !widgetData.first_name ||
                !widgetData.auth_date ||
                !widgetData.hash) {
                console.error('❌ Missing required fields in widget data');
                return false;
            }
            // Проверяем срок действия данных (не более 5 минут для Login Widget)
            const currentTime = Math.floor(Date.now() / 1000);
            const fiveMinutes = 5 * 60;
            if (currentTime - widgetData.auth_date > fiveMinutes) {
                console.error('❌ Widget data expired');
                return false;
            }
            // Создаем строку для проверки согласно документации Telegram
            const dataCheckString = Object.entries(widgetData)
                .filter(([key]) => key !== 'hash')
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
            console.log('📋 Data check string:', dataCheckString);
            // Создаем секретный ключ согласно документации Telegram
            const secretKey = crypto
                .createHash('sha256')
                .update(this.botToken)
                .digest();
            // Вычисляем хеш
            const calculatedHash = crypto
                .createHmac('sha256', secretKey)
                .update(dataCheckString)
                .digest('hex');
            console.log('🔐 Hash comparison:', {
                received: widgetData.hash,
                calculated: calculatedHash,
                match: calculatedHash === widgetData.hash,
            });
            // Проверяем хеш
            const isValid = calculatedHash === widgetData.hash;
            if (!isValid) {
                console.error('❌ Widget data hash validation failed');
            }
            else {
                console.log('✅ Widget data hash validation successful');
            }
            return isValid;
        }
        catch (error) {
            console.error('❌ Error validating Telegram Widget data:', error);
            return false;
        }
    }
    /**
     * Проверяет, не устарели ли данные (больше 1 часа)
     */
    static isDataExpired(authDate) {
        const currentTime = Math.floor(Date.now() / 1000);
        const oneHour = 3600;
        return currentTime - authDate > oneHour;
    }
    /**
     * Получает информацию о пользователе через Telegram Bot API
     */
    static async getUserInfo(userId) {
        try {
            if (!this.isInitialized()) {
                console.error('❌ TelegramUtils not initialized for getUserInfo');
                return null;
            }
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getChat?chat_id=${userId}`);
            const data = await response.json();
            if (data.ok) {
                return {
                    id: data.result.id,
                    is_bot: data.result.is_bot || false,
                    first_name: data.result.first_name,
                    last_name: data.result.last_name,
                    username: data.result.username,
                    language_code: data.result.language_code,
                    photo_url: data.result.photo?.small_file_id,
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }
}
//# sourceMappingURL=telegram.js.map