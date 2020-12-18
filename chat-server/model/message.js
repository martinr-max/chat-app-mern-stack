const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  id: {type: Schema.Types.ObjectId},
  room: {
    type: String
},
  message_text: {
        type: String,
  },
  user_name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);