const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const enterChat = async (req, res) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res
  //       .status(422)
  //       .json({ msg: "Account and password should not be empty" });
  //   }
  const { userId } = req.body;

  let foundUser;
  try {
    foundUser = await User.findOne({ userId });
  } catch (error) {
    return res.status(404).json({ msg: "user not exist" });
  }

  let isChat;

  // find the chat that both two converstioner exist
  try {
    isChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user._Id } } },
      ],
    });
  } catch (error) {}

  res.status(201).json({
    msg: "user created",
    userId: createdUser.id,
    account: createdUser.account,
    token: token,
  });
};

exports.enterChat = enterChat;
