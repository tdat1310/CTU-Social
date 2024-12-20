const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const binhLuanSchema = new Schema(
  {
    baiDang_id: { type: Schema.Types.ObjectId, ref: "Post" },
    taiKhoan_id: { type: Schema.Types.ObjectId, ref: "Account" },
    NoiDung: String,
  },
  {
    timestamps: true,
  }
);
const BinhLuan = mongoose.model("Comment", binhLuanSchema);
module.exports = BinhLuan;
