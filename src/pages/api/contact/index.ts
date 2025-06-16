// pages/api/cars/index.ts
import { BSON, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "public";
const COLLECTION_NAME = "contactUs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const cars = await db.collection(COLLECTION_NAME).find().toArray();

      return res.status(200).json(cars);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);

      console.log(req.body);

      const result = await db.collection(COLLECTION_NAME).insertOne(req.body);

      return res.status(201).json({
        message: "User created and email sent",
        id: result.insertedId,
      });
    } catch (error) {
      console.error("Create error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  if (req.method === "DELETE") {
    try {
      const id = req.body;


      if (!id) {
        return res
          .status(400)
          .json({ message: "ID is required for deletion." });
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);

      const filter = { _id: new ObjectId(id) };

      const result = await db.collection(COLLECTION_NAME).deleteOne(filter);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Delete error:", error);

      if (error instanceof BSON.BSONError) {
        return res.status(400).json({ message: "Invalid ID format." });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
