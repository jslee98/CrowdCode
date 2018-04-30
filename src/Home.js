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
const API = "https://calm-headland-11311.herokuapp.com/"

class Home extends Component {
  constructor(props) {
    super(props);
  this.state = {
    redirectDeveloper: false,
    emptyPinWarning: false,
    pwOpen: false,
    pin: '',
    incorrectPassword: false,
    invalidPin: false
  }
}

 handleManage = () => {
   if(this.state.pin.length !== 6) {
     this.setState({emptyPinWarning: true})
   } else {
     this.setState({pwOpen: true})
  }
 }

 handleCloseEmptyPinWarning = () => {
   this.setState({emptyPinWarning: false})
 }

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

 handleCancel = () => {
   this.setState({pwOpen: false})
 }

 handleIncPass = () => {
   this.setState({incorrectPassword: false})
 }

 handleInvalidPin = () => {
   this.setState({invalidPin: false})
 }

 handlePinInput = () => {
    this.setState({pin: this.refs.pinInput.input.value})
  }

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
    if(this.state.redirectDeveloper) {
      return <Redirect push to={"/developer/" + this.state.pin}/>
    }

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
          open={this.state.emptyPinWarning}
          message="Please enter a valid pin"
          autoHideDuration={3000}
          onRequestClose={this.handleCloseEmptyPinWarning}
        />
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
