const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taiKhoanSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    
    },
    email: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    avtPic: { type: Schema.Types.ObjectId, ref: "Attachment" },
    coverPic: { type: Schema.Types.ObjectId, ref: "Attachment" },
    ChuyenNganh: String,
    Khoa: String,
    TheoDoi: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    NguoiTheoDoi: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    NhomNguoiDung: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    BaiDang: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    NhomChat: [{ type: Schema.Types.ObjectId, ref: "Boxchat" }],
    ThongBao: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
    SavedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    TagFollow: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    Blocked: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const TaiKhoan = mongoose.model("Account", taiKhoanSchema);

module.exports = TaiKhoan;
