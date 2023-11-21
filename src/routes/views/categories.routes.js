import { Router } from "express";
import { recipesController } from "../api/recipes.routes.js";

const categoriesViewsRouter = Router();

categoriesViewsRouter.get(
  "/:id",
  recipesController.loadRecipesByCategoryInView.bind(recipesController)
);

export { categoriesViewsRouter };
