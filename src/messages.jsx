import React, { Component } from 'react';

const Message = props => {
  const { content, type, username } = props;
  return (
    <div className="message">
      <span className="message-username">{ username }</span>
      <span className="message-content">{ content }</span>
    </div>
  )
}
export default class MessageList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { messages } = this.props;
    return (
      <main className="message-list">
        {
          messages.map(msg => <Message key={msg.id} {...msg } />)
        }
        <div className="message system">
          Anonymous1 changed their name to nomnom.
        </div>
      </main>
    )
  }
}
