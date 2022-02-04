const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");

const usersRoute = require("./routes/users-route");
const chatsRoute = require("./routes/chats-route");
const messagesRoute = require("./routes/messages-route");

const app = express();

const server = app.listen(process.env.PORT || 8080);

app.use(express.json());
const io = require("socket.io")(server, {
  pintTimeout: 10000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("IO is on");
});

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

// app.get("/api/v1/chats/:id", (req, res) => {
//   const chat = data.data.find((x) => x._id === req.params.id);
//   res.send(chat);
// });

//404 page
app.use((req, res) => {
  res.status(404).json({ msg: "route not exist" });
});

mongoose
  .connect(process.env.DB_URI)
  // .then(() => app.listen(process.env.PORT || 8080))
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));
