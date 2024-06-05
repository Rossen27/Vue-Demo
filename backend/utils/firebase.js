// backend/utils/firebase.js
import dotenv from 'dotenv';
import admin from 'firebase-admin'; // 導入 Firebase 模塊
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 獲取當前模塊的 URL
const __filename = fileURLToPath(import.meta.url);
// 從 URL 中獲取目錄路徑
const __dirname = dirname(__filename);

// 使用 dotenv 加載配置文件
dotenv.config({ path: resolve(__dirname, '../config/config.env') });

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'vue-demo-9360a.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { admin, db, bucket }; // 導出 Firebase 相關變量
