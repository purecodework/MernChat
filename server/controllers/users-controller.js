const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ msg: "Account and password should not be empty" });
    return;
  }
  const { account, password } = req.body;
  const foundUser = await User.findOne({ account: account });

  if (foundUser) {
    res.status(409).json({ msg: "user already existed" });
    return;
  }

  //hash password
  let hashedPassword = await bcrypt.hash(password, 12);

  //save new user to DB
  const createdUser = new User({
    account,
    password: hashedPassword,
  });

  createdUser.save();

  //create token for new signup user
  let token = jwt.sign({ userId: createdUser.id }, process.env.PRIVATE_KEY, {
    expiresIn: "2h",
  });

  res.status(201).json({
    msg: "user created",
    userId: createdUser.id,
    account: createdUser.account,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { account, password } = req.body;
  console.log("acc,ps:" + account, password);
  if (!account || !password) {
    res.status(400).json({
      msg: "Missing account or password",
    });
    return;
  }

  try {
    let userInstance = await User.findOne({ account });

    if (userInstance.account === account) {
      let isPasswordValid = await bcrypt.compare(
        password,
        userInstance.password
      );
      console.log(userInstance.password);
      console.log("isPasswordValid" + isPasswordValid.toString());

      if (isPasswordValid) {
        let token = await jwt.sign(
          { userId: userInstance.id, account: userInstance.account },
          process.env.PRIVATE_KEY,
          { expiresIn: "300" }
        );

        res.status(201).json({
          msg: "User Logged In",
          userId: userInstance.id,
          account: userInstance.account,
          token: token,
        });
      } else {
        res.status(403).json({
          msg: "wrong account password combination",
        });
        next();
      }
    }
  } catch (e) {
    console.error(e);
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

exports.signup = signup;
exports.login = login;
exports.test = test;
