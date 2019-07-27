// server.js
const express = require('express');
const WebSocket = require('ws');
const webpack = require('webpack')
const path = require('path')
const SocketServer = WebSocket.Server;
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const { DIST, ROOT } = require('../../constants');
const ChatRoom = require('./chatRoom');

const PORT = process.env.PORT || 3000;
const app = express();

const INDEX = path.join(DIST, 'index.html')
app.use(express.static(DIST))

if (process.env.NODE_ENV === 'development') {
  const config = require(path.join(ROOT, 'webpack/webpack.client.dev.js'))
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler))
  // Create the WebSockets server
  app.get('*', (req, res) => {
    console.log('getting /')
    compiler.outputFileSystem.readFile(INDEX, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
} else {
  app.get('*', (req, res) => {
    console.log('getting /')
      res.sendFile(INDEX)
  });
}

const wss = new SocketServer({
  port: 40510,
});

const chatRoom = new ChatRoom(wss)

app.listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));