import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const AuctionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    carModel: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    startingPrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["active", "ended", "cancelled"],
      default: "active",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    winner: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

AuctionSchema.index({ status: 1, endTime: 1 });
AuctionSchema.index({ title: "text", brand: "text", carModel: "text" });

export type AuctionDoc = InferSchemaType<typeof AuctionSchema> & { _id: string };

const Auction: Model<AuctionDoc> =
  (models.Auction as Model<AuctionDoc>) ?? model<AuctionDoc>("Auction", AuctionSchema);
export default Auction;
