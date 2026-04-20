import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const BidSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    auctionId: { type: Schema.Types.ObjectId, ref: "Auction", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

BidSchema.index({ auctionId: 1, amount: -1 });

export type BidDoc = InferSchemaType<typeof BidSchema> & { _id: string };

const Bid: Model<BidDoc> = (models.Bid as Model<BidDoc>) ?? model<BidDoc>("Bid", BidSchema);
export default Bid;
