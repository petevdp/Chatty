import React, { Component } from "react";

const Message = props => {
  const { content, username } = props;
  return (
    <div className="message">
      <span className="message-username">{username}</span>
      <span className="message-content">{content}</span>
    </div>
  );
};

const Notification = ({ content }) => (
  <div className="message system">{content}</div>
);

export default class ChatEventList extends Component {
  render() {
    const { messages } = this.props;

    const chatEventElements = messages.map(event => {
      const { type } = event;
      console.log("type: ", type);
      console.log("event: ", event);
      const key = event.id;
      if (type === "message") {
        return <Message key={key} {...event} />;
      }
      if (type === "notification") {
        return <Notification key={key} {...event} />;
      }
      throw `unknown event ${type}`;
    });

    return <main className="message-list">{chatEventElements}</main>;
  }
}
