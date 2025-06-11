// pages/api/roles/[id].ts
// Note: The file path is now [id].ts to correctly handle dynamic IDs from the URL path.
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "public";
const COLLECTION_NAME = "roles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // For a file at /api/roles/[id].ts, req.query.id will contain the ID from the URL.
  const { id } = req.query;

  if (req.method === "GET") {
    // First, validate that the ID from the URL is a valid format.
    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "A valid ID is required." });
    }

    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      // Find the single document matching the ID.
      const role = await collection.findOne({
        _id: new ObjectId(id as string),
      });

      // If no document is found, `findOne` returns null, leading to a 404.
      // This is the most likely cause of the error you're seeing.
      // Double-check that an item with this ID actually exists in your 'roles' collection.
      if (!role) {
        return res
          .status(404)
          .json({ message: "role not found with the provided ID." });
      }

      // If found, return the document.
      return res.status(200).json(role);
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Handle other methods for a specific resource (e.g., PUT, DELETE)
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
