const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baoCaoSchema = new Schema(
  {
    NoiDung: { type: String, required: true },
    Reporter: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    ownerPost: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    BaiViet_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    
    state: { type: Boolean, default: false }, // Thêm trường state với giá trị mặc định là false
    Nhom_id: { type: Schema.Types.ObjectId, ref: "Group" },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", baoCaoSchema);
module.exports = Report;
