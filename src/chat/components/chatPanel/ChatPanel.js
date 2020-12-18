import React from 'react';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export default function ChatPanel({loggedIn, disconnectUser}) {
    return(
     <div className="admin_message">
        <h3> {loggedIn} </h3>
          <div className="spacer"></div>
            <Button onClick={disconnectUser}>
                <CloseIcon />
            </Button>
     </div>
    );
}