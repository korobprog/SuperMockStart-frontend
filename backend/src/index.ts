import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ms from 'ms';
import { TelegramUtils } from './utils/telegram.js';
import { JwtUtils } from './utils/jwt.js';
import { TelegramBotService } from './services/telegramBotService.js';
import { CronService } from './services/cronService.js';
import routes from './routes/index.js';
import prisma from './services/prisma.js';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализируем утилиты
TelegramUtils.initialize(process.env.TELEGRAM_TOKEN || '');
TelegramBotService.initialize(process.env.TELEGRAM_TOKEN || '');
JwtUtils.initialize(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  process.env.JWT_EXPIRES_IN || '7d'
);

// Middleware безопасности
app.use(helmet());

// Доверяем прокси (для работы с Traefik)
app.set('trust proxy', true);

// CORS настройки
app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:5173',
        'https://localhost:5173',
        'http://localhost:5174',
        'https://localhost:5174',
        'http://localhost:5175',
        'https://localhost:5175',
        'https://supermock.ru',
        'http://supermock.ru',
      ];

      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 минут
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // максимум 100 запросов
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Правильная обработка IP адресов за прокси
  keyGenerator: (req: express.Request) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
});

app.use(limiter);

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Логирование запросов
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  }
);

// Маршруты
app.use('/', routes);

// Обработка ошибок
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err);

    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    });
  }
);

// Запуск HTTP сервера
app.listen(PORT, () => {
  console.log(`🚀 HTTP Server is running on port ${PORT}`);
  console.log(
    `📱 Telegram Bot: ${process.env.BOT_USERNAME || 'SuperMock_bot'}`
  );
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);

  // Запускаем cron задачи
  CronService.startAll();
});

// Запуск HTTPS сервера
try {
  const sslPath = path.join(__dirname, '..', '..', 'ssl');
  const httpsOptions = {
    key: fs.readFileSync(path.join(sslPath, 'key.pem')),
    cert: fs.readFileSync(path.join(sslPath, 'cert.pem')),
  };

  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`🔒 HTTPS Server is running on port ${HTTPS_PORT}`);
    console.log(
      `🔗 HTTPS Health check: https://localhost:${HTTPS_PORT}/health`
    );
  });
} catch (error) {
  console.log('⚠️  HTTPS server not started - SSL certificates not found');
  console.log(
    '   Run: mkdir ssl && openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "//C=US/ST=State/L=City/O=Organization/CN=localhost"'
  );
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  CronService.stopAll();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  CronService.stopAll();
  await prisma.$disconnect();
  process.exit(0);
});
