const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usersController = require("../controllers/users-controller");

// get all chats for a user
router.get("/:uid", usersController.fetchChats);

// signup
router.post(
  "/signup",
  [check("account").not().isEmpty(), check("password").not().isEmpty()],
  usersController.signup
);

// login
router.post("/login", usersController.login);

router.get("/test", usersController.test);

// find a user
router.get(
  "/findUser/:account",
  [check("account").not().isEmpty()],
  usersController.findUser
);

module.exports = router;
