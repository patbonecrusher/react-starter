import React                from 'react';
import ReactDOM             from 'react-dom';
import App                  from './components/App';

// Setup route and other stuff here.
class WebApp {

  // --------------------------------------------------------------------------
  start (element) {
    this.render(element);
  }

  // --------------------------------------------------------------------------
  render (element) {
    return ReactDOM.render(App, element);
  }

  // --------------------------------------------------------------------------
}

export default WebApp;

