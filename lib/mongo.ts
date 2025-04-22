// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}
const uri: string = process.env.MONGODB_URI;

// You can pass additional options here if you need them
const options: MongoClientOptions = {};

// Extend the NodeJS global type so `_mongoClientPromise` doesn’t error out
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (typeof global._mongoClientPromise === "undefined") {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
