const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nhomChatSchema = new Schema(
  {
    type:  {type: String, default: "user"},
    TinNhan: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    ThanhVien: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    groupChatName: String,
    // MissMsg: {type: Number, default: 0}
  },
  {
    timestamps: true,
  }
);

const NhomChat = mongoose.model("boxchat", nhomChatSchema);
module.exports = NhomChat;
