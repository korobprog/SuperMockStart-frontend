import jwt from 'jsonwebtoken';
export class JwtUtils {
    static secret;
    static expiresIn;
    static initialize(secret, expiresIn) {
        this.secret = secret;
        this.expiresIn = expiresIn;
    }
    /**
     * Создает JWT токен для пользователя
     */
    static generateToken(user) {
        const payload = {
            userId: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
        };
        const options = { expiresIn: this.expiresIn };
        return jwt.sign(payload, this.secret, options);
    }
    /**
     * Создает тестовый JWT токен для разработки
     */
    static generateTestToken() {
        const testUser = {
            id: 123456789,
            is_bot: false,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
        };
        const payload = {
            userId: testUser.id,
            username: testUser.username,
            firstName: testUser.first_name,
            lastName: testUser.last_name,
        };
        const options = { expiresIn: '30d' }; // Тестовый токен на 30 дней
        return jwt.sign(payload, this.secret, options);
    }
    /**
     * Верифицирует JWT токен
     */
    static verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.secret);
            return decoded;
        }
        catch (error) {
            console.error('JWT verification failed:', error);
            return null;
        }
    }
    /**
     * Декодирует JWT токен без верификации (для отладки)
     */
    static decodeToken(token) {
        try {
            const decoded = jwt.decode(token);
            return decoded;
        }
        catch (error) {
            console.error('JWT decode failed:', error);
            return null;
        }
    }
    /**
     * Проверяет, истек ли токен
     */
    static isTokenExpired(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                return true;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        }
        catch (error) {
            return true;
        }
    }
}
//# sourceMappingURL=jwt.js.map