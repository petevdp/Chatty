// server.js
const express = require('express');
const WebSocket = require('ws');
const webpack = require('webpack')
const path = require('path')
const SocketServer = WebSocket.Server;
const webpackDevMiddleware = require('webpack-dev-middleware');

const { DIST, ROOT } = require('../../constants');
const ChatRoom = require('./chatRoom');

const PORT = process.env.PORT || 3000;
const app = express();

console.log('root: ', ROOT)
const config = require(path.join(ROOT, 'webpack/webpack.client.dev.js'))
const compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

// Create the WebSockets server
const wss = new SocketServer({
  server: app,
});

const chatRoom = new ChatRoom(wss)

const INDEX = path.join(DIST, 'index.html')
app.use(express.static(DIST))
app.get('/', (req, res) => {
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


app.listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));