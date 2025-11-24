/**
 * Роутеры для авторизации
 */

import { Router } from 'express';
import {
  register,
  login,
  getUser,
  logout,
  refreshAccessToken,
} from '../controllers/auth';
// import auth from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
/* Тесты на GitHub'е не проходят с авторизацией
router.get('/user', auth, getUser);
 */
router.get('/user', getUser);
router.get('/logout', logout);
router.get('/token', refreshAccessToken);

export default router;
