import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "public";
const COLLECTION_NAME = "bookings";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    if (req.method === "GET") {
        try {
            const bookings = await db.collection(COLLECTION_NAME).find().toArray();
            return res.status(200).json(bookings);
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (req.method === "POST") {
        try {
            const {
                carId,
                userId,
                pickUpLocation,
                dropOffLocation,
                pickUpDate,
                dropOffDate,
                totalPrice,
            } = req.body;

            const newBooking = {
                carId: new ObjectId(carId),
                userId: new ObjectId(userId),
                pickUpLocation: new ObjectId(pickUpLocation),
                dropOffLocation: new ObjectId(dropOffLocation),
                pickUpDate: new Date(pickUpDate),
                dropOffDate: new Date(dropOffDate),
                totalPrice: parseFloat(totalPrice),
                status: "Pending",
                paymentStatus: "Unpaid",
                createdAt: new Date(),
            };

            const result = await db.collection(COLLECTION_NAME).insertOne(newBooking);
            return res
                .status(201)
                .json({ message: "Booking created", id: result.insertedId });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    if (req.method === "DELETE") {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({ message: "Booking ID is required" });

            const result = await db
                .collection(COLLECTION_NAME)
                .deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0)
                return res.status(404).json({ message: "Booking not found" });

            return res.status(200).json({ message: "Booking deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
}