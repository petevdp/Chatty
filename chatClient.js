const uuidv4 = require('uuid/v4');
const WebSocket = require('ws');

const {
  getRandomColor: generateRandomColor,
  generateRandomUsername,
} = require('./data-helpers')

class ChatClient {
  constructor(socket, addChatEvent, getRoomState, addToChatClientList) {
    this._addChatEvent = addChatEvent;
    this._getRoomState = getRoomState;

    this._socket = socket;
    this._displayData = {
      username: generateRandomUsername(),
      color: generateRandomColor(),
    }
    this.id = uuidv4();
    console.log('const readyState', this._socket.readyState)

    this._registerSocketHandlers();

    addToChatClientList(this);

    this._addChatEvent({
      userObject: this._displayData,
      type: 'newUser',
    });

    this._sendMessage(
      'registered', {
        userId: this._id,
        username: this._displayData.username,
      }
    )
  }

  isActive = () => {
    console.log('readyState: ', this._socket.readyState);
    return this._socket.readyState === WebSocket.OPEN;
  }

  _sendMessage = (type, data) => {
    this._socket.send(JSON.stringify({
      type,
      data,
    }))
  }

  updateSocketState = () => {
    console.log(`updating ${this._displayData.username}`);
    this.isActive() &&
      this._sendMessage(
        'update',
        this._getRoomState(),
      );
  }

  _updateDisplayData = (update) => {
    this._displayData = {
      ...this._displayData,
      ...update
    }
  }

  _changeUsername = newUsername => {
    const {
      color,
      username: oldUsername
    } = this._displayData;
    const UsernameChangeEvent = {
      oldUserObject: {
        username: oldUsername,
        color,
      },
      newUserObject: {
        username: newUsername,
        color,
      },
      type: 'newUsername',
    }

    this._updateDisplayData({
      username: newUsername
    });
    this._addChatEvent(UsernameChangeEvent)
  }

  _addMessage = (content) => {
    this._addChatEvent({
      content,
      type: 'message',
      userObject: this._displayData,
    });
  }

  _handleSocketMessage = dataString => {
    const {
      requestType,
      ...data
    } = JSON.parse(dataString);

    if (requestType === 'updateClient') {
      this.updateSocketState();
    }

    if (requestType === 'newMessage') {
      const {
        message
      } = data;
      this._addMessage(message.content);
    }

    if (requestType === 'changeUsername') {
      const {
        newUsername
      } = data;
      this._changeUsername(newUsername);
    }
  }

  _registerSocketHandlers = () => {
    this._socket.on('close', () => console.log('socket closed'));
    this._socket.on('message', this._handleSocketMessage);
  }
}

module.exports = ChatClient;