import { Router } from 'express';
import { ProfessionController } from '../controllers/professionController.js';

const router = Router();

// Добавление выбранной профессии
router.post('/selected', ProfessionController.addSelectedProfession);

// Получение всех выбранных профессий пользователя
router.get('/user/:userId', ProfessionController.getUserProfessions);

// Получение пользователя с его профессиями
router.get(
  '/user/:userId/with-professions',
  ProfessionController.getUserWithProfessions
);

// Удаление выбранной профессии
router.delete('/selected/:id', ProfessionController.removeSelectedProfession);

export default router;
