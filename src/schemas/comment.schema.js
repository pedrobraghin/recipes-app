import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    recipeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Recipe",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const CommentModel = model("Comment", commentSchema);
