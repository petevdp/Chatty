import React, { Component } from "react";
import moment from "moment";

const imageUrlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

const Username = ({ color, username }) => (
  <span className="message-username" style={{ color: color }}>
    {username}
  </span>
);

const Message = props => {
  const { content, userObject } = props;
  const getContentWithImages = content => {
    const img = src => (
      <a href={src}>
        <img src={src} />
      </a>
    );

    return content
      .split(" ")
      .map(group => " " + group + " ")
      .map(group => (group.match(imageUrlRegex) ? img(group) : group));
  };

  const contentWithImages = getContentWithImages(content);
  console.log("content: ", contentWithImages);
  return (
    <div className="message">
      <span className="message__user-container">
        <Username {...userObject} />
        <span style={{ color: "black" }}>:</span>
        <span className="message-content">{contentWithImages}</span>
      </span>
    </div>
  );
};

const Notification = ({ content }) => (
  <div className="message system">{content}</div>
);

const NameChange = ({ oldUserObject, newUserObject }) => (
  <div className="message system">
    <Username {...oldUserObject} />
    has changed their name to
    <Username {...newUserObject} />
  </div>
);

const Image = ({ url }) => (
  <div className="image">
    <img src={url} />
  </div>
);

const NewUser = ({ userObject }) => (
  <div className="message system">
    <Username {...userObject} /> has connected
  </div>
);

const Disconnect = ({ userObject }) => (
  <div className="message system">
    <Username {...userObject} /> has disconnected
  </div>
);

const ChatEvent = ({ time, type, ...eventData }) => {
  const getEventOfType = eventComponent => data =>
    React.createElement(eventComponent, { key: data.id, ...data });

  const eventMapping = {
    message: getEventOfType(Message),
    image: getEventOfType(Image),
    newUser: getEventOfType(NewUser),
    newUsername: getEventOfType(NameChange),
    disconnect: getEventOfType(Disconnect)
  };

  console.log("type: ", type);
  const eventDetails = eventMapping[type](eventData);

  if (!eventDetails) {
    throw `unknown event ${type}`;
  }

  console.log("event details: ", eventDetails);
  return (
    <div className="chat-event">
      {[eventDetails]}
      <span className="chat-event__time">{moment(time).fromNow()}</span>
    </div>
  );
};

export default class ChatEventList extends Component {
  render() {
    const { messages: chatEvents, userList } = this.props;

    const chatEventElements = chatEvents.map(event => {
      const { id } = event;
      return <ChatEvent key={id} userList={userList} {...event} />;
    });

    return <main className="message-list">{chatEventElements}</main>;
  }
}
