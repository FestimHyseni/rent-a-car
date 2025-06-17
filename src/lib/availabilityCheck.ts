import { Db, ObjectId } from "mongodb";

export async function checkCarAvailability(
    db: Db,
    carId: ObjectId,
    pickUpDate: Date,
    dropOffDate: Date
): Promise<boolean> {
    // 1. Check car status
    const car = await db.collection("cars").findOne({ _id: carId });
    if (!car || car.status !== "Available") {
        return false;
    }

    // 2. Check for overlapping bookings
    const overlappingBookings = await db.collection("bookings").countDocuments({
        carId: carId,
        $or: [
            {
                pickUpDate: { $lt: dropOffDate },
                dropOffDate: { $gt: pickUpDate }
            },
            {
                pickUpDate: { $gte: pickUpDate, $lt: dropOffDate }
            },
            {
                dropOffDate: { $gt: pickUpDate, $lte: dropOffDate }
            }
        ],
        status: { $in: ["Pending", "Confirmed"] }
    });

    return overlappingBookings === 0;
}