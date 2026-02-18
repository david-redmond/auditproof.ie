import { connectToDatabase } from "@/lib/mongoose";
import type { Db } from "mongodb";

/**
 * Returns the native MongoDB Db instance from the existing Mongoose connection.
 * Use for one-off collections (e.g. partner_applications) that don't need a Mongoose model.
 */
export async function getDb(): Promise<Db> {
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB not connected");
  return db;
}
