import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IModel extends Document {
  brand_id: mongoose.Schema.Types.ObjectId;
  name: string;
}

const ModelSchema = new Schema<IModel>({
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Model = models.Model || model<IModel>("Model", ModelSchema);
export default Model;
