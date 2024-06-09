// routes/stock.routes.js
import express from 'express';
import { getPurchaseHistory, getStockInfo, purchaseStock} from '../controllers/stock.controller.js';
import { isAuthenticatedUser, authorizeRoles  } from "../middlewares/auth.js";

const router = express.Router();

router.get('/stocks', getStockInfo);
router.post('/buy', isAuthenticatedUser, purchaseStock);
router.get('/purchase', isAuthenticatedUser, authorizeRoles("admin"), getPurchaseHistory);

export default router;
