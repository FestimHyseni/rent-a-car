// models/Booking.ts
import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const bookingSchema = new Schema(
    {
        carId: {
            type: Types.ObjectId,
            ref: "Car",
            required: true,
        },
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        pickUpLocation: {
            type: Types.ObjectId,
            ref: "Location",
            required: true,
        },
        dropOffLocation: {
            type: Types.ObjectId,
            ref: "Location",
            required: true,
        },
        pickUpDate: {
            type: Date,
            required: true,
        },
        dropOffDate: {
            type: Date,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
            default: "Pending",
        },
        paymentStatus: {
            type: String,
            enum: ["Unpaid", "Paid", "Refunded"],
            default: "Unpaid",
        },
    },
    {
        timestamps: true,
    }
);

// Add index for faster availability checks
bookingSchema.index({ carId: 1, pickUpDate: 1, dropOffDate: 1 });

const Booking = model("Booking", bookingSchema);

export default Booking;