import express from 'express';
import { google, login, logout, register } from '../controllers/auth.controller.js';


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.route("/google").post(google);
router.get("/logout", logout);

export default router;
