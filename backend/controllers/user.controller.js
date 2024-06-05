import User from '../models/user.model.js';
import bcryptjs from 'bcrypt';
import gravatar from 'gravatar';
import { admin, db } from '../utils/firebase.js'; // 導入 Firebase 相關模塊
import jwt from 'jsonwebtoken';

export const test = (req, res) => {
  res.json({
    message: 'Hello World',
  });
};

// Route: POST /api/user/register
// Desc: 返回請求的json數據
// Access: Public
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    // 1) 檢查用戶是否已經存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ email: '此電子郵件已被註冊' });
    }

    // 2) 創建新用戶
    const hashedPassword = await bcryptjs.hash(password, 10);
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
    const newUser = new User({
      name,
      email,
      avatar,
      password: hashedPassword,
    });

    // 3) 保存用戶
    await newUser.save();

    // 使用 Firebase 創建新用戶
    const userRecord = await admin.auth().createUser({
      displayName: name,
      email,
      password,
    });

    res.status(201).json('使用者創建成功!');
  } catch (error) {
    next(error);
  }
};

// Route: POST /api/user/login
// Desc: 返回token jwt passport
// Access: Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // 1) 檢查用戶是否存在
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ email: '用戶不存在' });
    }

    // 2) 驗證密碼
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ password: '密碼不正確' });
    }

    // 3) 生成 token，只包含用戶 _id 屬性
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.cookie("access_token", token, { httpOnly: true, secure: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
