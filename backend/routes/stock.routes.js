// routes/stock.routes.js
import express from 'express';
import { getStockInfo } from '../controllers/stock.controller.js';

const router = express.Router();

router.get('/stocks', getStockInfo);

export default router;
