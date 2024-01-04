// router modules handle incoming HTTP requests related to the user resource.
// the HTTP layer is responsible for:
// parsing the request body
// validating the request body
// calling the appropriate service layer function
// returning the appropriate HTTP status code
import express from 'express';
import log from '@ajar/marker';
import * as chat_controller from './public_chat.controller.mjs';
import raw from "../../middleware/route.async.wrapper.mjs";

//lets say all is public chat here 



const router = express.Router();

router.use(express.json());
//this cookie is for the session
//session should be stored here 


// Route to get all chats for a user
// Middleware to verify user authentication
const verifyAuth = (req, res, next) => {
  console.log('verifyAuth', req.url);
  if (req.session.user) {
    console.log('verifyAuth2', req.url);
    next(); // User is authenticated, proceed to the next middleware/route
  } else {
    res.redirect('/api/users/login'); // Redirect unauthenticated user to login page
  }
};

router.get('/retrive_message', async (req, res) => {
  try {
    // log.obj(req.session, 'req.session:');
    // // Assuming you use the user data from the session to retrieve chats
    // const user = req.session.user;
    if(req.session.user){
    console.log('req.session.user2', req.session.user);
    const chats = await chat_controller.getChatsByUser();
    res.status(200).json(chats);
    }
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Internal Server Error.' });
  }
});
// Route to get all chats for a user
// router.get('/retrive_message/:user', raw(async (req, res) => {
//   const { user } = req.params;
//   const chats = await chat_controller.getChatsByUser(user);
//   res.status(200).json(chats);
// }));

// // Route to create a chat for a user
// //
// router.post('chat_room/:user', raw(async (req, res) => {
//   const { user } = req.params;
//   const newChat = await chat_controller.createChatForUser(user);
//   res.status(201).json(newChat);
// }));



// Route to send a message in a chat
router.post('/send_message', raw(async (req, res) => {
  //const { user } = req.params;
  const {user,message } = req.body;
  const sentMessage = await chat_controller.sendMessage(user, message);
  res.status(200).json(sentMessage);
}));

export default router;
