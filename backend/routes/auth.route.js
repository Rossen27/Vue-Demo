import express from 'express';
import { google, login, logout, register, test } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.route("/google").post(google);
router.get("/logout", logout);

export default router;
