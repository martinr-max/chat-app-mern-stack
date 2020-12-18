import React from 'react';
import { Avatar } from '@material-ui/core';
import './Message.css';


export default function Message({id, user_name, userName, message, avatar}) {
   
    return(
        <React.Fragment>
        {userName === user_name ?
            <div key={id} className="messageContainer justifyEnd" >
                <Avatar src={`http://localhost:8080/${avatar}`} alt={userName} />
                <div className="messageBox backgroundBlue">
                    <p className="messageText colorWhite"> {message} </p>
                </div>
            </div>          
        : <div key={id} className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
                <p className="messageText colorDark"> {message} </p>
            </div>
                <Avatar src={`http://localhost:8080/${avatar}`} alt={userName} />
            </div>}
        </React.Fragment>
    );
    
}