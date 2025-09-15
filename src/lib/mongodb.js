import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global.storedMongoClient) {
    client = new MongoClient(uri, options);
    global.storedMongoClient = client.connect();
  }
  clientPromise = global.storedMongoClient;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return mongoose.connection.db;
  }

  try {
    const db = await mongoose.connect(uri, options);
    isConnected = true;
    console.log("Connected to MongoDB");
    return db.connection.db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default clientPromise;
