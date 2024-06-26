import mongoose from 'mongoose'; // TODO 使用者資料庫設定

// 建立使用者規則
const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String // 新增的欄位用於存儲 Firebase UID
    },
    name: {
      type: String,
      required: true, // 這個屬性確保了名稱的必填
      trim: true, // 這個屬性移除了名稱的前後空格
      minlength: 3, // 這個屬性確保了名稱的最小長度
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true, // 這個屬性確保了電子郵件地址的必填
      unique: true, // 這個屬性確保了電子郵件地址的唯一性
      trim: true, // 這個屬性移除了電子郵件地址的前後空格
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String, // 這個屬性確保了重置密碼令牌的唯一性
    resetPasswordExpire: Date, // 這個屬性確保了重置密碼的有效期
  },
  { timestamps: true }
); // 這個選項確保了創建和更新日期的自動生成

const User = mongoose.model('User', userSchema); // 建立模組

export default User; // 導出模組
