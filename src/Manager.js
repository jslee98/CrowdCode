import React, { Component } from 'react';
import { Redirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import CodeMirror from 'react-codemirror';
import RefreshIndicator from 'material-ui/RefreshIndicator';
const API = "https://crowdcode.herokuapp.com/"

/* Manager.js is the component that allows project managers to view the project
   and fetch the responses submitted by developers. All info is loaded from
   database.
*/

class Manager extends Component {
  constructor(props) {
    super(props);
    // Initializes states, sets loading to true
    this.state = {
        pin: '',
        project: null,
        loading: true
    }
  }

  // Fetches project and renders functions on mount
  componentDidMount = () => {
    var that = this
    fetch(API + this.props.location.state.pin)
      .then(response => response.json())
      .then(function(data){
        that.setState({project: data})
        that.renderFunctions()
      })
  }

  // Creates JSX list of card components for each function
  renderFunctions = () => {
    // Codeoptions for CodeMirror window. Read-only in manager mode
    var codeoptions = {
        mode: 'javascript',
        theme: 'default',
    		lineNumbers: true,
        readOnly: true
    }

    // Creates an array of mapped submission CodeMirror windows for each function
    // Now, each function displays submissionArray[index] to view a list of
    // CodeMirror windows of submissions. If no submissions, text displays
    // "No Submissions Yet"
    var submissionArray = []
    var functions = this.state.project.functions
    for(var i = 0; i < functions.length; i++) {
      let submissions = functions[i].proposed_solutions
      let subList = submissions.map((entry, i) =>
        <div key = {i}>
          <p className ="boldcentered"> Author: {entry.author}, Email: {entry.email} </p>
          <CodeMirror value={entry.solution} options={codeoptions} />
          </div>
      )
      if(subList.length === 0) {
        submissionArray.push("No Submissions Yet")
      } else {
        submissionArray.push(subList)
      }
    }

    // Creates a card for each function, populated by the submissions
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
          <p className = "subtitle"> Submitted Solutions </p>
          {submissionArray[i]}
        </CardText>
      </Card>
      </div>
      <div className = "col-2"></div>
      </div>
    )
    // Once this is complete, loading is over
    this.setState({functionCards: listItems, loading:false})
  }

  render(){

  // If manager is accessed without parameters passed (directly), redirect home
  if(this.props.location.state == null) {
    return <Redirect push to={"/"}/>
  }

  // Style for loading animation
  const style = {
    container: {
      position: 'relative',
    },
    refresh: {
      marginLeft: '50%'
    }
  }

  // If loading, display animation
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
        <h1 className= "pt-4">{this.state.project.project_title}</h1>
        <p className="subtitle"> Manager Portal #{this.props.location.state.pin} </p>
      <br/>
      <section>
        <h3> About This Project </h3>
        <div className = "row">
        <div className="col-2"></div>
        <div className="col-8">
          <p className = "centered">{this.state.project.project_desc}</p>
        </div>
        <div className="col-2"></div>
        </div>
      </section>
      <br/>
      <section>
        <h3> Review Function Submissions </h3>
        {this.state.functionCards}
      </section>
     </div>
    </MuiThemeProvider>
  )
  }
}
export default Manager
