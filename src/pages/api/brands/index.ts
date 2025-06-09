// pages/api/cars/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "public";
const BRANDS_COLLECTION = "brands";
const MODELS_COLLECTION = "models"; // Assuming your models collection is named "models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);

      // The aggregation pipeline to join brands with their models
      const pipeline = [
        {
          // Stage 1: The "left join"
          $lookup: {
            from: MODELS_COLLECTION, // The collection to join with.
            localField: "_id", // The field from the input documents (brands).
            foreignField: "brand_id", // The field from the documents of the "from" collection (models).
            as: "models", // The name of the new array field to add to the input documents.
          },
        },
      ];

      // Execute the aggregation pipeline on the 'brands' collection
      const brandsWithModels = await db
        .collection(BRANDS_COLLECTION)
        .aggregate(pipeline)
        .toArray();

      return res.status(200).json(brandsWithModels);
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
