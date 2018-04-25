import React, { Component } from 'react';
import { Redirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Manager extends Component {

  constructor(props) {
    super(props);
    this.state = {
        pin: ''
    }

  }
  render(){

  if(this.props.location.state == null) {
    return <Redirect push to={"/"}/>
  }

  return (
    <MuiThemeProvider>
      <div className="container pb-5">
        <h1 className= "pt-4">My Project Name</h1>
        <h2> Manager Portal #{this.props.location.state.pin} </h2>
      <br/>
      <section>
        <h2> About This Project </h2>
      </section>

      <section>
        <h2> Review Function Submissions </h2>
      </section>
     </div>
    </MuiThemeProvider>
  )
  }
}
export default Manager
