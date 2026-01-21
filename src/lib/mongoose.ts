import mongoose from "mongoose";

// Cache the connection so we don't reconnect on every request
let isConnected = false;

export async function connectDB() {
  // Read the Mongo connection string from environment variables
  const uri = process.env.MONGODB_URI;

  // Basic safety check to avoid silent failures
  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env.local");
  }

  // If already connected, just reuse the existing connection
  if (isConnected) return;

  // Connect to MongoDB using mongoose
  await mongoose.connect(uri);

  // Mark as connected for next calls
  isConnected = true;
}
