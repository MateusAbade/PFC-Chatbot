const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

app.use(session({
    secret:'pfcbot',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());

app.use((req, res, next)=>{
    res.locals.mensagemSucesso = req.flash('mensagemSucesso')
    res.locals.mensagemErro = req.flash('mensagemErro')
    next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'views')));

app.set('views engine', 'ejs');

app.use(require('./routes/route'));


io.on('connection', socket => {
    console.log('socket conectado')
});

server.listen(port);
