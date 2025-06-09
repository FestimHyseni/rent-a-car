import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cachedClient: Mongoose | null = global.mongooseClient;
// @ts-ignore
let cachedPromise: Promise<Mongoose> | null = global.mongoosePromise;

if (!cachedClient) {
  // @ts-ignore
  cachedClient = global.mongooseClient = null;
  // @ts-ignore
  cachedPromise = global.mongoosePromise = null;
}

async function dbConnect(): Promise<Mongoose> {
  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering if you want to handle connection errors explicitly
    };

    cachedPromise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cachedClient = await cachedPromise;
  } catch (e) {
    cachedPromise = null;
    cachedClient = null;
    throw e;
  }

  return cachedClient;
}

export default dbConnect;
