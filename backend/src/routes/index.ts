import { Router } from 'express';
import authRoutes from './auth.js';
import professionRoutes from './professions.js';
import userStatusRoutes from './userStatus.js';
import telegramBotRoutes from './telegramBot.js';
import formRoutes from './form.js';
import prisma from '../services/prisma.js';

const router = Router();

// API маршруты
router.use('/api/auth', authRoutes);
router.use('/api/professions', professionRoutes);
router.use('/api/user-status', userStatusRoutes);
router.use('/api/telegram-bot', telegramBotRoutes);
router.use('/api/form', formRoutes);

// API info endpoint
router.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SuperMock API - Система авторизации и собеседований',
    version: '1.0.0',
    features: [
      'Email/Password авторизация',
      'Telegram Web App авторизация',
      'Telegram Login Widget',
      'JWT токены с ролями',
      'Управление пользователями',
      'Система интервью',
    ],
    endpoints: {
      auth: '/api/auth',
      professions: '/api/professions',
      userStatus: '/api/user-status',
      telegramBot: '/api/telegram-bot',
      form: '/api/form',
      health: '/api/health',
    },
    authEndpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      telegram: 'POST /api/auth/telegram',
      telegramWidget: 'POST /api/auth/telegram-widget',
      profile: 'GET /api/auth/profile',
      changePassword: 'POST /api/auth/change-password',
      linkTelegram: 'POST /api/auth/link-telegram',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Проверяем подключение к базе данных
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected',
        server: 'running',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Server is unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'disconnected',
        server: 'running',
      },
      error: 'Database connection failed',
    });
  }
});

// API Health check endpoint (for API prefix)
router.get('/api/health', async (req, res) => {
  try {
    // Проверяем подключение к базе данных
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected',
        api: 'running',
      },
    });
  } catch (error) {
    console.error('API health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'API is unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'disconnected',
        api: 'running',
      },
      error: 'Database connection failed',
    });
  }
});

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

export default router;
