import React from 'react'
import { Switch, Route } from 'react-router-dom'
import DFile from './DevelopFile'

// Base component to route to a certain pin

const Developer = () => (

  <Switch>
    <Route path='/developer/:pin' component={DFile}/>
  </Switch>
)


export default Developer
