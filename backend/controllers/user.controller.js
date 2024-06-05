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
  // 1) 檢查用戶是否已經存在
  User.findOne({ email: req.body.email })
    .then((user) => {
      if(user) {
        return res.status(400).json({ email: '此電子郵件已被註冊' });
      } else {
        // 2) 創建新用戶
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // 3) 將密碼加密
        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            // 4) 保存用戶
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      } 
    })
    .catch(err => console.log(err));
};
