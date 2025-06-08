// pages/api/cars/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "public";
const COLLECTION_NAME = "cars";

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
      const { pickUpLocation, dropOffLocation, ...resData } = req.body;
      const newCar = {
        ...resData,
        pickUpLocation: new ObjectId(pickUpLocation),
        dropOffLocation: new ObjectId(dropOffLocation),
        status: "Available",
        createdAt: new Date(),
      };
      const result = await db.collection(COLLECTION_NAME).insertOne(newCar);
      return res
        .status(201)
        .json({ message: "Car created", id: result.insertedId });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const { id } = req.body;

      if (!id) return res.status(400).json({ message: "Car ID is required" });

      const result = await db
        .collection(COLLECTION_NAME)
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0)
        return res.status(404).json({ message: "Car not found" });

      return res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
