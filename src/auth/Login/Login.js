import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { withRouter, useHistory, Link } from 'react-router-dom';
import './Login.css'
import axios from 'axios';
import { useForm } from "react-hook-form";
import Alert from '@material-ui/lab/Alert';
import { Typography } from '@material-ui/core';


const LoginForm = () => {

    const {
      register,
      handleSubmit
    } = useForm();
	
    const [error, setError] = useState("");
    const history = useHistory();

    const onSubmit = async (data) => {
      let user = data;
      try {
        const responseData = await axios.post('http://localhost:8080/user/login', user);
        if (responseData) {
          let userName = responseData.data.username;
          let userId = responseData.data.userId;
          let room = responseData.data.room;
          let avatar = responseData.data.avatar
          history.push({
            pathname: `/chat/${userId}/${room}`,
            state: {
              userName: userName,
              room: room,
              avatar: avatar
            }
          });
        }
      } catch (err) {
        setError(err.response.data.message);
      }

    };

    return (
	<React.Fragment>
        { error &&  <Alert severity="error"> { error } </Alert> }
        <Container> 
          <form  className="LoginForm" onSubmit={handleSubmit(onSubmit)} >
            <h1>Join</h1>
            <TextField 
             id="input"
             label="username"
             type="text"
             name="username"
             defaultValue=""
             inputRef={register({ required: true, minLength: 6 })}
             />
            <TextField
             id="input"
             label="Password"
             type="password"
             name="password"
             defaultValue=""
             inputRef={register({ required: true, minLength: 6 })}
             />
             <TextField 
             id="input"
             label="room"
             type="text"
             name="room"
             defaultValue=""
             inputRef={register( {minLength: 3 })}
             />
            <Button
             className="loginButton"
             color="primary"
             variant="contained"
             type="submit">
                 JOIN
            </Button>
            <Typography variant="subtitle1" style={{marginTop:"12px" }}>
              New user? <Link to="/signup">Sign up</Link>
            </Typography>
          </form>
          
        </Container>
        </React.Fragment>
     );
}

export default withRouter(LoginForm);
