import log from '@ajar/marker';
import * as chat_model from "./chat.model.mjs";

log.cyan(`chat.controller loaded...`);




export async function getChatsByUser(user) {
  return await chat_model.getChatsByUser(user);
}

export async function createChatForUser(user) {
  return await chat_model.createChatForUser(user);
}

export async function sendMessage(user, chatId, message) {
  return await chat_model.sendMessage(user, chatId, message);
}
