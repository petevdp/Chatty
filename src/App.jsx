import React, { Component } from "react";

import MessageList from "./messages.jsx";
import ChatBar from "./chatBar.jsx";
import NavBar from "./navBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = new WebSocket("ws:localhost:3001");
    this.state = { messages: [], currentUser: "bob" };
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    const socket = new WebSocket("ws:localhost:3001");
    this.socket = socket;

    console.log("socket: ", socket);
    socket.onopen = event => {
      // socket.send("hello socket");
    };
    socket.onmessage = event => {
      const { messages } = JSON.parse(event.data);
      console.log("recieved message");
      console.log(event.data);
      if (messages) {
        console.log("we gucci");
        this.setState({ messages });
        return;
      }
      console.log("hmm");
    };
  }

  onUpdateUser = event => {
    this.setState({ currentUser: event.target.value });
  };

  onNewMessage = newMessage => {
    const { messages } = this.state;
    console.log("sending: ", messages);
    this.socket.send(JSON.stringify({ messages, newMessage }));
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
          onUpdateUser={this.onUpdateUser}
        />
      </div>
    );
  }
}

export default App;
