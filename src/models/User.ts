import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
  proficePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullname: { type: String, require },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    proficePicture: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
