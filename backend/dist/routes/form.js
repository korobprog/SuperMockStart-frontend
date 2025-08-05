import { Router } from 'express';
import { saveFormData, getFormData, updateFormData, } from '../controllers/formController.js';
import { authenticateExtendedToken } from '../middleware/auth.js';
const router = Router();
// POST /api/form - Сохранение данных формы
router.post('/', authenticateExtendedToken, saveFormData);
// GET /api/form - Получение данных формы пользователя
router.get('/', authenticateExtendedToken, getFormData);
// PUT /api/form - Обновление данных формы пользователя
router.put('/', authenticateExtendedToken, updateFormData);
export default router;
//# sourceMappingURL=form.js.map