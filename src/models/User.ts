import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string; // Will be selected explicitly when needed
  image?: string;
  emailVerified?: Date | null;
  role: "user" | "admin"; // Define roles
  // You can add more fields specific to your car rental app
  // e.g., bookings, favorites, etc.
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      // sparse: true, // Use sparse if email is not always required (e.g. for OAuth providers that don't return email)
    },
    password: {
      type: String,
      select: false, // By default, do not return password
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// For NextAuth adapter, it expects 'email' to be unique.
// If you allow users to sign up with OAuth and then set a password (linking accounts),
// ensure your logic handles potential email conflicts.

// Check if the model already exists before defining it
const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
