const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

class ChatRoom {
  constructor(wss, chatEvents = []) {
    this._wss = wss;
    this._initConnection();
    // chatroom state
    this._chatEvents = chatEvents;
  }

  _updateClients() {
    this._wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        console.log('sending')
        client.send(JSON.stringify({
          chatEvents: this._chatEvents
        }))
      }
    })
  }

  _addNewChatEvent(newChatEvent) {
    this._chatEvents = [
      ...this._chatEvents,
      {
        ...newChatEvent,
        id: uuidv4(),
      },
    ]
    this._updateClients()
  }

  _addNewMessage = (newMessage) => {
    this._addNewChatEvent(newMessage);
  }

  _addUserUpdate = (userUpdate) => {
    const {
      oldUser,
      newUser
    } = userUpdate;
  }

  _handleSocketMessage = (data) => {
    const {
      newMessage,
      userUpdate,
    } = JSON.parse(data);
    console.log('newMessage: ', newMessage);
    if (newMessage) {
      this._addNewMessage(newMessage)
    }
    if (userUpdate) {}
  }

  _initConnection = () => {
    this._wss.on('connection', this._onConnect)
  }

  _onConnect = ws => {
    console.log('Client connected');
    ws.send(JSON.stringify({
      chatEvents: this._chatEvents,
    }));

    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', () => console.log('Client disconnected'));
    ws.on('message', this._handleSocketMessage);
  }
}

module.exports = ChatRoom;