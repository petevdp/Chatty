import React, { Component } from "react";
export default class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = { newMessage: "" };
  }

  updateMessage = evt => {
    this.setState({ newMessage: evt.target.value });
  };

  onKeyPress = evt => {
    if (evt.key === "Enter") {
      const { user, onNewMessage } = this.props;
      const { newMessage } = this.state;
      onNewMessage({
        username: user,
        content: newMessage
      });
      this.setState({ newMessage: "" });
    }
  };

  render() {
    const { user, onUpdateUser } = this.props;
    const { newMessage } = this.state;
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          placeholder="Your Name (Optional)"
          onChange={onUpdateUser}
          value={user}
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
