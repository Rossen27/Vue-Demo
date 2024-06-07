import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    describe: {
      type: String,
    }, // 描述
    income: {
      type: String,
      required: true,
    }, // 收入
    expend: {
      type: String,
      required: true,
    }, // 支出
    cash: {
      type: String,
      required: true,
    }, // 現金
    remark: {
      type: String,
    }, // 備註
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;