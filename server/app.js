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
  console.log("finding... socket id for " + userId);
  let user = users.find((u) => u.userId === userId);
  if (user) {
    return user.socketId;
  }
};

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("setup", (userId) => {
    console.log("user " + userId + "joined, socketId" + socket.id);
    console.log("socketID is" + socket.id);
    let user = { userId: userId, socketId: socket.id };
    // check if array contains user already
    let foundUser = users.find((u) => u.userId === userId);
    if (foundUser) {
      console.log("user already exist");
      return;
    } else {
      users = [...users, user];
      console.log("new user");
    }
  });

  // socket.on("join chat", (chatId) => {
  //   console.log("join chat");
  //   socket.join(chatId);
  //   console.log("join room " + chatId);
  // });

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
