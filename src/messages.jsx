import React, { Component } from "react";
import moment from "moment";

const Message = props => {
  const { content, username, userColor } = props;
  console.log("color: ", userColor);
  return (
    <div className="message">
      <span className="message-username" style={{ color: userColor }}>
        {username}
      </span>
      <span className="message-content">{content}</span>
    </div>
  );
};

const Notification = ({ content }) => (
  <div className="message system">{content}</div>
);

const Image = ({ url }) => (
  <div className="image">
    <img src={url} />
  </div>
);

const ChatEvent = ({ time, userId, userList, ...eventData }) => {
  const getChatEvent = ({ type, ...data }) => {
    if (type === "message") {
      const user = userList.find(user => userId === user.id);
      if (!user) {
        throw `user ${userId} does not exist`;
      }
      return <Message userColor={user.color} {...data} />;
    }
    if (type === "notification") {
      return <Notification {...data} />;
    }
    if (type === "image") {
      const { url } = data;
      return <Image url={url} />;
    }

    throw `unknown event ${type}`;
  };
  const chatEvent = getChatEvent(eventData);

  return (
    <div className="chat-event">
      {chatEvent}
      <span className="chat-event__time">{moment(time).fromNow()}</span>
    </div>
  );
};

export default class ChatEventList extends Component {
  render() {
    const { messages: chatEvents, userList, userId } = this.props;

    const chatEventElements = chatEvents.map(event => {
      const { id } = event;
      return (
        <ChatEvent key={id} userId={userId} userList={userList} {...event} />
      );
    });

    return <main className="message-list">{chatEventElements}</main>;
  }
}
