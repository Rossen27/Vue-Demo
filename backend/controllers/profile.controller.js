import profile from "../models/profile.model.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// TODO: 新增資料
// Route: POST /api/addProfiles
// Desc: 建立資料庫中所有使用者的概要
// Access: Private
export const addProfiles = catchAsyncErrors(async (req, res, next)=> {
  const {
    type,
    describe,
    income,
    expend,
    cash,
    remark,
  } = req.body;
  const profiles = await profile.create({
    type,
    describe,
    income,
    expend,
    cash,
    remark,
    user: req.user._id,
  });
  res.status(201).json(profiles);
});

// TODO: 取得所有資料
// Route: GET /api/profiles
// Desc: 取得所有資料
// Access: Private
export const getAllProfiles = catchAsyncErrors(async (req, res, next) => {
  const profiles = await profile.find(); // 取得所有資料
  
  res.status(200).json({
    success: true,
    profiles,
  });
});

// TODO: 取得單一資料
// Route: GET /api/profiles/:id
// Desc: 取得單一資料
// Access: Private
export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const profiles = await profile.findById(req.params.id); // 取得單一資料

  if (!profiles) {
    return res.status(404).json({
      success: false,
      message: '找不到資料',
    });
  }

  res.status(200).json({
    success: true,
    profiles,
  });
});

// TODO: 編輯資料
// Route: POST /api/edit/:id
// Desc: 編輯資料
// Access: Private
export const editProfile = catchAsyncErrors(async (req, res, next) => {
  const profileId = req.params.id;
  
  let profiles = await profile.findById(profileId); // 取得單一資料

  if (!profiles) {
    return res.status(404).json({
      success: false,
      message: '找不到資料',
    });
  }

  profiles = await profile.findByIdAndUpdate(profileId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    profiles,
  });
});

// TODO: 刪除資料
// Route: DELETE /api/delete/:id
// Desc: 刪除資料
// Access: Private
export const deleteProfile = catchAsyncErrors(async (req, res, next) => {
  const profileId = req.params.id;
  
  const profiles = await profile.findById(profileId); // 取得單一資料

  if (!profiles) {
    return next(new ErrorHandler('資料', 404));
  }

  await profile.findByIdAndDelete(profileId);

  res.status(200).json({
    success: true,
    message: '刪除成功',
  });
});
