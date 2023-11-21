import { CommentsRepository } from "../../repositories/comments.repository.js";
import { RecipesRepository } from "../../repositories/recipes.repository.js";
import { RecipesController } from "../../controllers/recipes.controller.js";
import { RecipesService } from "../../services/recipes.service.js";
import {
  categoriesRepository,
  categoriesService,
} from "./categories.routes.js";
import { upload } from "../../middlewares/upload.js";
import { auth } from "../../middlewares/auth.js";
import { Router } from "express";

export const recipesController = new RecipesController(
  new RecipesService(
    new RecipesRepository(),
    new CommentsRepository(),
    categoriesRepository
  ),
  categoriesService
);

const recipesApiRouter = Router();

recipesApiRouter.post(
  "/create",
  auth,
  upload.array("files"),
  recipesController.createRecipe.bind(recipesController)
);

recipesApiRouter.get(
  "/recent",
  recipesController.getRecentRecipes.bind(recipesController)
);

recipesApiRouter.get(
  "/terms/:term",
  recipesController.searchByTerm.bind(recipesController)
);

recipesApiRouter.post(
  "/review",
  auth,
  recipesController.reviewRecipe.bind(recipesController)
);

recipesApiRouter.get("/:id", recipesController.getById.bind(recipesController));

export { recipesApiRouter };
