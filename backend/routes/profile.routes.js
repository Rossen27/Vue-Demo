import express from 'express';
import { addProfiles, getProfile, getAllProfiles } from '../controllers/profile.controller.js';
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/addProfiles", isAuthenticatedUser, addProfiles);
router.get("/profiles", isAuthenticatedUser, authorizeRoles("admin"), getAllProfiles);
router.get("/profiles/:id", isAuthenticatedUser, getProfile);


export default router;