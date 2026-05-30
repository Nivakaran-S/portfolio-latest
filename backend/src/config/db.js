import mongoose from "mongoose";

/** Connect to MongoDB Atlas. Throws if MONGODB_URI is missing. */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set — copy .env.example to .env");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "portfolio" });
  console.log("✓ MongoDB connected");
}
