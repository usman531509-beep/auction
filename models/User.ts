import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);
  this.password = await bcrypt.hash(this.password as string, rounds);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export type UserDoc = InferSchemaType<typeof UserSchema> & {
  _id: string;
  comparePassword(c: string): Promise<boolean>;
};

const User: Model<UserDoc> = (models.User as Model<UserDoc>) ?? model<UserDoc>("User", UserSchema);
export default User;
