import { ObjectId } from "mongodb";
import log from "@ajar/marker";
import { db } from "../../db/mongo.connection.mjs";

log.yellow(`chat.model loaded...`);



export async function getChatsByUser(user) {
  const chats = db.collection('Chats');
  return await chats.find({ participants: user }).toArray();
}

export async function createChatForUser(user) {
  const chats = db.collection('Chats');
  const newChat = {
    participants: [user],
    messages: []
  };
  const result = await chats.insertOne(newChat);
  return result.ops[0];
}

export async function sendMessage(user, chatId, message) {
  const chats = db.collection('Chats');
  const updatedChat = await chats.findOneAndUpdate(
    { _id: chatId, participants: user },
    { $push: { messages: message } },
    { returnOriginal: false }
  );
  return updatedChat.value;
}
