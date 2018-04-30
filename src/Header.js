import React from 'react'
import logo from './logo.png'
import { Link } from 'react-router-dom'

// Simple static header that is displayed on every page

const Header = () => (
  <div className="App">
  <header className="App-header">
    <Link to="/">
    <img src={logo} className="App-logo" alt="logo" />
    </Link>
  </header>
  </div>
)

export default Header
