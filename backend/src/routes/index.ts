import { Router } from 'express';
import authRoutes from './auth.js';
import professionRoutes from './professions.js';
import userStatusRoutes from './userStatus.js';

const router = Router();

// API маршруты
router.use('/api/auth', authRoutes);
router.use('/api/professions', professionRoutes);
router.use('/api/user-status', userStatusRoutes);

// API info endpoint
router.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SuperMock API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      professions: '/api/professions',
      userStatus: '/api/user-status',
      health: '/health',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

export default router;
