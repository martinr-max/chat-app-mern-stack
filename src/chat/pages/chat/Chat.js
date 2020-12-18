import React, { useState, useEffect, useContext, useRef } from 'react';
import SocketContext from '../../../context/socketContext';
import {useHistory } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import { Grid } from '@material-ui/core';
import RecentMessages from '../../components/RecentMessages/RecentMessages';
import CurrentMessages from '../../components/currentMessages/CurrentMessages';
import UserList from '../../components/users/UserList';
import ChatPanel from '../../components/chatPanel/ChatPanel';
import './Chat.css';
 
export default function Chat(props) {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [users, setUsers] = useState([])
    const [user_name, setUser_name] = useState('');
    const [roomName, setRoomName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [loggedIn, setLoggedIn] = useState('');

    const socket = useContext(SocketContext);
    const history = useHistory();
  
    const  user  = props.location.state.userName;
    const  room  = props.location.state.room;
    const  avatar = props.location.state.avatar;

    let sendMessage = useRef();
    let disconnectUser = useRef();

    useEffect(() => {
      setUser_name(user);
      setRoomName(room);
      setUserAvatar(avatar);
      socket.emit('join', user_name, roomName, userAvatar);
      
      socket.on('broadcast', data => {
        setLoggedIn(data.message_text);
      });   
    }, [user, user_name, room, roomName, socket, avatar, userAvatar]);
    
    
    useEffect(() => {
      socket.on('mostRecentMessages', data => {
        setRecentMessages(data);
      });
    }, [recentMessages, socket]);
    
    useEffect(() => {
      socket.on('usersInRoom', users => {
        setUsers(users);
      });
    }, [socket]);
    
    useEffect(() => {
      socket.on('newChatMessage', message => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    }, [socket]);
    
    const handleChatInput = (event) => {
      setMessage({
        [event.target.name]: event.target.value,
        username: user_name,
        avatar: userAvatar,
        room: roomName,
      });
    }
    
    useEffect(() => {
      sendMessage.current = () => {
        socket.emit('send-message', roomName, message, avatar);
      };
    }, [socket, message, roomName, avatar]);
    
    useEffect(() => {
      disconnectUser.current = async () => {
        socket.emit('leave', roomName, user_name);
        history.push("/");
      };
      window.onunload = async () => {
        socket.emit('leave', roomName, user_name);
      };
      socket.on('leftusers', data => {
        setUsers(data);
      });
    }, [socket, roomName, user_name, history]);
   
 
  return(
    <Container>
      <Grid  container item xl={true}>
        <Grid className="userList" item={3}>
          <UserList avatar={avatar} users={users} />
        </Grid>
        <Grid item xl={true} style={{height:"40rem"}}>
          <div className="mainContainer">
           <ChatPanel loggedIn={loggedIn} disconnectUser={disconnectUser.current} />
            <div className="chat-messages-show-container">
              <ul className="chat-messages-show-list">
                <RecentMessages recentMessages={recentMessages} user_name={user_name} avatar={avatar} />
                <CurrentMessages messages={messages} user_name={user_name} avatar={avatar} />
              </ul>
            </div>
            <div className="chat-messages-create-container footer">
              <input name="message" onChange={handleChatInput} className="chat-messages-create-input" type="text" />
              <button type="submit" className="chat-messages-create-button" onClick={e=> sendMessage.current()} > Send </button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
    );
}
