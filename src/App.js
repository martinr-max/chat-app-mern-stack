import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { StylesProvider } from '@material-ui/core';
import Login from './auth/Login/Login';
import Signup from './auth/Signup/Signup';
import Chat from './chat/pages/chat/Chat';
import ChatAppBar from './shared/AppBar/AppBar';


function App() {
  return(
    <StylesProvider injectFirst>
      <ChatAppBar />
    <Router>
      <Switch>
        <Route path="/chat/:userId/:room" component={Chat} />
        <Route path="/" exact component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Router>
    </StylesProvider>
  );
}

export default App;
