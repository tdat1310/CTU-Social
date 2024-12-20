const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dinhKemSchema = new Schema(
  {
    download_url: String,
    display_url: String,
    drive_file_id: String,
    name_file: String, 
    type: String,
    mimeType: String,
    BaiDang_id: { type: Schema.Types.ObjectId, ref: "Post" },
    TaiKhoan_id: {type: Schema.Types.ObjectId, ref: "Account" },
    TinNhan_id: {type: Schema.Types.ObjectId, ref: "Message"}
  },
  {
    timestamps: true,
  }
);

const DinhKem = mongoose.model("Attachment", dinhKemSchema);
module.exports = DinhKem;
