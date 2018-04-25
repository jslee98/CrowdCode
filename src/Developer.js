import React from 'react'
import { Switch, Route } from 'react-router-dom'
import DFile from './DevelopFile'

// The Roster component matches one of two different routes
// depending on the full pathname
const Developer = () => (

  <Switch>
    <Route path='/developer/:pin' component={DFile}/>
  </Switch>
)


export default Developer
