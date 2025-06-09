import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  emailVerified?: Date | null;
  role: mongoose.Schema.Types.ObjectId;
  country?: string;
  city?: string;
  number?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false },
    image: { type: String },
    emailVerified: { type: Date, default: null },
    role: {
      type: mongoose.Schema.Types.ObjectId, // <-- Change type to ObjectId
      ref: "Role", // <-- Add reference to the 'Role' model
      required: true,
    },
    country: { type: String },
    city: { type: String },
    number: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
