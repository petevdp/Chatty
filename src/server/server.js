// server.js
const express = require('express');
const WebSocket = require('ws');
const path = require('path')
const SocketServer = WebSocket.Server;

const { DIST } = require('../../constants');
const ChatRoom = require('./chatRoom');

const PORT = 3000;
const app = express();

const INDEX = path.join(__dirname, 'index.html')
console.log('dirname: ', __dirname);
// Create the WebSockets server
const wss = new SocketServer({
  server: app,
});

const chatRoom = new ChatRoom(wss)

app.use(express.static(__dirname))
app.get('/', (req, res) => {
  console.log('getting /')
  res.sendFile(INDEX)
})


app.listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));