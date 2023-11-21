import { CommentModel } from "../schemas/comment.schema.js";
import { RecipeModel } from "../schemas/recipe.schema.js";

export class CommentsRepository {
  async addComment(text, rating, recipeId, userId) {
    const comment = await CommentModel.create({
      rating,
      recipeId,
      text,
      user: userId,
    });

    return comment;
  }

  async getRecipeComments(recipeId) {
    const comments = await CommentModel.find({
      recipeId,
    }).populate("user");

    return comments;
  }

  async getRecipeRatings(recipeId) {
    const comments = await CommentModel.find({
      recipeId,
    }).populate("user", "name id");

    return comments;
  }
}
