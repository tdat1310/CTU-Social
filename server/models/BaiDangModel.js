const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baiDangSchema = new Schema(
  {
    TieuDe: {
      type: String,
      required: true,
    },
    NoiDung: {
      type: String,
      required: true,
    },
    TaiKhoan_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    Group: {
      type: Boolean,
      default: false,
    },
    Group_id: { type: Schema.Types.ObjectId, ref: "Group" },
    DinhKem: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
    BinhLuan: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    Tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    LikedBy: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    SavedBy: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  },
  {
    timestamps: true,
  }
);
const BaiDang = mongoose.model("Post", baiDangSchema);

module.exports = BaiDang;
