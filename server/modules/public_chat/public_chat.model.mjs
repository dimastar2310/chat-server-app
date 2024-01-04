import { ObjectId } from "mongodb";
import log from "@ajar/marker";
import { db } from "../../db/mongo.connection.mjs";

log.yellow(`chat.model loaded...`);

//change db name

export async function getChatsByUser() { //get all the chats for user public 
  const chats = db.collection('Chats2');
  return await chats.find({}).toArray();
}

export async function createChatForUser(user) {
  const chats = db.collection('Chats2');
  const newChat = {
    participants: [user],
    messages: []
  };
  const result = await chats.insertOne(newChat);
  return result.ops[0];
}


//this one for postman only
export async function sendMessage(user, message) {
  const chats = db.collection('Chats2');
  //const timestamp = new Date(); // Get the current timestamp

  // Insert the message into the collection with the timestamp field
  // await chats.insertOne({ username: user, text: message, timestamp });
  await chats.insertOne({ username: user, text: message });

  // Retrieve the inserted message
  const insertedMessage = await chats.findOne({ username: user, text: message });

  return insertedMessage;
}
