import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { withRouter, useHistory } from 'react-router-dom';
import './Signup.css'
import { useForm } from "react-hook-form";
import Alert from '@material-ui/lab/Alert';


const SignupForm = () => {

  const {
    register,
    handleSubmit
  } = useForm();

  const [error, setError] = useState("");
  const history = useHistory();
 
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar[0]);
    formData.append('username', data.username);
    formData.append('password', data.password);

    try {
      const res = await fetch("http://localhost:8080/user/signup", {
        method: "POST",
        body: formData
      });
      await res.json();
      console.log(JSON.stringify(res));
      history.push("/");

    } catch (err) {
      setError(err.response.data.message);
    }
  };

 return(
      <React.Fragment>
        { error &&  <Alert severity="error"> { error } </Alert> }
        <Container> 
          <form  className="signupForm" onSubmit={handleSubmit(onSubmit)} >
            <h1>Signup</h1>
            <TextField 
             id="input"
             label="Username"
             type="text"
             name="username"
             defaultValue=""
             inputRef={register({ required: true, minLength: 2 })}
             />
            <TextField
             id="input"
             label="Password"
             type="password"
             name="password"
             defaultValue=""
             inputRef={register({ required: true, minLength: 2 })}
             />
             <div className="avatarInput">
             <p>Avatar</p>
             <input
              label="Avatar"
              ref={register}
              type="file"
              name="avatar"/>
              </div>
            <Button
             className="signupButton"
             color="primary"
             variant="contained"
             type="submit" >
                 SIGN UP
            </Button> 
          </form>
        </Container>
        </React.Fragment>
    );
}

export default withRouter(SignupForm);
