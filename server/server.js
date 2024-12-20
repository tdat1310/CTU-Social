require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");
const http = require("http"); // Import http module
const app = express();
const routeArr = require("./routes/AllRoute");
const { InitSocket } = require("./socket/initSocket");
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

//routes
for (let i = 0; i < routeArr.length; i++) {
  app.use(routeArr[i][0], routeArr[i][1]);
}
app.use(errorMiddleware);

// Tạo server HTTP từ Express app
const server = http.createServer(app);

// Kết nối MongoDB và khởi động server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {  // Sử dụng server để listen
      console.log(`Node API app is running on http://localhost:${PORT}`);
      console.log("WebSocket server is running..");
    });
   InitSocket(server)
    console.log("connected to mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });
