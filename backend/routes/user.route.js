import express from 'express';
import { current } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/current', verifyToken, current);


export default router;