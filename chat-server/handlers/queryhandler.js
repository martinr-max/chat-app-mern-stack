const Message = require('../model/message');
const Room = require('../model/room');

const createRoom = async function(room) {
    let name = room.name;
    await Room.findOne({
        name: name
      })
      .then(existingRoom => {
        if (existingRoom) {
            console.log('room already exists');
            return;
          }
        if (name.length !== 0) {
          return Room.create(room)
          .then(room => {
            console.log("\n>> Created room:\n", room);
            return room;
          });
        }
      })
      .catch(err => {
          return console.log(err);
      });
};
  
const addUserToRoom = async function(room) {
    let name = room.name;
    let username = room.username
    let avatar = room.avatar
    await Room.findOne({
        name: name
      })
      .then(room => {
        if (room) {
          let existingU = room.users.find(u => u.username === username)
          if (existingU) {
            console.log('user already in a room');
            return;
          }
          return Room.findByIdAndUpdate(
            room._id, {
              $push: {
                users: {
                  username: username,
                  avatar: avatar
                }
              }
            }, {
              new: true,
              useFindAndModify: false
            }
          );
        }
      })
      .catch(err => {
          return console.log(err);
      })
};
  
const getUsersInRoom = async function(room) {
    let name = room;
    let users;
    await Room.findOne({
        name: name
      })
      .then(room => {
        users = room.users;
      })
      .catch(err => {
          return console.log(err);
      }) 
    return users;
}
  
const leaveRoom = async function(room) {
    let name = room.username;
    let username = room.name;
    return Room.findOne({
        name: name
      })
      .then(async room => {
        if (room && room.users.length !== 0) {
          let existingU = await room.users.find(u => u.username === username)
          return Room.findByIdAndUpdate(
              room._id, {
                $pull: {
                  users: {
                    username: existingU.username
                  }
                }
              }, {
                new: true,
                useFindAndModify: false
              }
            )
            .then(room => {
              return room.users
            })
            .catch(err => {
                return console.log(err);
            });
        }
      });
}
  
const createMessage = async function(room, message) {
    return Message.create(message)
      .then(msg => {
        console.log("\n>> Created message:\n", msg);
        let name = room;
        Room.findOne({
            name: name
          })
          .then(room => {
            return Room.findByIdAndUpdate(
              room._id, {
                $push: {
                  messages: msg._id
                }
              }, {
                new: true,
                useFindAndModify: false
              }
            );
          })
          .catch(err => {
              return console.log(err);
          });
      });
};


const getRecentMessages = async function(room) {
    let name = room;
    let rooms;
    rooms = await Room.findOne({
        name: name
      })
      .populate({
        path: 'messages',
        options: {
          limit: 9,
          sort: {
            _id: -1
          },
        }
      })
      .catch(err => {
          return console.log(err)
      })
    return rooms;
};
  

module.exports = {
    createRoom,
    createMessage,
    addUserToRoom,
    leaveRoom,
    getRecentMessages,
    getUsersInRoom
};
