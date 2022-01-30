const express = require("express");
const router = express.Router();
const chatsController = require("../controllers/chats-controller");

router.post("/", chatsController.enterChat);
// router.get("/", chatsController.fetchChat);
// router.get("/group", chatsController.createGroupChat);

module.exports = router;
