const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const ChatClient = require('./chatClient')

class ChatRoom {
  constructor(wss, chatEvents = []) {
    this._wss = wss;
    this._chatClients = [];

    // chatroom state
    this._chatEvents = chatEvents;
    this._wss.on('connection', ws => this._addChatClient(ws))
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

  _getChatClient = id => (
    this._chatClients.find(client => client.id === id)
  )

  _getRoomState = () => ({
    chatEvents: this._chatEvents,
    userList: this._getUserList(),
  })

  _addChatClient = ws => {
    const chatClient = new ChatClient(ws, this._addNewChatEvent, this._getRoomState);
    this._chatClients.push(chatClient);
    chatClient.broadcast();
  }
}

module.exports = ChatRoom;