import React from 'react'
import { Link } from 'react-router-dom';

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.
const MFile = (props) => {
  let params = props.match.params.pin
  return (
    <div>
      <h1>Manager</h1>
      <h2>Position: {params}</h2>
    </div>
  )
}

export default MFile
