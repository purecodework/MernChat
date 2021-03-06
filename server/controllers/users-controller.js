const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Chat = require("../models/chat");
const Message = require("../models/message");

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ msg: "Account and password should not be empty" });
  }
  const { account, password } = req.body;

  let foundUser;
  try {
    foundUser = await User.findOne({ account: account });
  } catch (error) {
    res.json({ msg: "signup failed" });
  }
  if (foundUser) {
    return res.status(422).json({ msg: "user already existed" });
  }

  //hash password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch {
    return res.status(500).json({ msg: "hashing password failed" });
  }

  // save new user to DB
  const createdUser = new User({
    account,
    password: hashedPassword,
  });
  // save to DB
  try {
    await createdUser.save();
  } catch (error) {
    return res.status(500).json({ msg: "Cannot save user to Database" });
  }

  // create token for new signup user
  let token;
  try {
    token = jwt.sign({ userId: createdUser.id }, process.env.PRIVATE_KEY, {
      expiresIn: "2h",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Cannot sign token" });
  }

  res.status(201).json({
    msg: "user created",
    userId: createdUser.id,
    account: createdUser.account,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({
      msg: "Missing account or password",
    });
  }

  let foundUser;
  try {
    foundUser = await User.findOne({ account: account });
  } catch (error) {
    return res.status(500).json({ msg: "could not log you in" });
  }

  if (!foundUser) {
    return res.status(404).json({ msg: "user not exist" });
  }

  let isPasswordValid = false;
  try {
    isPasswordValid = await bcrypt.compare(password, foundUser.password);
  } catch (error) {
    return res.status(500).json({ msg: "bcrypt fails" });
  }

  if (!isPasswordValid) {
    return res.status(403).json({ msg: "invalid password" });
  }

  let token;
  try {
    token = await jwt.sign(
      { userId: foundUser.id, account: foundUser.account },
      process.env.PRIVATE_KEY,
      { expiresIn: "300" }
    );
  } catch (error) {
    return res.status(500).json({ msg: "could not sign token" });
  }
  try {
    res.status(200).json({
      userId: foundUser.id,
      token: token,
    });
  } catch (e) {
    res.json({ msg: "something wrongs" });
  }
};

// fetch all chats for user
const fetchChats = async (req, res) => {
  const userId = req.params.uid;
  let chats;
  let latestMessange;
  let chatsIDs;

  try {
    chats = await Chat.find({ users: { $in: [userId] } })
      .populate("users", "account")
      .sort({ updatedAt: -1 });
    // .populate("latestMessage");
    // .populate("messages");

    if (chats) {
      res.status(201).json({ chats });
    } else {
      res.status(400).json({ msg: "not found" });
    }
  } catch (error) {
    return res.json({ msg: "cannot fetch your chats data" });
  }
};

const test = async (req, res) => {
  try {
    let allUsers = await User.find();
    res.status(201).json({
      msg: "all users",
      data: allUsers,
    });
  } catch (error) {
    res.json({ error });
  }
};

const findUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ msg: "Account must not be empty" });
  }
  const { account } = req.params;

  try {
    const foundUser = await User.findOne({ account: account });
    if (foundUser) {
      res.status(200).json({ foundUser });
    }
    res.status;
  } catch (error) {
    console.log(error);
    res.json({
      error,
    });
  }
};

exports.signup = signup;
exports.login = login;
exports.test = test;
exports.findUser = findUser;
exports.fetchChats = fetchChats;
