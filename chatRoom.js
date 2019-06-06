const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const {
  getRandomColor
} = require('./data-helpers')
class ChatRoom {
  constructor(wss, chatEvents = []) {
    this._wss = wss;
    this._chatClients = [];
    this._initConnection();
    // chatroom state
    this._chatEvents = chatEvents;
  }

  _updateClients() {
    this._chatClients.forEach(userClient => {
      const {
        ws,
        username
      } = userClient;
      if (ws.readyState === WebSocket.OPEN) {
        console.log(`sending to ${username}`)
        ws.send(JSON.stringify(this._updateClientState(username)))
      }
    })
  };
  _getUserList = () => (
    this._chatClients.map(({
      ws,
      ...rest
    }) => rest)
  )

  _updateClientState = username => ({
    chatEvents: this._getChatEventsWithDirection(username),
    userList: this._getUserList(),
  });

  _addNewChatEvent(newChatEvent) {
    console.log('newChatEvent: ', newChatEvent);
    this._chatEvents = [
      ...this._chatEvents,
      {
        ...newChatEvent,
        id: uuidv4(),
      },
    ]
    this._updateClients();
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
      newUser,
    } = userUpdate
    const event = {
      content: `${oldUser} changed their name to ${newUser}`,
      type: 'notification',
      username: newUser,
    }
    this._addNewChatEvent(event)
  }

  _getChatEventsWithDirection = clientUsername => {
    if (!clientUsername) {
      console.warn('needs client username');
    }
    return this._chatEvents.map(event => {
      const direction = (
        event.username && event.username === clientUsername ?
        'outgoing' :
        'incoming'
      )
      return {
        ...event,
        direction,
      }
    })
  }

  _updateUserSocket = (ws, username) => {
    const events = this._getChatEventsWithDirection(username)
    console.log('event:', events[0])
    ws.send(JSON.stringify({
      chatEvents: events
    }));
  }

  _addChatClient = (ws, username) => {
    this._chatClients.push({
      ws,
      username,
      id: uuidv4(),
      color: getRandomColor(),
    })
    this._addNewChatEvent({
      content: `${username} has joined the chat`,
      type: 'notification',
    })
    console.log('chatClients: ', this._chatClients);
  }

  _deleteChatClient = (ws) => {
    const clients = this._chatClients;
    const clientIndex = clients.findIndex(client => client.ws === ws)
    const username = clients[clientIndex].username;
    clients.splice(clientIndex, 1);
    this._addNewChatEvent({
      content: `${username} has left the chat`,
      type: 'notification',
    });
  }

  _handleSocketMessage = (ws, dataString) => {
    const {
      requestType,
      ...data
    } = JSON.parse(dataString);
    console.log('server message!')
    console.log('requestType: ', requestType);
    console.log('data: ', data);

    if (requestType === 'registerClient') {
      const {
        username
      } = data;
      console.log(`adding chat client ${username}`)
      this._addChatClient(ws, username);
    }

    if (requestType === 'updateClient') {
      const {
        username
      } = data;
      this._updateUserSocket(ws, username);
    }

    if (requestType === 'newMessage') {
      console.log('new message!')
      const {
        message
      } = data;
      this._addNewMessage(message)
    }

    if (requestType === 'userUpdate') {
      const {
        userUpdate
      } = data;
      this._updateUsername(userUpdate);
    }
  }

  _updateUsername(userUpdate) {
    this._addUserUpdate(userUpdate)
    const clients = this._chatClients;
    const clientIndex = clients.findIndex(client => (
      userUpdate.username === client.oldUser
    ))
    clients[clientIndex].username = userUpdate.newUser;
    console.log('new username: ', clients[clientIndex].username);
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
    ws.on('close', () => this._deleteChatClient(ws));
    ws.on('message', (data) => this._handleSocketMessage(ws, data));
  }
}

module.exports = ChatRoom;