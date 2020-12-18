import React from 'react';
import Message from '../message/Message';


export default function CurrentMessages({messages, user_name}) {

    return(
        <React.Fragment>
            {messages && user_name && messages.map(msg => {
                return <Message
                        id = {msg._id}
                        userName={msg.user_name}
                        user_name={user_name}
                        avatar={msg.avatar}
                        message={msg.message_text}
               />
               })
            }
          
        </React.Fragment>
    );
}