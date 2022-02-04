const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chatId: {
      type: "String",
      required: true,
      // ref: "Chat",
      // type: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    },
    sender: {
      type: String,
      required: true,
    },

    content: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
