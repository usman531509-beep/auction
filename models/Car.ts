import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const CarSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    carModel: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    mileage: { type: Number, default: 0 },
    color: { type: String, default: "" },
    transmission: { type: String, enum: ["automatic", "manual", ""], default: "" },
    fuel: { type: String, enum: ["petrol", "diesel", "hybrid", "electric", ""], default: "" },
    stock: { type: Number, default: 1, min: 0 },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["available", "sold", "hidden"], default: "available", index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

CarSchema.index({ title: "text", brand: "text", carModel: "text" });

export type CarDoc = InferSchemaType<typeof CarSchema> & { _id: string };

const Car: Model<CarDoc> = (models.Car as Model<CarDoc>) ?? model<CarDoc>("Car", CarSchema);
export default Car;
