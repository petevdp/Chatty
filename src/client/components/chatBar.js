import React, { Component } from "react";

const CHAT_INPUT_ID = 'chat__input'
export default class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = { newMessage: "" };
    this._chatInput = React.createRef()
  }

  componentDidMount = () => {
    console.log(this._chatInput);
    this._chatInput.current.focus();
  }

  updateMessage = evt => {
    this.setState({ newMessage: evt.target.value });
  };

  onKeyPress = evt => {
    if (evt.key === "Enter") {
      const { onMessageSubmit } = this.props;
      const { newMessage } = this.state;
      onMessageSubmit(newMessage);
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
          id={CHAT_INPUT_ID}
          ref={this._chatInput}
          autoFocus={true}
          placeholder="Type a message and hit ENTER"
          value={newMessage}
          onKeyPress={this.onKeyPress}
          onChange={this.updateMessage}
        />
      </footer>
    );
  }
}
