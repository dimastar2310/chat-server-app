import log from '@ajar/marker';
import * as chat_model from "./public_chat.model.mjs";

log.cyan(`chat.controller loaded...`);




export async function getChatsByUser() {
  return await chat_model.getChatsByUser();
}

// export async function createChatForUser(user) {
//   return await chat_model.createChatForUser(user);
// }

export async function sendMessage(user,message) {
  return await chat_model.sendMessage(user,message);
}
