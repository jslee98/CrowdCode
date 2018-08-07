import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Done from 'material-ui/svg-icons/action/done'
import RaisedButton from 'material-ui/RaisedButton'
import NewProjCss from './css/NewProject.css'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card'
import RefreshIndicator from 'material-ui/RefreshIndicator';
const API = "https://crowdcode.herokuapp.com"

/* NewProject.js is the component that allows users to create a new project. It
   requires that all field be filled before submission. Additionally, a function
   must be added. The view updates each time adding a card with each function
   added.
*/

// Static method to create a new 6 digit hex pin
function createNewPin(){
  var length = 6
  var chars = '0123456789ABCDEF'
  var new_pin = ''
  while(length--) new_pin += chars[(Math.random() * 16) | 0]
  return new_pin
}


class NewProject extends Component {
  constructor(props) {
    super(props)
    // Initializes states, sets loading to true
    this.state = {
      pin: null,
      name: '',
      password: '',
      functions: [],
      saved_fxns: '',
      empty_function_warning: false,
      empty_form_warning: false,
      no_fxn_warning: false,
      loading: true
    }
    this.functionList = []
    this.handleAddFunction = this.handleAddFunction.bind(this)
  }

  // On mount, generates new pin
  componentDidMount = () => {
    this.generatePin()
  }

  // Generate pin creates a new pin. It then check if it exists already in the
  // database, and calls itself again if it does. Loading is over once complete.
  generatePin = () => {
    var that = this
    var npin = createNewPin()
    fetch(API + "/" + npin)
    .then(response => response.json())
    .then(function(json) {
      if(json.result) {
        that.setState({pin: npin, loading: false})
      } else {
        that.generatePin()
      }
    })
  }

  // Removes function from list and updates the view
  removeFunction = (index) => {
    this.functionList.splice(index, 1)
    this.updateList()
  }

  // Checks to ensure all fields are filled, then sends data to server and
  // redirects to manager page
  handleUpload = () => {
    var that = this
    if (this.functionList.length === 0) {
      this.setState({no_fxn_warning: true})
    } else if( this.refs.projTitle.input.value.length > 0 &&
      this.refs.projPass.input.value.length > 0 &&
      this.refs.projDesc.getValue().length > 0
    ) {
      fetch(API + "/projects", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            "pin" : this.state.pin,
            "pwd" : this.refs.projPass.input.value,
            "project_title" : this.refs.projTitle.input.value,
            "project_desc" : this.refs.projDesc.getValue(),
            "functions" : this.state.functions
          }
        )
      })
      .then(function(res) {
        that.props.history.push({
          pathname: "/manager",
          state: {pin: that.state.pin}
        })
      })
    } else {
      this.setState({empty_form_warning: true})
    }
  }

  // Opens snackbar if form isn't filled
  handleCloseEmptyFormWarning = () => {
    this.setState({empty_form_warning: false})
  }

  // Opens snackbar if no functions have been added
  handleCloseNoFxnWarning = () => {
    this.setState({no_fxn_warning: false})
  }

  // Handles adding a function. Adds the data to a list, then maps it to a JSX
  // object that lists a card component for each function
  handleAddFunction() {
    if(this.refs.functionDef.input.value.length > 0 &&
      this.refs.functionDesc.getValue().length > 0)
      {
        this.functionList.push({
          function_def: this.refs.functionDef.input.value,
          function_desc: this.refs.functionDesc.getValue(),
          proposed_solutions: []
        })
        this.refs.functionDef.getInputNode().value=""
        this.refs.functionDesc.getInputNode().value=""
        this.updateList()
      } else {
        this.setState({empty_function_warning: true})
      }
    }

  // Closes empty function warning snackbar
  handleCloseEmptyFunctionWarning = () => {
    this.setState({empty_function_warning: false})
  }

  // Maps the functionList to a JSX list of cards so it can be rendered
  updateList = () => {
    const listItems = this.functionList.map((entry, i) =>
      <div className = "row py-3" key={i}>
      <div className = "col-2"></div>
      <div className = "col-8">
      <Card>
        <CardHeader
          title= {<code> {entry.function_def} </code>}
          subtitle={"Function " + (i + 1)}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {entry.function_desc}
          <CardActions style={{textAlign: 'right' }}>
            <FlatButton onClick={() => this.removeFunction({i})} label="delete"/>
          </CardActions>
        </CardText>
      </Card>
      </div>
      <div className = "col-2"></div>
      </div>
    )
    this.setState({saved_fxns: listItems, functions: this.functionList})
  }


  render(){

    // Style for loading animation
    const style = {
      container: {
        position: 'relative',
      },
      refresh: {
        marginLeft: '50%'
      }
    }

    // Renders loading animation if not done loading
    if (this.state.loading) {
      return (
        <MuiThemeProvider>
          <div style={style.container}>
              <RefreshIndicator
                  size={50}
                  left={-25}
                  top={100}
                  status="loading"
                  style={style.refresh}
                />
          </div>
        </MuiThemeProvider>
      )
    }


  return (
    <MuiThemeProvider>
      <div className="container pb-5">
      <link rel="stylesheet" type="text/css" href={NewProjCss}/>
        <h1 className= "pt-4">Create a New Project</h1>
        <h3><code> PIN: {this.state.pin} </code></h3>
        <div className = "row">
        <div className="col-2">
        </div>
        <div className="col-4">
        <TextField
          ref="projTitle"
          hintText="Title"
          floatingLabelText="Project Title"
          fullWidth={true}
        />
        </div>
        <div className = "col-4">
        <TextField
          ref="projPass"
          floatingLabelText="Password"
          type="password"
          fullWidth={true}
        />
        <div className="col-2"></div>
        </div>
        </div>

        <div className ="row">
        <div className="col-2"></div>
        <div className = "col-8">
          <TextField
          ref="projDesc"
          floatingLabelText="Project Description"
          hintText="Describe the project to potential developers. Be sure to note any global variables or special data types."
          multiLine={true}
          rows={2}
          rowsMax={8}
          fullWidth={true}
          />
        </div>
        <div className="col-2"></div>
        </div>

        <br/>
        <h3> Function Requests: </h3>
        {this.state.saved_fxns}
        <div className ="row">
        <div className="col-md-2"></div>
        <div className = "col-8">
          <TextField
          ref='functionDef'
          floatingLabelText="Function Definition"
          hintText = "public static void myExampleFunction(int arg1, string arg2)"
          fullWidth={true}
          />
        </div>
        <div className="col-2"></div>

        </div>

        <div className ="row">
        <div className="col-2"></div>
        <div className = "col-8">
          <TextField
          ref="functionDesc"
          floatingLabelText="Function Description"
          hintText = "Tell potential developers what this function does! What value is returned, how should they consider getting there?"
          rows={2}
          multiLine={true}
          rowsMax={8}
          fullWidth={true}
          />
        </div>
        <div className="col-2"></div>
        </div>
        <br/>
        <div className ="row">
        <div className="col-2"></div>
        <div className = "col-md-12 col-lg-4 px-5">
        <RaisedButton
            onClick={this.handleAddFunction}
            target="_blank"
            label="Add Function"
            labelPosition="before"
            backgroundColor="#EF6C00"
            labelColor="#FFF"
            icon={<ContentAdd />}
            fullWidth={true}
        />
        </div>
        <div className = "col-md-12 col-lg-4 py-sm-2 py-lg-0 px-5">
        <RaisedButton
            onClick={this.handleUpload}
            target="_blank"
            label="Upload & Manage"
            labelPosition="before"
            backgroundColor="#1A237E"
            labelColor="#FFF"
            icon={<Done />}
            fullWidth={true}
        />
        </div>
        <div className="col-2"></div>
        </div>
        <Snackbar
          open={this.state.empty_function_warning}
          message="Please fill both function fields"
          autoHideDuration={3000}
          onRequestClose={this.handleCloseEmptyFunctionWarning}
        />
        <Snackbar
          open={this.state.empty_form_warning}
          message="Please fill out all fields"
          autoHideDuration={3000}
          onRequestClose={this.handleCloseEmptyFormWarning}
        />
        <Snackbar
          open={this.state.no_fxn_warning}
          message="Please add a function before submitting"
          autoHideDuration={3000}
          onRequestClose={this.handleCloseNoFxnWarning}
        />
      </div>
    </MuiThemeProvider>
  )
  }
}

export default NewProject
