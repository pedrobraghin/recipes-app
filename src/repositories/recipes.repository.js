import { RecipeModel } from "../schemas/recipe.schema.js";

export class RecipesRepository {
  async createRecipe(recipeDto) {
    const recipe = await RecipeModel.create(recipeDto);
    return recipe;
  }

  async listRecentRecipes(limit) {
    const recipes = await RecipeModel.find()
      .limit(limit)
      .populate("categories")
      .populate("author", "name id")
      .sort({ createdAt: -1 });
    return recipes;
  }

  async getRecentRecipes(limit) {
    const recipes = await RecipeModel.find()
      .sort({ createdAt: "desc" })
      .populate("categories")
      .populate("author", "name")
      .limit(limit);
    return recipes;
  }

  async getRecipeById(id) {
    const recipe = await RecipeModel.findById(id)
      .populate("categories")
      .populate("author", "name id");
    return recipe;
  }

  async getRecipesByCategory(category, limit) {
    const [recipes, documentsCount] = await Promise.all([
      RecipeModel.find({
        categories: { $in: [category] },
      })
        .populate("categories")
        .populate("author", "name")
        .limit(limit)
        .sort({ createdAt: -1 }),
      RecipeModel.countDocuments(),
    ]);

    return { recipes, documentsCount };
  }

  async searchRecipesByTerm(term, limit) {
    const recipes = await RecipeModel.find({
      name: {
        $regex: new RegExp(term, "i"),
      },
    })
      .populate("author", "name id")
      .populate("categories")
      .limit(limit);
    return recipes;
  }
}
