import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    logo: { type: String, default: "" },
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type BrandDoc = InferSchemaType<typeof BrandSchema> & { _id: string };

const Brand: Model<BrandDoc> =
  (models.Brand as Model<BrandDoc>) ?? model<BrandDoc>("Brand", BrandSchema);
export default Brand;
