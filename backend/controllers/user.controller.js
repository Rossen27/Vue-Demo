import User from '../models/user.model.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import bcryptjs from 'bcrypt';
import { admin } from '../utils/firebase.js';

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

// TODO: 編輯用戶
// Route: PUT /api/user/update
// Desc: 編輯用戶
// Access: Private
export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { password, role, ...updateData } = req.body;

  // 檢查是否包含 role 字段並防止其被更改
  if (role) {
    return next(new ErrorHandler('此帳戶無此權限', 400));
  }

  // 如果有密碼，加密後再存儲
  if (password) {
    const salt = await bcryptjs.genSalt(10);
    updateData.password = await bcryptjs.hash(password, salt);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler('找不到用戶', 404));
  }

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

// TODO: Admin-編輯單一用戶
// Route: PUT /api/admin/user/:id
// Desc: 編輯單一用戶
// Access: Private/Admin
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { password, ...updateData } = req.body;

  if (password) {
    const salt = await bcryptjs.genSalt(10);
    updateData.password = await bcryptjs.hash(password, salt);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler('找不到用戶', 404));
  }


  res.status(200).json({
    success: true,
    user,
  });
});

// TODO: Admin-刪除單一用戶
// Route: DELETE /api/admin/user/:id
// Desc: 刪除單一用戶
// Access: Private/Admin
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId); // 取得用戶 ID

  if (!user) {
    return next(new ErrorHandler('找不到用戶', 404));
  }

  await User.findByIdAndDelete(userId); // 刪除用戶

  // 同步刪除 Firebase Authentication 中的用戶資料
  try {
    await admin.auth().deleteUser(user.firebaseUid);
  } catch (error) {
    console.error('刪除 Firebase Authentication 用戶資料時發生錯誤：', error);
  }

  res.status(200).json({
    success: true,
    message: '用戶已刪除',
  });
});
