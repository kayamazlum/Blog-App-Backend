import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  author: mongoose.Schema.Types.ObjectId;
  summary: string;
  description: string;
  images: string[];
  tags: string[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: { type: String, required: true },
    description: { type: String, required: true }, // HTML
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    categories: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>("Post", PostSchema);
