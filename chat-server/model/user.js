const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, default: "", required: true },
    password: { type: String, default: "", required: true },
    avatar: {type: String, required: true},
})
module.exports = mongoose.model('User', UserSchema);