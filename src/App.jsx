import React, { Component } from "react";

import ChatEventList from "./messages.jsx";
import ChatBar from "./chatBar.jsx";
import NavBar from "./navBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    const { defaultUser } = this.props;
    this.socket = null;
    this.state = {
      messages: [],
      currentUser: defaultUser,
      savedUser: defaultUser
    };
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
        username: this.state.savedUser
      });
      this.sendRequest({
        requestType: "registerClient",
        username: this.state.savedUser
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
    const currentUser = event.target.value;
    this.setState({ currentUser });
  };

  onMessageSubmit = content => {
    const { currentUser, savedUser } = this.state;
    if (savedUser !== currentUser) {
      const userUpdate = { oldUser: savedUser, newUser: currentUser };
      this.sendRequest({ requestType: "userUpdate", userUpdate });
      this.setState({ savedUser: currentUser });
    }
    const message = { username: currentUser, content };
    this.sendRequest({ requestType: "newMessage", message });
  };

  render() {
    const { messages, currentUser } = this.state;
    console.log("currentUser: ", currentUser);
    console.log("messages: ", messages);
    return (
      <div>
        <NavBar />
        <ChatEventList messages={messages} />
        <ChatBar
          user={currentUser}
          onMessageSubmit={this.onMessageSubmit}
          onUpdateUser={this.onUpdateUser}
        />
      </div>
    );
  }
}

export default App;
