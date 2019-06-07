import React, { Component } from "react";

import ChatEventList from "./messages.jsx";
import ChatBar from "./chatBar.jsx";
import NavBar from "./navBar.jsx";

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
    console.log("updates: ", updates);
    this.socket.send(JSON.stringify({ userId: this.state.userId, ...updates }));
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    const socket = new WebSocket("ws:localhost:3001");
    this.socket = socket;

    console.log("socket: ", socket);

    socket.onopen = event => {
      this.sendRequest({
        requestType: "registerClient"
      });
      this.sendRequest({
        requestType: "updateClient"
      });
    };

    socket.onmessage = event => {
      const { type, ...data } = JSON.parse(event.data);
      if (type === "registered") {
        const { userId, username } = data;
        console.log("registered with id ", userId);
        this.setState({ userId, currentUser: username, savedUser: username });
        return;
      }

      if (type === "update") {
        const { userList, chatEvents } = data;
        console.log("update: ", chatEvents);
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
      const userUpdate = { oldUser: savedUser, newUser: currentUser };
      this.sendRequest({ requestType: "userUpdate", userUpdate });
      this.setState({ savedUser: currentUser });
    }
    const message = { username: currentUser, content };
    this.sendRequest({ requestType: "newMessage", message });
  };

  render() {
    const { chatEvents, currentUser, userList, userId } = this.state;
    console.log("currentUser: ", currentUser);
    console.log("messages: ", chatEvents);
    console.log("userlist length", userList.length);
    return (
      <div>
        <NavBar userList={userList} />
        <ChatEventList
          messages={chatEvents}
          userList={userList}
          userId={userId}
        />
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
