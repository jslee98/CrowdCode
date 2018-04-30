import React, { Component } from 'react';
import { Redirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import CodeMirror from 'react-codemirror';
import RefreshIndicator from 'material-ui/RefreshIndicator';
const API = "https://calm-headland-11311.herokuapp.com/"

class Manager extends Component {

  constructor(props) {
    super(props);
    this.state = {
        pin: '',
        project: null,
        loading: true
    }
  }

  componentDidMount = () => {
    var that = this
    fetch(API + this.props.location.state.pin)
      .then(response => response.json())
      .then(function(data){
        console.log(data)
        that.setState({project: data})
        that.renderFunctions()
      })
  }

  renderFunctions = () => {
    var codeoptions = {
        mode: 'javascript',
        theme: 'default',
    		lineNumbers: true,
        readOnly: true
    }

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
    this.setState({functionCards: listItems, loading:false})

  }

  render(){

  if(this.props.location.state == null) {
    return <Redirect push to={"/"}/>
  }

  const style = {
    container: {
      position: 'relative',
    },
    refresh: {
      marginLeft: '50%'
    }
  }

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
