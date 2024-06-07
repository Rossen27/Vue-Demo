// 處理 async 錯誤
export default (controllerFunction) => (req, res, next) =>
  Promise.resolve(controllerFunction(req, res, next)).catch(next); // 使用 Promise.resolve() 方法，並傳入 controllerFunction(req, res, next) 函式，以處理錯誤，並使用 .catch() 方法，並傳入 next 函式，以處理錯誤
