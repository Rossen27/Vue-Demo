import profile from "../models/profile.model.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

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