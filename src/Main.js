import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Developer from './Developer'
import Manager from './Manager'
import NewProject from './NewProject'

/* The main component renders one of 4 routes: home, developer, manager,
   or new project.
*/

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/developer' component={Developer}/>
      <Route path='/manager' component={Manager}/>
      <Route path='/new-project' component={NewProject}/>
    </Switch>
  </main>
)

export default Main
