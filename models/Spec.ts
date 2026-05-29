import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const SpecSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, default: "", trim: true, index: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SpecDoc = InferSchemaType<typeof SpecSchema> & { _id: string };

const Spec: Model<SpecDoc> =
  (models.Spec as Model<SpecDoc>) ?? model<SpecDoc>("Spec", SpecSchema);
export default Spec;
