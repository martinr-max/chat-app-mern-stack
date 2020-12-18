const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {type: String},
    users: [],
    messages: [{type: Schema.Types.ObjectId,ref: "Message"}]
});

module.exports = mongoose.model('Room', RoomSchema);
