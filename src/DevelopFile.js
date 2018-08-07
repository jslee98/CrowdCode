import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CodeMirror from 'react-codemirror';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { Redirect } from 'react-router';
import Snackbar from 'material-ui/Snackbar'

require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');
const API = "https://crowdcode.herokuapp.com/"

/* DevelopFile is the component that allows the public to submit
   code entries to the server. It fetches the project from the database,
   and allows people to upload responses.
*/

class DFile extends Component {
  constructor(props) {
    super(props);
    // Initializes states, sets loading to true
    this.state = {
      code: [],
      loading: true,
      project: null,
      invalid: false,
      functionCards: null,
      successfulSubmission: false
    }
  }

  // Checks if the pin in the url is valid on mount
  componentDidMount = () => {
    var that = this
    fetch(API + this.props.match.params.pin)
    .then(response => response.json())
    .then(function(data){
      if(data.result) {
        that.setState({invalid: true})
      } else {
        console.log(data)
        that.setState({project: data})
        that.renderFunctions()
      }
    })
  }

  // Creates JSX list of card components for each function
  renderFunctions = () => {

    // Sets hint code for each function
    var starterCode = []
    for (var i = 0; i < this.state.project.functions.length; i++) {
      starterCode.push("// Enter code here")
    }

    // codeoptions for CodeMirror window
    var codeoptions = {
      mode: 'javascript',
      theme: 'default',
      lineNumbers: true,
      readOnly: false
    }
    // Creates card for each function
    var functions = this.state.project.functions
    const listItems = functions.map((entry, i) =>
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
          <p className = "subtitle"> Project Description </p>
          <pre>{entry.function_desc}</pre>
          <br/>
          <CodeMirror onChange={value => this.updateCode(value, i)} value={starterCode[i]} options={codeoptions} />
          <CardActions style={{textAlign: 'right' }}>
            <FlatButton onClick={() => this.submitFunction(i)} label="submit"/>
          </CardActions>
        </CardText>
      </Card>
      </div>
      <div className = "col-2"></div>
      </div>
    )

    // Once complete, project is done loading
    this.setState({functionCards: listItems, loading:false, code: starterCode})

  }

  // Updates code state onChange in each CodeMirror window
  updateCode = (newCode, index) => {
    var codeArray = this.state.code
    codeArray[index] = newCode
    this.setState({code: codeArray})
  }

  // Handles function solution submission, sends to database as an "update"
  // call for MongoDB
  submitFunction = (index) => {
    var that = this
    var updatedFunctions = this.state.project.functions
    updatedFunctions[index].proposed_solutions.push({
      solution: this.state.code[index],
      author: this.refs.devName.input.value,
      email: this.refs.devEmail.input.value
    })
    fetch(API + this.state.project.pin, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {updatedFunctions})
      }).then(function(response){
        console.log(response)
        that.setState({successfulSubmission: true})
      })
    }

  // Snackbar handler
  handleCloseSubmission = () => {
    this.setState({successfulSubmission: false})
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

  // Displays loading circle while getting ready
  if (this.state.loading && !this.state.invalid) {
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

  // If pin is invalid, redirect home
  if(this.state.invalid) {
    return <Redirect push to={"/"}/>
  }

  // Returns main page
  return (
    <MuiThemeProvider>
      <div className="container pb-5">
        <h1 className= "pt-4">{this.state.project.project_title}</h1>
        <p className = "subtitle"> Developer Portal #{this.props.match.params.pin} </p>
      <div className = "row">
      <div className="col-2">
      </div>
      <div className="col-4">
      <TextField
        ref="devName"
        hintText="Name"
        floatingLabelText="Developer Name"
        fullWidth={true}
      />
      </div>
      <div className = "col-4">
      <TextField
        ref="devEmail"
        hintText="Email"
        floatingLabelText="Contact Email"
        fullWidth={true}
      />
      <div className="col-2"></div>
      </div>
      </div>
      <br/>
      <section>
        <h3> About This Project </h3>
        <div className = "row">
        <div className="col-2"></div>
        <div className="col-8">
        <p className = "centered"> {this.state.project.project_desc}</p>
        </div>
        <div className="col-2"></div>
        </div>
      </section>
      <br/>
      <section>
        <h3> Function Requests </h3>
        {this.state.functionCards}
      </section>
      <Snackbar
        open={this.state.successfulSubmission}
        message="Your solution has been submitted!"
        autoHideDuration={3000}
        onRequestClose={this.handleCloseSubmission}
      />
      </div>
    </MuiThemeProvider>
  )
  }
}
export default DFile
