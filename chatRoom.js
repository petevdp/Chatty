const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const {
  getRandomColor,
  generateRandomUsername,
} = require('./data-helpers')

class ChatRoom {
  constructor(wss, chatEvents = []) {
    this._wss = wss;
    this._chatClients = [];
    this._initConnection();
    // chatroom state
    this._chatEvents = chatEvents;
  }

  _updateClient = (ws, username) => {
    ws.send(JSON.stringify({
      type: 'update',
      chatEvents: this._getChatEventsWithDirection(username),
      userList: this._getUserList(),
    }));
  }

  _updateClients() {
    this._chatClients.forEach(userClient => {
      const {
        ws,
        username
      } = userClient;
      if (ws.readyState === WebSocket.OPEN) {
        this._updateClient(ws, username);
      }
    })
  }

  _getUserList = () => (
    this._chatClients.map(({
      ws,
      ...rest
    }) => rest)
  )

  _addNewChatEvent(newChatEvent) {
    this._chatEvents = [
      ...this._chatEvents,
      {
        ...newChatEvent,
        id: uuidv4(),
        time: new Date(),
      },
    ]
    this._updateClients();
  }

  _displayAnyImages = (content, userId) => {
    const imageUrlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g
    const matches = content.match(imageUrlRegex);
    matches && matches.forEach(url => {
      this._addNewChatEvent({
        type: 'image',
        userId,
        url,
      })
    })
  }

  _addNewMessage = (message, userId) => {
    this._addNewChatEvent({
      ...message,
      type: 'message',
      userId,
    });
    this._displayAnyImages(message.content, userId);
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


  _addChatClient = ws => {
    const userId = uuidv4()
    const username = generateRandomUsername();
    this._chatClients.push({
      ws,
      username,
      id: userId,
      color: getRandomColor(),
    })
    ws.send(JSON.stringify({
      type: 'registered',
      userId,
      username,
    }));
    this._addNewChatEvent({
      content: `${username} has joined the chat`,
      type: 'notification',
    })
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

    if (requestType === 'registerClient') {
      this._addChatClient(ws);
    }

    const {
      userId
    } = data;

    if (requestType === 'updateClient') {
      const {
        username
      } = data;
      this._updateClient(ws, username);
    }

    if (requestType === 'newMessage') {
      const {
        message
      } = data;
      this._addNewMessage(message, userId)
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
  }


  _initConnection = () => {
    this._wss.on('connection', this._onConnect)
  }


  _onConnect = ws => {
    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', () => this._deleteChatClient(ws));
    ws.on('message', (data) => this._handleSocketMessage(ws, data));
  }
}

module.exports = ChatRoom;