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

module.exports = router;
