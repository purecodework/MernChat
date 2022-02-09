const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
dotenv.config();

let users = [];

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const findSocketId = (userId) => {
  let user = users.find((u) => u.userId === userId);
  if (user) {
    return user.socketId;
  }
};

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    // !! check if user connected before, if had, update socketID
    let userIndex = users.findIndex((u) => u.userId === userId);

    if (userIndex >= 0) {
      let newUsers = [...users];
      newUsers[userIndex].socketId = socket.id;
    } else {
      let user = { userId: userId, socketId: socket.id };
      users = [...users, user];
    }
  });

  socket.on("send message", ({ chatId, sender, takerId, content }) => {
    let takerSocketId = findSocketId(takerId);
    if (takerSocketId) {
      console.log("received a message from front end" + content);
      console.log("receuvers socketid" + takerSocketId);
      io.to(takerSocketId).emit("receive message", {
        chatId,
        sender,
        content,
      });
      console.log(" msg sent");
    }
  });

  // socket.emit("receive message", { chatId, sender, content });

  const count = io.engine.clientsCount;
  console.log("current connected" + count);
});

const usersRoute = require("./routes/users-route");
const chatsRoute = require("./routes/chats-route");
const messagesRoute = require("./routes/messages-route");

app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.get("/", (req, res) => res.json({ msg: "Hi" }));

app.use("/api/v1/users", usersRoute);

app.use("/api/v1/chats", chatsRoute);

app.use("/api/v1/messages", messagesRoute);

//404 page
app.use((req, res) => {
  res.status(404).json({ msg: "route not exist" });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("DB connected"))
  .then(() =>
    server.listen(process.env.PORT || 8080, () =>
      console.log("server listening in")
    )
  )
  .catch((e) => console.log(e));
