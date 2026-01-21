import mongoose, { Schema, models, model } from "mongoose";

// Define the Post schema (shape of documents in MongoDB)
const PostSchema = new Schema(
  {
    // Post author name
    author: { type: String, required: true, trim: true },

    // Post title
    title: { type: String, required: true, trim: true },

    // Post content (the body text)
    content: { type: String, required: true },

    // Likes count
    likes: { type: Number, required: true, default: 0 },
  },
  {
    // Automatically create createdAt/updatedAt
    timestamps: true,
  }
);

// Reuse existing model in dev (prevents model overwrite errors)
const Post = models.Post || model("Post", PostSchema);

export default Post;
