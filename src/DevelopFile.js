import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CodeMirror from 'react-codemirror';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');


// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.
class DFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        code: "// Enter code here"
    }

  }

  updateCode = (newCode) => {
    this.setState({code: newCode})
  }

  postFunction = (index) => {
    this.setState({empty_form_warning: false})
  }

  render(){
    var codeoptions = {
        mode: 'javascript',
        theme: 'eclipse',
    		lineNumbers: true,
        readOnly: false
    }

  return (
    <MuiThemeProvider>
      <div className="container pb-5">
        <h1 className= "pt-4">My Project Name</h1>
        <h2> Developer Portal #{this.props.match.params.pin} </h2>
      <br/>
      <section>
        <h2> About This Project </h2>
      </section>
      <br/>
      <section>
        <h2> Completed Functions </h2>
      </section>
      <br/>
      <section>
        <h2> Function Requests </h2>
        <div className = "row py-3">
        <div className = "col-2"></div>
        <div className = "col-8">
        <Card>
          <CardHeader
            title= {<code> this is my function definition </code>}
            subtitle= "Function 1"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <CodeMirror value={this.state.code} onChange={this.updateCode} options={codeoptions} />
            <CardActions style={{textAlign: 'right' }}>
              <FlatButton onClick={() => this.postFunction(0)} label="Submit"/>
            </CardActions>
          </CardText>
        </Card>
        </div>
        <div className = "col-2"></div>
        </div>

      </section>
      </div>
    </MuiThemeProvider>
  )
  }
}
export default DFile
