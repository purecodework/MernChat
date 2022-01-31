const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messages-controller");

// create a new chat
router.post("/", messagesController.createMessage);

// get all messages for a chat
router.get("/:cid", messagesController.fetchMessages);

module.exports = router;
