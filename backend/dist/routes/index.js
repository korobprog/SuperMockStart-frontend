import { Router } from 'express';
import authRoutes from './auth.js';
import professionRoutes from './professions.js';
import userStatusRoutes from './userStatus.js';
const router = Router();
// API маршруты
router.use('/api/auth', authRoutes);
router.use('/api/professions', professionRoutes);
router.use('/api/user-status', userStatusRoutes);
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
//# sourceMappingURL=index.js.map