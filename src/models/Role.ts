import { Schema, model, models, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
}

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    enum: ["admin", "user", "staff"],
    required: true,
    unique: true,
  },
});

const Role = models.Role || model<IRole>("Role", RoleSchema);
export default Role;
