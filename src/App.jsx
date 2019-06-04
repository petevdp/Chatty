import React, { Component } from "react";

import MessageList from "./messages.jsx";
import ChatBar from "./chatBar.jsx";
import NavBar from "./navBar.jsx";

import { addRandomIdToMsgs } from "./utils/data-helpers";
import sampleMessages from "./sampleMessages";

const messages = addRandomIdToMsgs(sampleMessages);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages, currentUser: "bob" };
  }
  render() {
    const { messages, currentUser } = this.state;
    return (
      <div>
        <NavBar />
        <MessageList messages={messages} />
        <ChatBar currentUser={currentUser} />
      </div>
    );
  }
}

export default App;
