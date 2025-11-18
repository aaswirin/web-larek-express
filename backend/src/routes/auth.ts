/**
 * Роутеры для авторизации
 */

import { Router } from 'express';
import {
  register,
  login,
  user,
  logout,
  refreshAccessToken,
} from '../contollers/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', user);
router.get('/logout', logout);
router.get('/token', refreshAccessToken);

export default router;
