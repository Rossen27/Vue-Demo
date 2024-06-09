// routes/stock.routes.js
import express from 'express';
import { getStockInfo, purchaseStock} from '../controllers/stock.controller.js';
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.get('/stocks', getStockInfo);
router.post('/buy', isAuthenticatedUser, purchaseStock);

export default router;
