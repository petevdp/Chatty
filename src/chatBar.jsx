import React, { Component } from "react";

export default class ChatBar extends Component {
  render() {
    const { currentUser } = this.props;
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
        />
      </footer>
    );
  }
}
