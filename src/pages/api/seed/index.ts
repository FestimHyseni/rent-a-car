// pages/api/seed.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb"; 
import Role from "@/models/Role";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect;

  const roles = ["admin", "user", "staff"];

  try {
    for (const name of roles) {
      const exists = await Role.findOne({ name });
      if (!exists) {
        await Role.create({ name });
        console.log(`✅ Shtuar roli: ${name}`);
      }
    }
    res.status(200).json({ message: "Rolet u seed-uan me sukses" });
  } catch (error) {
    console.error("❌ Gjatë seed:", error);
    res.status(500).json({ message: "Seed dështoi", error });
  }
}
