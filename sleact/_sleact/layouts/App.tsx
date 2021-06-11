import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '@pages/Login';
import SignUp from '@pages/SignUp';

const App = () => {
  return (
    <div>
      <Switch>
        <Redirect exact path="/" to="/login"></Redirect>
        <Route path="/login" component={Login}></Route>
        <Route path="/signup" component={SignUp}></Route>
      </Switch>
    </div>
  );
};

export default App;
