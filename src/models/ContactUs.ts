import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IContactUs extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const ContactUsSchema = new Schema<IContactUs>({
    name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
    unique: true,
  },
});

const Model = models.Model || model<IContactUs>("Model", ContactUsSchema);
export default Model;
