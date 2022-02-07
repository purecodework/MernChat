const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Chat = require("../models/chat");
const Message = require("../models/message");

// create chat
const createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  // check if chat existed
  let isChatExist;
  try {
    isChatExist = await Chat.findOne({
      users: [senderId, receiverId],
    });
    isChatCreated = await Chat.findOne({
      users: [receiverId, senderId],
    });
    if (isChatExist || isChatCreated) {
      return res.status(409).json({ msg: "chat already existed" });
    }
  } catch (error) {
    return res.json({ error });
  }
  // save new chat to DB
  try {
    const createdChat = new Chat({
      users: [senderId, receiverId],
    });

    await createdChat.save();
    res.status(201).json({ msg: "new chat saved", senderId });
  } catch (error) {
    return res.status(500).json({ msg: "Cannot save new chat to Database" });
  }
};

// const enterChat = async (req, res) => {
//   //   const errors = validationResult(req);
//   //   if (!errors.isEmpty()) {
//   //     return res
//   //       .status(422)
//   //       .json({ msg: "Account and password should not be empty" });
//   //   }
//   const { userId } = req.body;

//   let foundUser;
//   try {
//     foundUser = await User.findOne({ userId });
//   } catch (error) {
//     return res.status(404).json({ msg: "user not exist" });
//   }

//   let isChat;

//   // find the chat that both two sender and receiver exist
//   try {
//     isChat = await Chat.findOne({
//       isGroupChat: false,
//       $and: [
//         { users: { $elemMatch: { $eq: userId } } },
//         { users: { $elemMatch: { $eq: req.user._Id } } },
//       ],
//     });

//     const users = isChat.users;
//     const latestMessage = isChat.latestMessage;

//   } catch (error) {}

//   res.status(201).json({
//     msg: "user created",
//     userId: createdUser.id,
//     account: createdUser.account,
//     token: token,
//   });
// };

exports.createChat = createChat;
