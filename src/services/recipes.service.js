import { NotFoundError } from "../errors/NotFoundError.js";
import { RecipesUtils } from "../utils/recipes-utils.js";

export class RecipesService {
  constructor(recipesRepository, commentsRepository, categoriesRepository) {
    this.recipesRepository = recipesRepository;
    this.commentsRepository = commentsRepository;
    this.categoriesRepository = categoriesRepository;
  }

  async createRecipe(recipeDto) {
    const recipe = await this.recipesRepository.createRecipe(recipeDto);
    return recipe;
  }

  async getRecentRecipesGroupedByCategory() {
    const categories = await this.categoriesRepository.list();
    const recipes = [];

    for (const category of categories) {
      const result = await this.recipesRepository.getRecipesByCategory(
        category.id,
        3
      );

      const { recipes: recipesByCategory } = result;

      recipes.push(recipesByCategory);
    }

    const recipesByCategory = RecipesUtils.groupRecipesByCategory(
      recipes.flat()
    );

    return recipesByCategory;
  }

  async getMostRecentRecipes() {
    return await this.recipesRepository.listRecentRecipes();
  }

  async getRecipeById(id) {
    const recipe = this.recipesRepository.getRecipeById(id);

    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    return recipe;
  }

  async getRecipesByCategory(category, limit) {
    const recipes = await this.recipesRepository.getRecipesByCategory(
      category,
      limit
    );
    return recipes;
  }

  async getRecipeRatings(id) {
    return await this.commentsRepository.getRecipeRatings(id);
  }

  async addReview(text, rating, recipeId, userId) {
    const recipe = this.recipesRepository.getRecipeById(recipeId);

    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    const review = await this.commentsRepository.addComment(
      text,
      rating,
      recipeId,
      userId
    );

    return review;
  }

  async searchRecipesByTerm(term) {
    const recipes = await this.recipesRepository.searchRecipesByTerm(term, 20);
    return recipes;
  }
}
