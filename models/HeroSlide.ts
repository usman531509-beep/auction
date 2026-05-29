import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const HeroSlideSchema = new Schema(
  {
    image: { type: String, required: true },
    caption: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type HeroSlideDoc = InferSchemaType<typeof HeroSlideSchema> & { _id: string };

const HeroSlide: Model<HeroSlideDoc> =
  (models.HeroSlide as Model<HeroSlideDoc>) ?? model<HeroSlideDoc>("HeroSlide", HeroSlideSchema);
export default HeroSlide;
