import { Router } from 'express';
import { ProfessionController } from '../controllers/professionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: Router = Router();

// Добавление выбранной профессии
router.post(
  '/selected',
  authenticateToken,
  ProfessionController.addSelectedProfession
);

// Получение всех выбранных профессий пользователя
router.get(
  '/user/:userId',
  authenticateToken,
  ProfessionController.getUserProfessions
);

// Получение профессий аутентифицированного пользователя
router.get(
  '/user/professions',
  authenticateToken,
  ProfessionController.getUserProfessions
);

// Получение пользователя с его профессиями
router.get(
  '/user/:userId/with-professions',
  authenticateToken,
  ProfessionController.getUserWithProfessions
);

// Удаление выбранной профессии
router.delete(
  '/selected/:id',
  authenticateToken,
  ProfessionController.removeSelectedProfession
);

export default router;
