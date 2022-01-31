const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chatId: {
      type: String,
      // type: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    },
    sender: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },

    content: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
