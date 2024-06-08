import express from 'express';
import { current, getUsers } from '../controllers/user.controller.js';
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get('/current', isAuthenticatedUser, current);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles("admin"), getUsers);


export default router;