import React, { Component } from "react";

import MessageList from "./messages.jsx";
import ChatBar from "./chatBar.jsx";
import NavBar from "./navBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    const { defaultUser } = this.props;
    this.socket = null;
    this.state = { messages: [], currentUser: defaultUser };
  }

  sendRequest(updates) {
    console.log("updates: ", updates);
    this.socket.send(JSON.stringify(updates));
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    const socket = new WebSocket("ws:localhost:3001");
    this.socket = socket;

    console.log("socket: ", socket);

    socket.onopen = event => {
      this.sendRequest({
        requestType: "updateClient",
        user: this.state.savedUser
      });
      this.sendRequest({
        requestType: "registerClient",
        user: this.state.savedUser
      });
    };

    socket.onmessage = event => {
      const { chatEvents } = JSON.parse(event.data);
      console.log("recieved message: ", chatEvents);
      if (chatEvents) {
        this.setState({ messages: chatEvents });
        return;
      }
      console.log("no chatEvents!");
    };
  }
  onUpdateUser = event => {
    const newUser = event.target.value;
    this.setState({ newUser });
  };

  onNewMessage = message => {
    const { currentUser, newUser } = this.state;
    const userUpdate = { currentUser, newUser };
    this.setState({ currentUser: newUser, newUser: "" });
    this.sendRequest({ requestType: "newMessage", message });
  };

  render() {
    const { messages, newUser, currentUser } = this.state;
    console.log("newUser: ", newUser);
    return (
      <div>
        <NavBar />
        <MessageList messages={messages} />
        <ChatBar
          user={newUser || currentUser}
          onNewMessage={this.onNewMessage}
          onUpdateUser={this.onUpdateUser}
        />
      </div>
    );
  }
}

export default App;
