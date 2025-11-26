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
import auth from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', auth, getUser);
router.get('/logout', logout);
router.get('/token', refreshAccessToken);

export default router;
