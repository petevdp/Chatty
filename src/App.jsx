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
      chatEvents: [],
      currentUser: defaultUser,
      savedUser: defaultUser,
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
        requestType: "registerClient",
        username: this.state.savedUser
      });
      this.sendRequest({
        requestType: "updateClient",
        username: this.state.savedUser
      });
    };

    socket.onmessage = event => {
      const { type, ...data } = JSON.parse(event.data);
      if (type === "registered") {
        const { userId } = data;
        console.log("registered with id ", userId);
        this.setState({ userId });
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
