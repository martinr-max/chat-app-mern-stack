import React from 'react';
import './UserList.css'
import { Avatar } from '@material-ui/core';


export default function UserList({users}) {

    return(
        <div className="userList_container">
            <h3 className="userList_headLine"> Users in room </h3>
                <ul>
                    {users && users.map((user, index) => {
                        return <li key={index}>
                            <Avatar src={`http://localhost:8080/${user.avatar}`} alt={user.username} />
                            {user.username}
                            </li>  
                    })}    
                </ul>
        </div>
    );  
}
