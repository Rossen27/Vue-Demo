import User from '../models/user.model.js';
import bcryptjs from 'bcrypt';

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
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // 3) 保存用戶
    await newUser.save();
    res.status(201).json("使用者創建成功!");
  } catch (error) {
    next(error);
  }
};
