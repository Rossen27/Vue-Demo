import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// 檢查用戶是否經過身分驗證
export const isAuthenticatedUser = catchAsyncErrors(
  async (req, res, next) => {
    const { token } = req.cookies; // 從客戶端的 cookie 中取得 token

    if (!token) {
      return next(new ErrorHandler("請先登入", 401)); // 如果沒有 token，回傳錯誤訊息
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 解碼 token
    req.user = await User.findById(decoded.id); // 從資料庫中找尋用戶

    next();
  }
);

// 檢查用戶的角色
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) { // 如果用戶的角色不在參數中
      return next(
        new ErrorHandler(
          `此功能 ${req.user.role} 無法使用`,
          403
        )
      );
    }
    next();
  };
};