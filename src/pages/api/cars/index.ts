// pages/api/cars/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "public";
const CARS_COLLECTION = "cars";
const BRANDS_COLLECTION = "brands";
const MODELS_COLLECTION = "models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);

      const pipeline = [
        {
          $lookup: {
            from: MODELS_COLLECTION,
            localField: "makeModel",
            foreignField: "_id",
            as: "modelDetails",
          },
        },
        {
          $lookup: {
            from: BRANDS_COLLECTION,
            localField: "make",
            foreignField: "_id",
            as: "brandDetails",
          },
        },
        {
          $unwind: { path: "$modelDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            year: 1,
            price: 1,
            status: 1,
            color: 1,
            doors: 1,
            seats: 1,
            transmission: 1,
            fuelType: 1,
            pickUpLocation: 1,
            dropOffLocation: 1,
            createdAt: 1,
            imageUrl: 1,
            make_id: "$brandDetails.name",
            makeModel: "$modelDetails.name",
          },
        },
      ];

      const cars = await db
        .collection(CARS_COLLECTION)
        .aggregate(pipeline)
        .toArray();

      return res.status(200).json(cars);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);

      console.log(req.body);

      const { make, makeModel, pickUpLocation, dropOffLocation, ...resData } =
        req.body;

      // --- START OF VALIDATION ---
      // Check if all required fields were sent from the client
      if (!make || !makeModel || !pickUpLocation || !dropOffLocation) {
        return res.status(400).json({
          message: "Missing required fields. Please fill out the entire form.",
        });
      }

      // Optional but good practice: Check if the IDs look valid before creating ObjectId
      // This is a simple check; more robust libraries like 'bson' can also be used.
      const isValidObjectId = (id: string) =>
        typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

      if (
        !isValidObjectId(make) ||
        !isValidObjectId(makeModel) ||
        !isValidObjectId(pickUpLocation) ||
        !isValidObjectId(dropOffLocation)
      ) {
        return res.status(400).json({
          message: "Invalid ID format provided for one or more fields.",
        });
      }
      // --- END OF VALIDATION ---

      const newCar = {
        ...resData,
        // Now it's safe to create ObjectIds
        make: new ObjectId(make),
        makeModel: new ObjectId(makeModel),
        pickUpLocation: new ObjectId(pickUpLocation),
        dropOffLocation: new ObjectId(dropOffLocation),
        status: "Available",
        createdAt: new Date(),
      };

      const result = await db.collection(CARS_COLLECTION).insertOne(newCar);
      return res
        .status(201)
        .json({ message: "Car created", id: result.insertedId });
    } catch (error) {
      console.error(error);
      // Check if the error is a BSONError and provide a more specific message
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name: string }).name === "BSONError"
      ) {
        return res.status(400).json({
          message: "An invalid ID was provided. Please check your selections.",
        });
      }
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
        .collection(CARS_COLLECTION)
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0)
        return res.status(404).json({ message: "Car not found" });

      return res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).json({ message: `Method ${req.method} not allowed` });
}
