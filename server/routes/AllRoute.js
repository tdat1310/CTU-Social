const TaiKhoanRoute = require("./TaiKhoanRoute");
const BaiDangRoute = require("./BaiDangRoute");
const InfoRoute = require("./InfoRoute");
const BoxChatRoute = require("./NhomChatRoute");
const GroupRoute = require("./NhomNguoiDungRoute");
const AuthRoute = require("./AuthRoute");
const NotifyRoute = require("./ThongBaoRoute");
const chatRoute = require("./ChatRoute");
const BaoCaoRoute = require("./BaoCaoRoute")
const routeArr = [
  ["/api/accounts", TaiKhoanRoute],
  ["/api/posts", BaiDangRoute],
  ["/api/infos", InfoRoute],
  ["/api/boxchats", BoxChatRoute],
  ["/api/groups", GroupRoute],
  ["/api/auth", AuthRoute],
  ["/api/notify", NotifyRoute],
  ["/api/chat", chatRoute],
  ["/api/report", BaoCaoRoute]
];
module.exports = routeArr;
