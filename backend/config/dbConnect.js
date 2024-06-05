import mongoose from 'mongoose';

export const connectDatabase = () => {
  let DB_URI = '';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    DB_URI = process.env.DB_LOCAL_URI;
  } else if (process.env.NODE_ENV === 'PRODUCTION') {
    DB_URI = process.env.DB_URI;
  } else {
    console.error('未知的 NODE_ENV，無法設置資料庫 URI。');
    return;
  }

  mongoose.connect(DB_URI)
    .then((con) => {
      console.log(`成功連接到 MongoDB 主機：${con.connection.host}`);
    })
    .catch(handleDatabaseConnectionError);
};

const handleDatabaseConnectionError = (err) => {
  console.error(`無法連接到 MongoDB 主機：${err.message}`);
  // 在這裡你可以進行進一步的錯誤處理，例如重試連接或發送通知給系統管理員
};

