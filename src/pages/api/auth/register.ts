// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/dbConnect"; // Your Mongoose connection utility
import User, { IUser } from "../../../models/User"; // Your Mongoose User model

type Data = {
  success: boolean;
  message: string;
  user?: Partial<IUser>; // Return partial user info on success
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Missing required fields: name, email, or password.",
      });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
  }

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          message: "User with this email already exists.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // 12 salt rounds

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
    });

    await newUser.save();

    // Do not return the password, even hashed
    const userToReturn = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully!",
        user: userToReturn,
      });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
}
