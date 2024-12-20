const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tinNhanSchema = new Schema(
  {
    NguoiGui_id: { type: Schema.Types.ObjectId, ref: "Account" },
    NhomChat_id: { type: Schema.Types.ObjectId, ref: "Boxchat" },
    NoiDung: String,
    file: { type: Schema.Types.ObjectId, ref: "Attachment" },
    seen: [{ type: Schema.Types.ObjectId, ref: "Account" }]
  },
  {
    timestamps: true,
  }
);
const TinNhan = mongoose.model("Message", tinNhanSchema);
module.exports = TinNhan;
