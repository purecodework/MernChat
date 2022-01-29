const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usersController = require("../controllers/users-controller");

router.post(
  "/signup",
  [check("account").not().isEmpty(), check("password").not().isEmpty()],
  usersController.signup
);

router.post("/login", usersController.login);

router.get("/test", usersController.test);

router.get(
  "/findUser",
  [check("account").not().isEmpty()],
  usersController.findUser
);

module.exports = router;
