import jwt from "jsonwebtoken"; // 引入jsonwebtoken
import { errorHandler } from './error.js'; // 引入errorHandler

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // 從cookie取得token
  if (!token) return next(errorHandler(401, "請先登入")); // 如果沒有token，回傳401錯誤
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // 驗證token
    if (err) return next(errorHandler(403, "用戶無效")); // 如果token驗證失敗，回傳403錯誤
    req.user = user; // 如果token驗證成功，將user資料存入req.user
    next(); // 繼續下一步
  });
};