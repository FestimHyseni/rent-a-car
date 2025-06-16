import mongoose, { Schema, Document, models, Model } from "mongoose";
interface Location {
  _id: string;
  city: string;
  address: string;
  type: string[];
}
// Interface defining the structure of a Car document
export interface ICar extends Document {
  make_id: mongoose.Schema.Types.ObjectId;
  makeModel: mongoose.Schema.Types.ObjectId;
  category: string;
  year: number;
  price: number;
  licensePlate: string;
  imageUrl?: string;
  status: "Available" | "Rented" | "Maintenance";
  features?: string[]; // <-- This is correctly defined
  rating?: number;
  totalBookings?: number;
  dropOffLocation: Location;
  pickUpLocation: Location;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for the Car model
const CarSchema: Schema<ICar> = new Schema(
  {
    make_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    makeModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true, // Each car's license plate must be unique
      trim: true,
      uppercase: true,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Available", "Rented", "Maintenance"],
      default: "Available", // New cars are available by default
    },
    // --- This is the correct implementation for features ---
    features: {
      type: [String], // Defines an array of strings
      default: [], // Ensures the field defaults to an empty array if not provided
    },
    // ----------------------------------------------------
    rating: {
      type: Number,
      default: 5.0, // Default rating for a new car
      min: 0,
      max: 5,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    dropOffLocation: {
      type: [String],
      default: [],
    },
    pickUpLocation: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// To improve query performance, create an index on fields that will be frequently searched.
CarSchema.index({ make: 1, makeModel: 1 });
CarSchema.index({ status: 1 });

// Check if the model already exists before defining it to prevent recompilation errors in Next.js
const Car: Model<ICar> = models.Car || mongoose.model<ICar>("Car", CarSchema);

export default Car;
