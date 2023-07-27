import mongoose from 'mongoose';
import { User } from 'src/user/models/user.model';
import { Category } from './category.model';
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: String,
    content: String,
    user: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'User',
      userId: mongoose.Schema.Types.ObjectId,
      name: String,
      email: String,
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
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
  user: User;
  categories: [Category];
}
