import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import log from '@ajar/marker';
import cors from 'cors';

import { connect_db } from './db/mongo.connection.mjs';
import user_router from './modules/user/user.router.mjs';
import chat_router from './modules/chat/chat.router.mjs';
import * as chat_controller from './modules/public_chat/public_chat.controller.mjs'
import public_router from './modules/public_chat/public_chat.router.mjs';
import { error_handler, error_handler2, not_found } from './middleware/errors.handler.mjs';

import ms from 'ms'
import session from 'express-session'


const {
  PORT = 8080,
  HOST = 'localhost',
  DB_URI,
  DB_NAME,
  CLIENT_URL = 'http://localhost:5173', // Adjust with your client URL
} = process.env;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
   
  },
});
app.use(session({ 
  secret: "some secret key", 
  resave: false, //we want new sessions only
  saveUninitialized: false, //if we didnt initialize with cookie, dont save it
  cookie: { maxAge: ms('30s') }
}))



app.use(cors());
app.use(morgan('dev'));

app.use('/api/users', user_router);
app.use('/api/public_chat',public_router);//,verifyAuth
app.use('/api/chat_room', chat_router);




//app.use(error_handler);
//app.use(error_handler2);

app.use('*', not_found);

io.on('connection', (socket) => {
  log.debug('client connected');
  log.yellow(socket.id);
  // socket.emit('server-msg', { message: 'Welcome to the chat!' });

  socket.on('client-msg', (data) => {

    log.obj(data, 'client says: ');
    chat_controller.sendMessage(data.message.username,data.message.text);
  
    // Parse the timestamp into a Date object
    //message.timestamp = new Date(message.timestamp);
  
    io.sockets.emit('server-msg', data); // Emit 'message' event to all connected clients
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

(async () => {
  await connect_db(DB_URI, DB_NAME);
  await server.listen(PORT, HOST);
  log.magenta(`API is live on http://${HOST}:${PORT}`);
})().catch(log.error);
