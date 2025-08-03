import { Router } from 'express';
import { saveFormData, getFormData } from '../controllers/formController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/form - Сохранение данных формы
router.post('/', authenticateToken, saveFormData);

// GET /api/form - Получение данных формы пользователя
router.get('/', authenticateToken, getFormData);

export default router;
