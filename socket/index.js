const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
io.on("connection", (socket) => {
  //經過連線後在 console 中印出訊息
  console.log("success connect!");
  //監聽透過 connection 傳進來的事件
  io.emit("welcome", "Hello");
  io.emit("welcome", "Fuck!!! Finally!!!");
  io.emit("welcome", "shit");
});
