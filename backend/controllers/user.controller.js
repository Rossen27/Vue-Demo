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


