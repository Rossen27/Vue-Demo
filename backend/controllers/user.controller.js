import User from "../models/user.model.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// TODO:用戶查詢
// Route: GET /api/user/current
// Desc: 返回當前用戶資料
// Access: Private
export const current = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});


// TODO: Admin-取得所有用戶
// Route: GET /api/admin/users
// Desc: 取得所有用戶
// Access: Private/Admin
export const getUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});