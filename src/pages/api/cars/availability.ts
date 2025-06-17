import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { checkCarAvailability } from "@/lib/availabilityCheck";

const DB_NAME = "public";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { carId, pickUpDate, dropOffDate } = req.body;

        // Validate input
        if (!carId || !pickUpDate || !dropOffDate) {
            return res.status(400).json({
                message: "Missing required fields: carId, pickUpDate, or dropOffDate"
            });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Convert to Date objects
        const pickUpDateObj = new Date(pickUpDate);
        const dropOffDateObj = new Date(dropOffDate);

        // Validate dates
        if (dropOffDateObj <= pickUpDateObj) {
            return res.status(400).json({
                message: "Drop-off date must be after pick-up date"
            });
        }

        const available = await checkCarAvailability(
            db,
            new ObjectId(carId),
            pickUpDateObj,
            dropOffDateObj
        );

        return res.status(200).json({ available });
    } catch (error) {
        console.error("Availability check error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}