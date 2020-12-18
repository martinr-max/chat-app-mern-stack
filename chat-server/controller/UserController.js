const bcrypt = require("bcryptjs");
const User = require('../model/user');
const Room = require('../model/room');

const getUsers = async (req, res, next) => {

  let users;
  try {
    users = await User.find();
  } 
  catch (err) {
    res.status(200)
    .json({
      message: "No users were found"
    });

  }
  res.status(200)
    .json({
      users: users.map(user => user.toObject({
        getters: true
      }))
    });
}

const signUp = async (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      username: username
    })
  } 
  catch (err) {
    return res.status(401)
      .json({
        message: "User not found"
      });
  }

  if (existingUser) {
    return res.status(401)
      .json({
        message: "User already exists"
      });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } 
  catch (err) {
    return err.message
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
    avatar: req.file.path
  });

  try {
    await createdUser.save();
  } 
  catch (err) {
    return res.status(401)
      .json({message: "Sign up failed"});

  }

  return res.status(201)
    .json({
      userId: createdUser.id,
      username: createdUser.username,
      avatar: createdUser.avatar
    });
};

const login = async (req, res, next) => {
  const {
    username,
    password,
    room,
  } = req.body;
  let existingUser;
  let roomControl;
  let userInRoom;

  try {
    existingUser = await User.findOne({
      username: username
    })
  }
  catch (err) {
    return res.status(401)
      .json({
        message: "User not found"
      });
  }

  if (!existingUser) {
    return res.status(401)
      .json({
        message: "No user found"
      });

  };

  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, existingUser.password)
  }
  catch (err) {
    return res.status(401)
      .json({
        message: "Wrong password"
      });

  }

  if (!validPassword) {
    return res.status(401)
      .json({
        message: "Log in failed"
      });

  }
  try {
    roomControl = await Room.findOne({
      name: room
    });

  }
  catch (err) {
    return res.status(401)
      .json({
        message: "Log in failed"
      });
  }

  try {
    if (!room && roomControl.users.length !== 0) {
      userInRoom = await roomControl.users.find(u => u.username === username);
    }
  }
  catch (err) {
    return res.status(401)
      .json({
        message: "No users found"
      });
  }

  if (userInRoom) {
    return res.status(401)
      .json({
        message: "User is already in a room"
      });

  }

  res.status(200)
    .json({
      userId: existingUser.id,
      username: existingUser.username,
      room: room,
      avatar: existingUser.avatar
    });
}

exports.getUsers = getUsers;
exports.login = login;
exports.getUsers = getUsers;
exports.signUp = signUp;