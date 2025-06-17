// pages/api/my-bookings.ts
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "../../api/auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const client = await clientPromise;
        const db = client.db("carento");

        // Validate user ID format
        if (!ObjectId.isValid(session.user.id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const userId = new ObjectId(session.user.id);

        const bookings = await db
            .collection("bookings")
            .aggregate([
                { $match: { userId: userId } },
                {
                    $lookup: {
                        from: "cars",
                        localField: "carId",
                        foreignField: "_id",
                        as: "car",
                    },
                },
                { $unwind: { path: "$car", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "locations",
                        localField: "pickUpLocation",
                        foreignField: "_id",
                        as: "pickUpLocation",
                    },
                },
                { $unwind: { path: "$pickUpLocation", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "locations",
                        localField: "dropOffLocation",
                        foreignField: "_id",
                        as: "dropOffLocation",
                    },
                },
                { $unwind: { path: "$dropOffLocation", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        car: {
                            _id: 1,
                            make: 1,
                            makeModel: 1,
                            imageUrl: 1,
                        },
                        pickUpLocation: {
                            city: 1,
                            address: 1,
                        },
                        dropOffLocation: {
                            city: 1,
                            address: 1,
                        },
                        pickUpDate: 1,
                        dropOffDate: 1,
                        totalPrice: 1,
                        status: 1,
                        paymentStatus: 1,
                        createdAt: 1,
                    },
                },
            ])
            .toArray();

        return res.status(200).json(bookings);
    } catch (error: any) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || "Unknown error"
        });
    }
}