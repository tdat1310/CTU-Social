const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    TenTag: String,
    baiDang_id: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);
const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
