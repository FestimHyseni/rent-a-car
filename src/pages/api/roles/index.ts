// pages/api/roles/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "public";
const COLLECTION_NAME = "roles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const roles = await db.collection(COLLECTION_NAME).find().toArray();

      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
