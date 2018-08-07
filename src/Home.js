import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Build from 'material-ui/svg-icons/action/build';
import CodeIC from 'material-ui/svg-icons/action/code';
import Assignment from 'material-ui/svg-icons/action/assignment';
import { Link } from 'react-router-dom'
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import { Redirect } from 'react-router';
import './css/App.css';
const API = "https://crowdcode.herokuapp.com/"

/* Home.js is the root component of our app. It displays a screen that
   allows users to make a new project or access old projects. It includes
   several snackbar and modal popups for different actions and warnings.
*/

class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize states
    this.state = {
      redirectDeveloper: false,
      pwOpen: false,
      pin: '',
      incorrectPassword: false,
      invalidPin: false
    }
  }

  // Handles the manage button response, ensures pin is correct length before login
  handleManage = () => {
    if(this.state.pin.length !== 6) {
      this.setState({invalidPin: true})
    } else {
      this.setState({pwOpen: true})
    }
  }

  // Handles login requests. Checks the password matches what is on file.
  // If no match, snackbar alert
  // If match, redirect to /manager with the pin privately transmitted in data,
  // not in the URL itself
  handleLogin = () => {
    var that = this
    var newPin = this.state.pin
    fetch(API + this.state.pin)
    .then(function(response){
      response.json()
      .then(function(project) {
        if(project.result) {
          that.setState({invalidPin: true,  pwOpen: false})
        } else if(project.pwd === that.refs.passInput.input.value) {
          that.props.history.push({
            pathname: "/manager",
            state: {pin: newPin}
          })
        } else {
          that.setState({incorrectPassword: true})
        }
      })
    })

  }

  // Closes login modal
  handleCancel = () => {
    this.setState({pwOpen: false})
  }

  // Handles incorrect password
  handleIncPass = () => {
    this.setState({incorrectPassword: false})
  }

  // Handles if pin is not valid/less than 6 chars
  handleInvalidPin = () => {
    this.setState({invalidPin: false})
  }

  // Updates pin state on textfield change
  handlePinInput = () => {
    this.setState({pin: this.refs.pinInput.input.value})
  }

  // Handles develop mode, checks if pin is valid then redirects
  handleDevelop = () => {
    var that = this
    if(this.state.pin.length !== 6) {
      this.setState({invalidPin: true})
    } else {
      fetch(API + this.state.pin)
      .then(response => response.json())
      .then(function(project) {
        if(project.result) {
          that.setState({invalidPin: true})
        } else {
          that.setState({redirectDeveloper: true})
        }
      })
    }
  }

  render() {

    // Redirects to developer if redirect is true
    if(this.state.redirectDeveloper) {
      return <Redirect push to={"/developer/" + this.state.pin}/>
    }

    // Data for login modal
    const loginActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleCancel}
      />,
      <FlatButton
        label="Login"
        primary={true}
        onClick={this.handleLogin}
      />
    ]

    // Style for paper background
    const style = {
      height: 420,
      width:700,
      margin: 15,
      textAlign: 'center',
      display: 'inline-block',
    }

    return (
      <MuiThemeProvider>
      <div className="App">
      <div className = "container">
      <br/>
        <Paper className = "pt-5" style={style} zDepth={3}>
          <p className="App-intro">
            <code id="home"> CrowdCode </code> allows people from all over the world
            to <code id="home">code together.</code>
          </p>
          <br/>
          <div className="pb-3">
          <Link to="/new-project">
            <RaisedButton
            label="Create a New Project"
            icon={<Assignment/>}
            />
          </Link>
          </div>
          <br/>
          <p>
            Or, enter the PIN of an existing project:
          </p>
            <code id="home"> PIN: </code>
            <TextField ref='pinInput' onChange={this.handlePinInput} hintText="Enter here"/>
          <p>
            I am a...
          </p>
          <div className="row">
          <div className="col-3">
          </div>
            <div className="col-3 pr-0 mr-0">
              <RaisedButton
                onClick={this.handleDevelop}
                icon={<CodeIC/>}
                label="Developer"
              />
            </div>
            <div className="col-3 pl-0 ml-0">
              <RaisedButton
                onClick={this.handleManage}
                label="Manager"
                icon={<Build/>}
              />
            </div>
            <div className="col-3">
            </div>
          </div>
          </Paper>
          <Dialog
          title={"Enter password for Project #" + this.state.pin}
          actions={loginActions}
          modal={false}
          open={this.state.pwOpen}
          >
          <TextField hintText="Password" ref="passInput" type="password"/>
        </Dialog>
        <Snackbar
          open={this.state.incorrectPassword}
          message="Incorrect Password"
          autoHideDuration={3000}
          onRequestClose={this.handleIncPass}
        />
        <Snackbar
          open={this.state.invalidPin}
          message="Invalid Pin"
          autoHideDuration={3000}
          onRequestClose={this.handleInvalidPin}
        />
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default Home;
