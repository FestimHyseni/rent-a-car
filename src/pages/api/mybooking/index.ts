import { getToken } from "next-auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import Booking from "@/models/Booking";
import "@/models/Car";
import "@/models/User";
import "@/models/Brand";
import "@/models/Model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    await dbConnect();
    const client = await clientPromise;
    const mongoDb = client.db("public");

    const bookings = await Booking.find({ userId: token.id })
      .populate({
        path: "carId",
        populate: [
          { path: "make_id", model: "Brand", select: "name" },
          { path: "makeModel", model: "Model", select: "name" },
          
        ],
      })
      .populate("userId", "name email city address")
      .lean();

    const locationIds = [
      ...new Set(
        bookings.flatMap((b) => [
          b.pickUpLocation?.toString(),
          b.dropOffLocation?.toString(),
        ])
      ),
    ].filter(Boolean);

    const locationsData = await mongoDb
      .collection("locations")
      .find({ _id: { $in: locationIds.map((id) => new ObjectId(id)) } })
      .toArray();

    const locationMap = Object.fromEntries(
      locationsData.map((loc) => [loc._id.toString(), loc])
    );

    const enrichedBookings = bookings.map((b) => ({
      ...b,
      pickUpLocation: locationMap[b.pickUpLocation?.toString()] || null,
      dropOffLocation: locationMap[b.dropOffLocation?.toString()] || null,
    }));

    return res.status(200).json(enrichedBookings);
  } catch (error: any) {
    console.error("❌ Error in /api/mybooking:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
