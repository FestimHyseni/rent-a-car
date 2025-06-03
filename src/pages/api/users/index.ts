// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = "rent";
const COLLECTION_NAME = "users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = await db.collection(COLLECTION_NAME).find().toArray();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const newUser = {
        ...req.body,
        createdAt: new Date(),
        emailVerified: null,
        image: '',
        role: 'user',
      };
      const result = await db.collection(COLLECTION_NAME).insertOne(newUser);
      return res.status(201).json({ message: 'User created', id: result.insertedId });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const { id } = req.body;

      if (!id) return res.status(400).json({ message: 'User ID is required' });

      const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0)
        return res.status(404).json({ message: 'User not found' });

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}


