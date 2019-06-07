// server.js
const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

const ChatRoom = require('./chatRoom');
// sample messages
let messages = require('./messages')

const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({
  server
});


const chatRoom = new ChatRoom(wss)