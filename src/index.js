import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.render(
  (<BrowserRouter>
    <App />
  </BrowserRouter>), document.getElementById('root'));
registerServiceWorker();
injectTapEventPlugin();
