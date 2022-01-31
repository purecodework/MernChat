const Chat = require("../models/chat");
const Message = require("../models/message");

// create chat
const createMessage = async (req, res) => {
  const { chatId, sender, content } = req.body;

  let createdMessage;
  try {
    const createdMessage = new Message({ chatId, sender, content });

    await createdMessage.save();
    res.status(201).json({ msg: "Success", chatId, sender, content });
  } catch (error) {
    return res.status(500).json({ msg: "Cannot save new chat to Database" });
  }
};

// fetch all messages in chat
const fetchMessages = async (req, res) => {
  const chatId = req.params.cid;
  console.log("req receive" + chatId);
  let messages;
  try {
    messages = await Message.find({
      chatId: chatId,
    });

    res.status(201).json(messages);
  } catch (error) {
    return res.json({ error });
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

exports.createMessage = createMessage;
exports.fetchMessages = fetchMessages;
