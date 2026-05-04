import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const OrderItemSchema = new Schema(
  {
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    title: { type: String, required: true },
    brand: { type: String, default: "" },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    contact: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    notes: { type: String, default: "" },
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export type OrderDoc = InferSchemaType<typeof OrderSchema> & { _id: string };

const Order: Model<OrderDoc> =
  (models.Order as Model<OrderDoc>) ?? model<OrderDoc>("Order", OrderSchema);
export default Order;
