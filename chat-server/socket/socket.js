const {
   createRoom,
   createMessage,
   addUserToRoom,
   leaveRoom,
   getRecentMessages,
   getUsersInRoom} = require('../handlers/queryhandler')

const socketIO = (io) => {

  io.on("connection", async socket => {
    console.log(`Connected: ${socket.id}`);
    try {
      socket.on('join', async (username, roomName, avatar) => {
        await createRoom({
          name: roomName
        });

        await addUserToRoom({
          name: roomName,
          username: username,
          avatar
        });

        if (roomName) {
          socket.join(roomName, () => {
            console.log("Socket now in rooms", roomName);
          });

          io.in(roomName)
            .emit('broadcast', {
              message_text: `${username} has joined ${roomName}!`
            });

          io.to(roomName)
            .emit('mostRecentMessages', await getRecentMessages(roomName)
              .then(data => {
                if (data) {
                  return data.messages.reverse();
                }
              })
              .catch(err => {
                console.log(err)
              })
            );

          io.emit('usersInRoom', await getUsersInRoom(roomName)
            .then(data => {
              return data
            })
            .catch(err => {
              console.log(err);
            })
          )
        }
      });

      socket.on("send-message", async (roomName, data) => {
        room = roomName;
        await createMessage(room, {
          room: data.room,
          user_name: data.username,
          message_text: data.message,
          avatar: data.avatar
        });

        io.to(room)
          .emit("newChatMessage", {
            user_name: data.username,
            avatar: data.avatar,
            message_text: data.message
          });
      });
      
      socket.on('leave', async (username, roomName) => {
        await leaveRoom({
            name: roomName,
            username: username
          })
          .then(data => {
            io.emit('leftusers', data);
          })
        socket.leave(roomName);
        console.log('user-disconnected', roomName);
      });
    } catch (err) {
      console.log(err.message)
    }
  });
}

module.exports = socketIO;