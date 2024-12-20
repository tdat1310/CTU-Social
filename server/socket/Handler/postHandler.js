const CommentBlog = require("../blog/commentBlog");
const LikeBlog = require("../blog/likeBlog");
const NewBlog = require("../blog/newBlog");
const SaveBlog = require("../blog/saveBlog");

module.exports = (io, socket, users) => {
  socket.on("likeBlog", (data) => LikeBlog(io, socket, users, data));
  socket.on("commentBlog",(data) => CommentBlog(io, socket, users, data));
  socket.on("saveBlog", (data) => SaveBlog(io, socket, users, data));
  socket.on("newBlog", (data) => NewBlog(io, socket, users, data));
};
