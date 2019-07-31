// Application entrypoint.

// Load up the application styles
import './styles/application.scss';

// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App.js";

if (typeof(module.hot) !== 'undefined') {
  module.hot.accept();
}

ReactDOM.render(<App />, document.getElementById("react-root"));
