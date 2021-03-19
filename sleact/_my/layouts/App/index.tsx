import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from '@pages/Login'
import Signup from '@pages/Signup'


const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </Switch>
  )
}

export default App