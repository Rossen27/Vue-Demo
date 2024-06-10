// controllers/stockController.js
import axios from 'axios';
import Stock from '../models/stock.model.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Purchase from '../models/purchase.model.js';

// TODO: 取得股票資訊
// Route: GET /api/stocks/stock
// Desc: 取得股票資訊
// Access: Public
export const getStockInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const { ex_ch } = req.query;

    if (!ex_ch) {
      return res
        .status(400)
        .json({ message: 'ex_ch query parameter is required' });
    }

    // deepcode ignore HTTPSourceWithUncheckedType: <可忽略>
    const stockArray = ex_ch.split('|'); // 將股票代號分割成數組
    const stockList = stockArray
      .map((stock) =>
        stock.startsWith('tse_') || stock.startsWith('otc_')
          ? stock
          : `tse_${stock}.tw|otc_${stock}.tw`
      )
      .join('|');

    // 組合完整的URL
    const queryUrl = `http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${stockList}&json=1`;
    const response = await axios.get(queryUrl);

    if (response.status === 200) {
      const data = response.data.msgArray;
      const stocks = data.map((stockData) => {
        const stockItem = new Stock(stockData);
        stockItem.calculatePriceChangePercentage();
        stockItem.formatUpdateTime();
        return stockItem;
      });
      res.status(200).json(stocks);
    } else {
      res.status(500).json({ message: '取得股票資訊失敗.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: 購買
// Route: POST /api/stocks/buy
// Desc: 購買股票
// Access: Private
export const purchaseStock = catchAsyncErrors(async (req, res, next) => {
  const { stockCode, stockData, quantity, price } = req.body;
  const userId = req.user._id; // 從驗證中獲取使用者ID

  try {
    const purchase = new Purchase({
      stockCode,
      stockData,
      quantity,
      price,
      user: userId,
    });
    await purchase.save();

    // 購買成功後，返回購買的詳細資訊
    res.status(201).json({
      message: '購買成功',
      purchase,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: Admin - 取得所有訂單購買紀錄
// Route: GET /api/stocks/purchase
// Desc: 取得購買紀錄
// Access: Private
export const getPurchaseHistory = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id; // 從驗證中獲取使用者ID

  try {
    const purchases = await Purchase.find({ user: userId });

    res.status(200).json({
      purchases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
