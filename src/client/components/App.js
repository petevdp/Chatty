import React, { Component } from "react";

import ChatEventList from "./messages";
import ChatBar from "./chatBar";
import NavBar from "./navBar";

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      chatEvents: [],
      currentUser: "",
      savedUser: "",
      userList: [],
      userId: null
    };
  }

  sendRequest(updates) {
    this.socket.send(JSON.stringify({ userId: this.state.userId, ...updates }));
  }

  componentDidMount() {
    const socket = new WebSocket('ws:localhost:40510');
    this.socket = socket;

    socket.onopen = event => {
    };

    socket.onmessage = event => {
      const { type, data } = JSON.parse(event.data);
      if (type === "registered") {
        const { userId, username } = data;
        this.setState({ userId, currentUser: username, savedUser: username });
        return;
      }

      if (type === "update") {
        const { userList, chatEvents } = data;
        this.setState({ userList, chatEvents });
        return;
      }

      throw "no message type!";
    };
  }
  onUpdateUser = event => {
    const currentUser = event.target.value;
    this.setState({ currentUser });
  };

  onMessageSubmit = content => {
    const { currentUser, savedUser } = this.state;
    if (savedUser !== currentUser) {
      this.sendRequest({
        requestType: "changeUsername",
        newUsername: currentUser
      });
      this.setState({ savedUser: currentUser });
    }
    const message = { username: currentUser, content };
    this.sendRequest({ requestType: "newMessage", message });
  };

  render() {
    const { chatEvents, currentUser, userList } = this.state;
    return (
      <div>
        <NavBar userList={userList} />
        <ChatEventList messages={chatEvents} userList={userList} />
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
