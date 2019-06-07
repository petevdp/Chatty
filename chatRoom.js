const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');

const {
  getRandomColor,
  generateRandomUsername,
} = require('./data-helpers')
const ChatClient = require('./chatClient')

class ChatRoom {
  constructor(wss, chatEvents = []) {
    this._wss = wss;
    this._chatClients = [];
    this._initConnection();
    // chatroom state
    this._chatEvents = chatEvents;
  }

  _updateClientSocket = (ws, username) => {
    ws.send(JSON.stringify({
      type: 'update',
      chatEvents: this._getChatEventsWithDirection(username),
      userList: this._getUserList(),
    }));
  }

  _updateAllClientSockets() {
    console.log('update client sockets');
    console.log('chacClients', this._chatClients)
    this._chatClients.forEach(chatClient => {
      chatClient.updateSocketState();
    });
  }

  _getUserList = () => (
    this._chatClients.map(({
      ws,
      ...rest
    }) => rest)
  )

  _addNewChatEvent = (newChatEvent) => {
    this._chatEvents = [
      ...this._chatEvents,
      {
        ...newChatEvent,
        id: uuidv4(),
        time: new Date(),
      },
    ]
    this._updateAllClientSockets();
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
    const {
      ws,
      ...userObject
    } = this._getChatClient(userId);
    this._addNewChatEvent({
      ...message,
      type: 'message',
      userObject,
    });
    this._displayAnyImages(message.content, userId);
  }

  _addUserUpdate = (newUsername, oldUsername, color) => {
    const event = {
      oldUserObject: {
        username: newUsername,
        color,
      },
      newUserObject: {
        username: newUsername,
        color,
      },
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

  _getChatClient = id => (
    this._chatClients.find(client => client.id === id)
  )

  _getRoomState = () => ({
    chatEvents: this._chatEvents,
    userList: this._getUserList(),
  })

  _addChatClient = ws => {
    const addToChatClientLIst = (chatClient) => {
      console.log('chatClient', chatClient);
      this._chatClients.push(chatClient);
    };
    new ChatClient(ws, this._addNewChatEvent, this._getRoomState, addToChatClientLIst);
  }

  _handleSocketMessage = (ws, dataString) => {
    const {
      requestType,
      data
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
      this._updateClientSocket(ws, username);
    }

    if (requestType === 'newMessage') {
      const {
        message
      } = data;
      this._addNewMessage(message, userId)
    }

    if (requestType === 'userUpdate') {
      const {
        newUsername
      } = data;
      this._updateUsername(userId, newUsername);
    }
  }

  _updateClientInfo = (id, updates) => {}

  _updateUsername(userId, newUsername) {
    const clients = this._chatClients;
    const clientIndex = clients.findIndex(client => (
      userUpdate.username === client.oldUser
    ))
    const {
      username,
      color
    } = clients[clientIndex];
    this._addUserUpdate(newUsername, username, color);
    clients[clientIndex].username = userUpdate.newUser;
  }


  _initConnection = () => {
    this._wss.on('connection', ws => this._addChatClient(ws))
  }

  // _onConnect = ws => {
  //   // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  //   ws.on('close', () => this._deleteChatClient(ws));
  //   ws.on('message', (data) => this._handleSocketMessage(ws, data));
  // }
}

module.exports = ChatRoom;