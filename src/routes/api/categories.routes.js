import { CategoriesController } from "../../controllers/categories.controller.js";
import { CategoriesRepository } from "../../repositories/categories.repository.js";
import { CategoriesService } from "../../services/categories.service.js";
import { Router } from "express";

export const categoriesRepository = new CategoriesRepository();

export const categoriesService = new CategoriesService(categoriesRepository);

export const categoriesController = new CategoriesController(categoriesService);

const categoriesApiRouter = Router();

categoriesApiRouter.post(
  "/",
  categoriesController.createCategory.bind(categoriesController)
);

categoriesApiRouter.get(
  "/",
  categoriesController.listCategories.bind(categoriesController)
);

categoriesApiRouter.patch(
  "/:id",
  categoriesController.updateCategory.bind(categoriesController)
);

categoriesApiRouter.delete(
  "/:id",
  categoriesController.deleteCategory.bind(categoriesController)
);

export { categoriesApiRouter };
