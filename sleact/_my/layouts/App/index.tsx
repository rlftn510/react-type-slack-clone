import Loadable from '@loadable/component'
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
const Login = Loadable(() => import('@pages/Login'))
const Signup = Loadable(() => import('@pages/Signup'))
const Workspace = Loadable(() => import('@layouts/Workspace'))

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/workspace/:workspacde" component={Workspace}/>
    </Switch>
  )
}

export default App