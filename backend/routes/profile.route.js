import express from 'express';
import { addProfiles } from '../controllers/profile.controller.js';
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/addProfiles", isAuthenticatedUser, addProfiles);

export default router;