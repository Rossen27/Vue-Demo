import express from 'express';
import { addProfiles, getProfile, getAllProfiles, editProfile } from '../controllers/profile.controller.js';
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/addProfiles", isAuthenticatedUser, addProfiles);
router.get("/profiles", isAuthenticatedUser, authorizeRoles("admin"), getAllProfiles);
router.get("/profiles/:id", isAuthenticatedUser, getProfile);
router.post('/edit/:id', isAuthenticatedUser, authorizeRoles("admin"), editProfile);

export default router;