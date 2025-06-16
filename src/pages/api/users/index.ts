import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

function generateRandomPassword(length = 10) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

const DB_NAME = "public";
const COLLECTION_NAME = "users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = await db.collection(COLLECTION_NAME).find().toArray();
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          const role = await db.collection("roles").findOne({ _id: user.role });
          return {
            ...user,
            role: role ? role.name : null,
          };
        })
      );

      return res.status(200).json(usersWithRoles);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);

      const plainPassword = generateRandomPassword(); // 🔐 generate password
      const hashedPassword = await bcrypt.hash(plainPassword, 10); // 🔒 encrypt

      const newUser = {
        ...req.body,
        password: hashedPassword,
        createdAt: new Date(),
        emailVerified: null,
        image: "",
        country: req.body.country || "",
        city: req.body.city || "",
        number: req.body.number || "",
        address: req.body.address || "",
      };
      console.log(req.body.role);

      const role_id = await db
        .collection("roles")
        .findOne({ name: req.body.role || "user" });

      const result = await db
        .collection(COLLECTION_NAME)
        .insertOne({ ...newUser, role: role_id?._id });

      // ✅ Send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Admin" <${process.env.EMAIL_USER}>`,
        to: req.body.email,
        subject: "Fjalëkalimi i llogarisë suaj",
        text: `Pershendetje ${req.body.name},\n\nLlogaria juaj u krijua me sukses.\nFjalëkalimi juaj i përkohshëm është: ${plainPassword}\n\nJu lutem ndërroni fjalëkalimin pas hyrjes së parë.`,
      });

      return res.status(201).json({
        message: "User created and email sent",
        id: result.insertedId,
      });
    } catch (error) {
      console.error("Create error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
if (req.method === "PUT") {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { id, role, ...body } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const roleDoc = await db.collection("roles").findOne({ name: role || "user" });

    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updateData = {
      ...body,
      role: roleDoc._id, 
    };

    const result = await db
      .collection(COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("❌ Update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const { id } = req.body;

      if (!id) return res.status(400).json({ message: "User ID is required" });

      const result = await db
        .collection(COLLECTION_NAME)
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0)
        return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
