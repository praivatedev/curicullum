const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },

  email: {
    required: true,
    type: String
  },

  message: {
    required: true,
    type: String
  },

  read: {
    type: Boolean,
    default: false // new messages are unread by default
  }
}, { timestamps: true }); // optional: adds createdAt and updatedAt fields

module.exports = mongoose.model("Message", messageSchema);
