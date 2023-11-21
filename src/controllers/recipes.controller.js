import { RecipesUtils } from "../utils/recipes-utils.js";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export class RecipesController {
  constructor(recipesService, categoriesService) {
    this.recipesService = recipesService;
    this.categoriesService = categoriesService;
  }

  async reviewRecipe(req, res) {
    try {
      const userId = req.app.locals.user.id;
      const { recipeId, rating, text } = req.body;

      const review = await this.recipesService.addReview(
        text,
        rating,
        recipeId,
        userId
      );

      return res.status(StatusCodes.CREATED).json({
        status: "success",
        data: review,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async loadRecipeInView(req, res) {
    try {
      const user = req.app.locals.user;
      const { id } = req.params;
      const recipe = await this.recipesService.getRecipeById(id);

      const relatedRecipes = await this.recipesService.getRecipesByCategory(
        recipe.categories[0].id
      );
      const { recipes } = relatedRecipes;
      const filteredRelatedRecipes = recipes.filter((r) => r.id !== id);

      const reviews = await this.recipesService.getRecipeRatings(id);
      const userReview = reviews.find((review) => review.user.id === user?.id);

      return res.render("view-recipe", {
        recipe,
        relatedRecipes: filteredRelatedRecipes,
        user,
        reviews,
        userReview,
      });
    } catch (e) {
      return res.redirect("/pagina-nao-encontrada");
    }
  }

  async createRecipe(req, res) {
    try {
      const user = req.app.locals.user;

      const recipeDto = {
        ...req.body,
        categories: JSON.parse(req.body.categories),
        ingredients: JSON.parse(req.body.ingredients),
        author: user.id.toString(),
        images: req.files.map((file) => {
          const path = "/imgs/recipes/" + file.filename;
          return {
            filename: file.filename,
            url: path,
          };
        }),
      };

      const recipe = await this.recipesService.createRecipe(recipeDto);

      return res.status(StatusCodes.CREATED).json({
        status: "success",
        data: recipe,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async loadHomeRecipes(req, res) {
    try {
      const user = req.app.locals.user;
      const recipesByCategory =
        await this.recipesService.getRecentRecipesGroupedByCategory();

      const relatedRecipes = await this.recipesService.getMostRecentRecipes();

      return res.render("home", { recipesByCategory, user, relatedRecipes });
    } catch (error) {
      return res.redirect("/algo-deu-errado");
    }
  }

  async loadRecipesByCategoryInView(req, res) {
    try {
      const { id } = req.params;
      const user = req.app.locals.user;
      const category = await this.categoriesService.getCategoryById(id);
      const { recipes } = await this.recipesService.getRecipesByCategory(id);

      const ratings = {};

      for (const recipe of recipes) {
        const recipeRatings = await this.recipesService.getRecipeRatings(
          recipe.id
        );

        const average =
          RecipesUtils.calculateAverageRecipeRatings(recipeRatings);

        ratings[recipe.id] = {
          average,
          count: recipeRatings.length,
        };
      }

      return res.render("recipes-by-category", {
        recipes,
        ratings,
        user,
        category,
        relatedRecipes: [],
      });
    } catch (error) {
      return res.redirect("/pagina-nao-encontrada");
    }
  }

  async getRecentRecipes(req, res) {
    try {
      const recipes = await this.recipesService.getRecentRecipes(
        req.query.limit
      );

      return res.status(StatusCodes.OK).json({
        status: "success",
        results: recipes.length,
        data: recipes,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async getByCategory(req, res) {
    try {
      const category = req.query.category;
      const recipes = await this.recipesService.getRecipesByCategory(category);

      return res.status(StatusCodes.OK).json({
        status: "success",
        results: recipes.length,
        data: recipes,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const recipe = await this.recipesService.getRecipeById(id);

      return res.status(StatusCodes.OK).json({
        status: "success",
        data: recipe,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async searchByTerm(req, res) {
    try {
      const { term } = req.params;
      const recipes = await this.recipesService.searchRecipesByTerm(term);

      return res.status(StatusCodes.OK).json({
        status: "success",
        results: recipes.length,
        data: recipes,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }
}
