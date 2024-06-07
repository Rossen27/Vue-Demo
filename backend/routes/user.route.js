import express from 'express';
import { current } from '../controllers/user.controller.js';
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get('/current', isAuthenticatedUser, authorizeRoles("admin"), current);


export default router;