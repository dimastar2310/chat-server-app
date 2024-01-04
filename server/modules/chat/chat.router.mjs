// router modules handle incoming HTTP requests related to the user resource.
// the HTTP layer is responsible for:
// parsing the request body
// validating the request body
// calling the appropriate service layer function
// returning the appropriate HTTP status code
import express from 'express';
import log from '@ajar/marker';
import * as chat_controller from './chat.controller.mjs';
import raw from "../../middleware/route.async.wrapper.mjs";

const router = express.Router();

router.use(express.json());

// Route to get all chats for a user



router.get('/:user/retrive_message', raw(async (req, res) => {
  const { user } = req.params;
  const chats = await chat_controller.getChatsByUser(user);
  res.status(200).json(chats);
}));

// Route to create a chat for a user
//
router.post('chat_room/:user', raw(async (req, res) => {
  const { user } = req.params;
  const newChat = await chat_controller.createChatForUser(user);
  res.status(201).json(newChat);
}));



// Route to send a message in a chat
router.post('chat_room/:user', raw(async (req, res) => {
  const { user, chatId } = req.params;
  const { message } = req.body;
  const sentMessage = await chat_controller.sendMessage(user, chatId, message);
  res.status(200).json(sentMessage);
}));

export default router;
