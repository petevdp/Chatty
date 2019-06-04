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

  componentDidMount() {
    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {
        id: 3,
        username: "Michelle",
        content: "Hello there!"
      };
      const messages = this.state.messages.concat(newMessage);
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({ messages: messages });
    }, 3000);
  }

  onUpdateuser = evt => {
    this.setState({ currentUser: evt.target.value });
  };

  onNewMessage = newMessage => {
    this.setState(() => ({
      messages: [...this.state.messages, newMessage]
    }));
  };

  render() {
    const { messages, currentUser } = this.state;
    return (
      <div>
        <NavBar />
        <MessageList messages={messages} />
        <ChatBar
          currentUser={currentUser}
          onNewMessage={this.onNewMessage}
          onUpdateUser={this.onUpdateuser}
        />
      </div>
    );
  }
}

export default App;
