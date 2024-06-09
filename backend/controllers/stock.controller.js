// controllers/stockController.js
import axios from 'axios';
import Stock from '../models/stock.model.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Purchase from '../models/purchase.model.js';


// TODO: 取得股票資訊
// Route: GET /api/stock
// Desc: 取得股票資訊
// Access: Public
export const getStockInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const { ex_ch } = req.query;
    const stocks = [];

    const tseStocks = [];
    const otcStocks = [];

    // 將 ex_ch 分割成股票代號的數組
    // deepcode ignore HTTPSourceWithUncheckedType: <>
    const stockArray = ex_ch.split('|');

    // 分別對 tse 和 otc 市場的股票進行處理
    for (const stock of stockArray) {
      const tseStock = `tse_${stock}.tw`;
      const otcStock = `otc_${stock}.tw`;

      // 嘗試從 TSE 市場取得股票信息
      try {
        const tseQueryUrl = `http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${tseStock}&json=1`;
        const tseResponse = await axios.get(tseQueryUrl);

        if (tseResponse.status === 200) {
          const tseData = tseResponse.data;
          const tseStockItem = new Stock(tseData.msgArray[0]);
          tseStockItem.calculatePriceChangePercentage();
          tseStockItem.formatUpdateTime();
          tseStocks.push(tseStockItem);
        }
      } catch (error) {
        // 若 TSE 市場無法取得股票信息，繼續嘗試 OTC 市場
        const otcQueryUrl = `http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${otcStock}&json=1`;
        const otcResponse = await axios.get(otcQueryUrl);

        if (otcResponse.status === 200) {
          const otcData = otcResponse.data;
          const otcStockItem = new Stock(otcData.msgArray[0]);
          otcStockItem.calculatePriceChangePercentage();
          otcStockItem.formatUpdateTime();
          otcStocks.push(otcStockItem);
        }
      }
    }

    // 將 TSE 和 OTC 市場的股票信息合併
    const allStocks = [...tseStocks, ...otcStocks];

    res.status(200).json(allStocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: 購買
// Route: POST /api/purchase
// Desc: 購買股票
// Access: Private
export const purchaseStock = catchAsyncErrors(async (req, res, next) => {
  const { stockCode, stockData, quantity, price } = req.body;
  const userId = req.user._id; // 從驗證中獲取使用者ID

  try {
    const purchase = new Purchase({ stockCode, stockData, quantity, price, user: userId });
    await purchase.save();

    // 購買成功後，返回購買的詳細資訊
    res.status(201).json({
      message: '購買成功',
      purchase: {
        _id: purchase._id,
        stockCode: purchase.stockCode,
        stockData: purchase.stockData,
        quantity: purchase.quantity,
        price: purchase.price,
        timestamp: purchase.timestamp,
        user: purchase.user // 如果需要使用者資訊，可以將其包含在回應中
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});