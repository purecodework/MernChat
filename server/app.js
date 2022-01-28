const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const data = require("./data");
const express = require("express");

const usersRoute = require("./routes/users-route");
const res = require("express/lib/response");

const app = express();

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

app.get("/api/v1/chats", (req, res) => res.send(data.data));

app.get("/api/v1/chats/:id", (req, res) => {
  const chat = data.data.find((x) => x._id === req.params.id);
  res.send(chat);
});

//404 page
app.use((req, res) => {
  res.status(404).json({ msg: "route not exist" });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => app.listen(process.env.PORT || 8080))
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));
