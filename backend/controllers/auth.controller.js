import User from '../models/user.model.js';
import bcryptjs from 'bcrypt';
import gravatar from 'gravatar';
import { admin, db } from '../utils/firebase.js'; // 導入 Firebase 相關模塊
import jwt from 'jsonwebtoken';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';

// TODO: 用戶註冊
// Route: POST /api/auth/register
// Desc: 返回請求的json數據
// Access: Public
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 檢查用戶是否已經存在
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ email: '此電子郵件已被註冊' });
  }

  // 創建新用戶
  const hashedPassword = await bcryptjs.hash(password, 10);
  const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
  const newUser = new User({
    name,
    email,
    avatar,
    password: hashedPassword,
  });

  // 保存用戶
  await newUser.save();

  // 使用 Firebase 創建新用戶
  await admin.auth().createUser({
    displayName: name,
    email,
    password,
  });

  // 生成 token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(201).json('使用者創建成功!');
});

// TODO: 用戶登入
// Route: POST /api/auth/login
// Desc: 返回token jwt passport
// Access: Public
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // 檢查用戶是否存在
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ email: '用戶不存在' });
  }

  // 驗證密碼
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ password: '密碼不正確' });
  }

  // 生成 token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(200).json({ token });
});

// TODO: Google 登入
// Route: POST /api/auth/google
// Desc: 返回token jwt passport
// Access: Public
export const google = catchAsyncErrors(async (req, res, next) => {
  const { email, name, photo } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    // 生成一個隨機密碼
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    user = new User({
      name:
        // file deepcode ignore HTTPSourceWithUncheckedType: <>
        name.split(' ').join('').toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar: photo,
    });

    await user.save();

    // 使用 Firebase 創建新用戶
    await admin.auth().createUser({
      displayName: name,
      email,
      password: generatedPassword, // 使用生成的隨機密碼
    });
  } else {
    // 確保 Firebase 中也存在
    await admin
      .auth()
      .getUserByEmail(email)
      .catch(async (error) => {
        if (error.code === 'auth/user-not-found') {
          await admin.auth().createUser({
            displayName: name,
            email,
            password:
              Math.random().toString(36).slice(-8) +
              Math.random().toString(36).slice(-8),
          });
        } else {
          throw error;
        }
      });
  }

  // 生成 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // 從用戶對象中刪除密碼
  const { password, ...userWithoutPassword } = user.toObject();

  // 返回用户資料和 token
  res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    .status(200)
    .json({ user: userWithoutPassword, token });
});

// TODO: 用戶登出
// Route: GET /api/auth/logout
// Desc: 清除用戶 cookie
// Access: Private
export const logout = (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: '用戶登出成功' });
};
