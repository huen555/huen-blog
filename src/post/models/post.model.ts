import mongoose from 'mongoose';
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: String,
    content: String,
  },
  {
    timestamps: true,
    collection: 'posts',
  },
);

export { PostSchema };
export interface Post extends mongoose.Document {
  title: string;
  description: string;
  content: string;
}
