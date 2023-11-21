import { redirectIfNotLoggedIn } from "../../middlewares/redirect.js";
import { recipesController } from "../api/recipes.routes.js";
import { StatusCodes } from "http-status-codes";
import { Router } from "express";

const recipesViewsRoutes = Router();

recipesViewsRoutes.get(
  "/criar",
  redirectIfNotLoggedIn("/entrar"),
  (req, res) => {
    const user = req.app.locals.user;
    return res.status(StatusCodes.OK).render("new-recipe", { user });
  }
);

recipesViewsRoutes.get(
  "/:id",
  recipesController.loadRecipeInView.bind(recipesController)
);

export { recipesViewsRoutes };
