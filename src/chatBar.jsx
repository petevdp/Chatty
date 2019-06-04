import React, { Component } from "react";
import { generateRandomId } from "./utils/data-helpers";
export default class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = { newMessage: "" };
  }

  updateMessage = evt => {
    this.setState({ newMessage: evt.target.value });
  };

  onKeyPress = evt => {
    const isEnter = key => key === "Enter";
    if (isEnter(evt.key)) {
      const { currentUser, onNewMessage } = this.props;
      const { newMessage } = this.state;
      onNewMessage({
        username: currentUser,
        type: "postedMessage",
        content: newMessage,
        id: generateRandomId()
      });
      this.setState({ newMessage: "" });
    }
  };

  render() {
    const { currentUser } = this.props;
    const { newMessage } = this.state;
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          placeholder="Your Name (Optional)"
          defaultValue={currentUser}
        />
        <input
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
          value={newMessage}
          onKeyPress={this.onKeyPress}
          onChange={this.updateMessage}
        />
      </footer>
    );
  }
}
