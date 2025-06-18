import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { checkCarAvailability } from "../../../lib/availabilityCheck";

const DB_NAME = "public";
const COLLECTION_NAME = "bookings";
const LOCATIONS_COLLECTION = "locations";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Handle count requests
    if (req.method === "GET" && req.query.count === "true") {
        try {
            const count = await db.collection(COLLECTION_NAME).countDocuments();
            return res.status(200).json({ count });
        } catch (error) {
            console.error("Booking count error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Handle total income calculation
    if (req.method === "GET" && req.query.totalIncome === "true") {
        try {
            const result = await db
                .collection(COLLECTION_NAME)
                .aggregate([
                    {
                        $group: {
                            _id: null,
                            totalIncome: { $sum: "$totalPrice" }
                        }
                    }
                ])
                .toArray();

            const totalIncome = result[0]?.totalIncome || 0;
            return res.status(200).json({ totalIncome });
        } catch (error) {
            console.error("Total income calculation error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Handle request for last 4 bookings
    if (req.method === "GET" && req.query.lastBookings === "true") {
        try {
            const lastBookings = await db
                .collection(COLLECTION_NAME)
                .aggregate([
                    {
                        $lookup: {
                            from: LOCATIONS_COLLECTION,
                            localField: "pickUpLocation",
                            foreignField: "_id",
                            as: "pickupLocation"
                        }
                    },
                    {
                        $lookup: {
                            from: LOCATIONS_COLLECTION,
                            localField: "dropOffLocation",
                            foreignField: "_id",
                            as: "dropoffLocation"
                        }
                    },
                    {
                        $unwind: {
                            path: "$pickupLocation",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: "$dropoffLocation",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: { createdAt: -1 } // Sort by newest first
                    },
                    {
                        $limit: 4 // Get only the last 4 bookings
                    },
                    {
                        $project: {
                            _id: 1,
                            carId: 1,
                            userId: 1,
                            pickUpDate: 1,
                            dropOffDate: 1,
                            totalPrice: 1,
                            status: 1,
                            paymentStatus: 1,
                            createdAt: 1,
                            pickupLocation: 1,
                            dropoffLocation: 1
                        }
                    }
                ])
                .toArray();

            return res.status(200).json(lastBookings);
        } catch (error) {
            console.error("Last bookings fetch error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Regular GET handler for all bookings
    if (req.method === "GET") {
        try {
            const bookings = await db
                .collection(COLLECTION_NAME)
                .aggregate([
                    {
                        $lookup: {
                            from: LOCATIONS_COLLECTION,
                            localField: "pickUpLocation",
                            foreignField: "_id",
                            as: "pickupLocation"
                        }
                    },
                    {
                        $lookup: {
                            from: LOCATIONS_COLLECTION,
                            localField: "dropOffLocation",
                            foreignField: "_id",
                            as: "dropoffLocation"
                        }
                    },
                    {
                        $unwind: {
                            path: "$pickupLocation",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: "$dropoffLocation",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            carId: 1,
                            userId: 1,
                            pickUpDate: 1,
                            dropOffDate: 1,
                            totalPrice: 1,
                            status: 1,
                            paymentStatus: 1,
                            createdAt: 1,
                            pickupLocation: 1,
                            dropoffLocation: 1
                        }
                    }
                ])
                .toArray();

            return res.status(200).json(bookings);
        } catch (error) {
            console.error("Bookings fetch error:", error);
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

            // Convert dates to Date objects
            const pickUpDateObj = new Date(pickUpDate);
            const dropOffDateObj = new Date(dropOffDate);

            // Validate dates
            if (dropOffDateObj <= pickUpDateObj) {
                return res.status(400).json({
                    message: "Drop-off date must be after pick-up date"
                });
            }

            // Check car availability
            const isAvailable = await checkCarAvailability(
                db,
                new ObjectId(carId),
                pickUpDateObj,
                dropOffDateObj
            );

            if (!isAvailable) {
                return res.status(400).json({
                    message: "Car is not available for the selected dates"
                });
            }

            const newBooking = {
                carId: new ObjectId(carId),
                userId: new ObjectId(userId),
                pickUpLocation: new ObjectId(pickUpLocation),
                dropOffLocation: new ObjectId(dropOffLocation),
                pickUpDate: pickUpDateObj,
                dropOffDate: dropOffDateObj,
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
            console.error("Booking creation error:", error);
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
            console.error("Booking deletion error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
}