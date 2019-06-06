const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

class ChatRoom {
  constructor(wss, chatEvents = []) {
    this._wss = wss;
    this._chatClients = [];
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
    console.log('newChatEvent: ', newChatEvent);
    this._chatEvents = [
      ...this._chatEvents,
      {
        ...newChatEvent,
        id: uuidv4(),
      },
    ]
    this._updateClients()
  }

  _addNewMessage = message => {
    this._addNewChatEvent({
      ...message,
      type: 'message'
    });
  }

  _addUserUpdate = userUpdate => {
    const {
      oldUser,
      newUser
    } = userUpdate
    const event = {
      content: `${oldUser} changed their name to ${newUser}`,
      type: 'notification'
    }
    this._addNewChatEvent(event)
  }

  _getChatEventsWithDirection = clientUsername => (
    this._chatEvents.map(event => ({
      ...event,
      direction: (
        event.username === clientUsername ?
        'outgoing' :
        'incoming'
      ),
    }))
  )

  _updateUserSocket = (ws, username) => {
    ws.send({
      chatEvents: this._addDirections(username),
    })
  }

  _addchatClient = (ws, username) => {
    this._chatClients.push({
      ws,
      username,
    })
  }

  _handleSocketMessage = (ws, dataString) => {
    const {
      requestType,
      ...data
    } = JSON.parse(dataString);
    console.log('server message!')
    console.log('requestType: ', requestType);
    console.log('data: ', data);

    if (requestType === 'register') {
      const {
        username
      } = data;
      this._addchatClient(ws, username);
    }

    if (requestType === 'getEvents') {
      const {
        username
      } = data;
      this._updateUser(ws, username);
    }

    if (requestType === 'newMessage') {
      console.log('new message!')
      const {
        message
      } = data;
      this._addNewMessage(message)
    }

    if (requestType === 'updateUser') {
      const {
        userUpdate
      } = data;
      this._addUserUpdate(userUpdate);
    }
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
    ws.on('message', (data) => this._handleSocketMessage(ws, data));
  }
}

module.exports = ChatRoom;