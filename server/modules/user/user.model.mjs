import { ObjectId } from "mongodb";
import log from "@ajar/marker";
import { db } from "../../db/mongo.connection.mjs";
import bcrypt from "bcrypt";


log.yellow(`user.model loaded...`, 'db: ' + db);

// const users = db?.collection("users");
//const collection = db?.collection("Dima");

//console.log("the collection name is ?",collection);

export async function create(user) {
    //check if the user is already exist

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return await db.collection("Dima").insertOne(user);
}

export async function getAll(page = 1, limit = 20) {
    log.magenta(`getAll()`, 'db: ' + db);
    log.red(`at user.model and type of page is ${typeof page}`);
    const users = db.collection("Dima");
    return await users.find()
                    .limit(limit)
                    .skip(limit * (page - 1))
                    .toArray();
}

export async function getOne(userId) {
    const users = db.collection("Dima");
    // const filter = { _id: userId };
    const filter = { _id: new ObjectId(userId) };
    return await users.findOne(filter);
}
export async function getOneByUser(user_name) {
    const users = db.collection("Dima");
    // const filter = { _id: userId };
    //log.red("at user.model")
    const filter = { user: user_name };
    return await users.findOne(filter);
}

export async function updateOne(userId,payload) {
    const users = db.collection("Dima");
    const filter = { _id: new ObjectId(userId) };
    return await users.updateOne(filter, {$set: payload});
}

export async function replaceOne(userId,payload) {
    const users = db.collection("Dima");
    const filter = { _id: new ObjectId(userId) };
    return await users.replaceOne(filter, payload);
}

export async function deleteOne(userId) {
    const users = db.collection("Dima");
    const filter = { _id: new ObjectId(userId) };
    return await users.deleteOne(filter);
}