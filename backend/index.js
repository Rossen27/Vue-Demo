import express from 'express';
import dotenv from 'dotenv'; // 引入dotenv模組
import { connectDatabase } from './config/dbConnect.js'; // 引入MongoDB資料庫連接模組
import nodemailer from 'nodemailer'; // 用於發送電子郵件的模組
import cookieParser from 'cookie-parser';
import helmet from 'helmet'; // 引入helmet模組
import userRouter from './routes/user.route.js';

// 1) 設定 .env 檔案的路徑
if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: 'backend/config/config.env' });
} else {
  dotenv.config();
}

// 2) 連線至 MongoDB
connectDatabase();

// 3) 設置電子郵件通知功能
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
});

function notifyAdmin(error) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: 'jetso1127@icloud.com',
    subject: '未處理的 Promise 拒絕',
    text: `錯誤詳情：${error.stack || error}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('通知管理員失敗：', err);
    } else {
      console.log('通知管理員成功：', info.response);
    }
  });
}

function isCriticalError(error) {
  // 假設我們認為某些錯誤是致命的
  // 這裡可以根據具體錯誤類型或訊息來判斷
  return true; // 這裡僅作範例，一律視為致命錯誤
}

// 4) 創建一個Express應用程式
// file deepcode ignore UseCsurfForExpress: <已經使用JWT以及Helmet所以可以無需再使用CSRF>
const app = express();
app.use(helmet()); // 使用helmet中間件，提高應用程式的安全性
app.use(express.json()); // 允許伺服器接收json檔
app.use(cookieParser()); // 允許伺服器接收cookie檔
app.use(express.urlencoded({ extended: true })); // 允許伺服器接收urlencoded檔

app.get('/', (req, res) => {
  res.send('Hello World');
});
// API 設定
app.use('/api/user', userRouter);

// 5) 啟動伺服器
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    `伺服器正在連接埠號： ${process.env.PORT || 5000} 上，並以 ${
      process.env.NODE_ENV
    } 模式啟動`
  );
});

// 6) 處理未處理的拒絕
process.on('unhandledRejection', (err) => {
  console.error('未處理的 Promise 拒絕：', err.stack || err);
  notifyAdmin(err);

  if (isCriticalError(err)) {
    console.log('致命錯誤，準備關閉伺服器...');
    server.close(() => {
      process.exit(1);
    });
  } else {
    console.warn('非致命錯誤，繼續運行...');
  }
});
