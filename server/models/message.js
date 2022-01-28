const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    content: { type: String },
    chat: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
