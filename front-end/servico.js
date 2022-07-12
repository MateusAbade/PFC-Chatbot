const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config()

console.log(process.env.APP_HOST);

app.use(express.static(path.join(__dirname, 'views')));

app.set('views engine', 'ejs');

app.use(require('./routes/route'));


io.on('connection', socket => {
    console.log('socket conectado')
});

server.listen(port);
