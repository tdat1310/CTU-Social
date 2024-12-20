const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const thongBaoSchema = new Schema(
  {
    TaiKhoan_id: { type: Schema.Types.ObjectId, ref: "Account" },
    NoiDung: {},
    fromUser: { type: Schema.Types.ObjectId, ref: "Account" },
    fromPost: { type: Schema.Types.ObjectId, ref: "Post" },
    fromGroup: { type: Schema.Types.ObjectId, ref: "Group" },
    fromChat: { type: Schema.Types.ObjectId, ref: "Boxchat" },
    seen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ThongBao = mongoose.model("notification", thongBaoSchema);
module.exports = ThongBao;
