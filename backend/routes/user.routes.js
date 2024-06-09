import express from 'express';
import { current, deleteUser, getUsers, updateUser, updateUserProfile } from '../controllers/user.controller.js';
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get('/current', isAuthenticatedUser, current);
router.put('/update', isAuthenticatedUser, updateUserProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles("admin"), getUsers);
router.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles("admin"), updateUser);
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;