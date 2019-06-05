// server.js
const express = require('express');
// const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;

const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

let messages = require('./messages')

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({
  server
});

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

const updateAllMessages = (wss, messages) => {
  wss.clients.forEach(client => {
    if (client.readyState == WebSocket.OPEN) {
      console.log('sending')
      client.send(JSON.stringify({
        messages
      }));
    }
  })
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  const sendMessages = () => {
    ws.send(JSON.stringify({
      messages,
    }));
  }
  sendMessages();

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
  ws.on('message', (data) => {
    console.log('message recieved');
    const {
      messages: clientMessages,
      newMessage,
    } = JSON.parse(data);
    const messages = [
      ...clientMessages,
      {
        ...newMessage,
        id: uuidv4(),
      }
    ];
    console.log('latest: ', messages[messages.length - 1]);
    // console.log(messages)
    updateAllMessages(wss, messages);
  });
});