const express = require("express");
const router = express.Router();
const chatsController = require("../controllers/chats-controller");

// create a new chat
router.post("/", chatsController.createChat);

module.exports = router;
