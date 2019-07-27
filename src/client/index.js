// Application entrypoint.

// Load up the application styles
import './styles/application.scss';

// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App.js";
console.log('hi')

ReactDOM.render(<App />, document.getElementById("react-root"));
