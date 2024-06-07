class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor); // 取得錯誤堆疊
  }
}

// 工廠函數，用於創建 ErrorHandler 錯誤對象
export const createError = (statusCode, message) => {
  return new ErrorHandler(message, statusCode);
};

export default ErrorHandler;
