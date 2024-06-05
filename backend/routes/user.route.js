import express from 'express';
import { login, register, test } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/register', register);
router.post('/login', login);

export default router;
