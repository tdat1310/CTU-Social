const inviteJoinGroup = require("../user/group/inviteJoinGroup");
const FollowUser = require("../user/follow/followUser");
const AddMemberGroupChat = require("../user/message/addMember");
const CreateGroupChat = require("../user/message/createGroupChat");
const deleteBoxChat = require("../user/message/deleteBoxChat");
const SendMessage = require("../user/message/sendMessage");
const requestApprovalForJoinGroup = require("../user/group/requestApprovalForJoinGroup");
module.exports = (io, socket, users) => {
  socket.on("followUser", (data) => FollowUser(io, socket, users, data));
  socket.on("sendMessage", (data) => SendMessage(io, socket, data, users));
  // socket.on("createNewBoxChat",(data) => SendMessage(io, socket, data) )
  socket.on("createGroupChat", (data) =>
    CreateGroupChat(io, socket, data, users)
  );
  socket.on("AddMemberGroupChat", (data) =>
    AddMemberGroupChat(io, socket, data, users)
  );
  socket.on("deteleBoxChat", (data) => deleteBoxChat(io, socket, data, users));
  socket.on("inviteJoinGroup", (data) =>
    inviteJoinGroup(io, socket, data, users)
  );
  socket.on("approve_join_request", (data) =>
    requestApprovalForJoinGroup(io, socket, data, users)
  );
};
