const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nhomNguoiDungSchema = new Schema(
  {
    TruongNhom: { type: Schema.Types.ObjectId, ref: "Account" },
    coverPic: { type: Schema.Types.ObjectId, ref: "Attachment" },
    TenNhom: String,
    ThanhVien: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    BaiViet: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    MoTa: String,
    RoleGroup: {
      accept: [{ type: Schema.Types.ObjectId, ref: "Account" }], 
      invite: [{ type: Schema.Types.ObjectId, ref: "Account" }]
    },
  },
  {
    timestamps: true,
  }
);

const NhomNguoiDung = mongoose.model("Group", nhomNguoiDungSchema);
module.exports = NhomNguoiDung;
