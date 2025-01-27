import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
  proficePicture?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullname: { type: String, require },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long."],
    },
    proficePicture: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
