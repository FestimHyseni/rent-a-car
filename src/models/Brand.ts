import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
}

const BrandSchema = new Schema<IBrand>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Model = models.Model || model<IBrand>("Model", BrandSchema);
export default Model;
