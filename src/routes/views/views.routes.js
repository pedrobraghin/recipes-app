import { getUserIfLoggedIn } from "../../middlewares/get-user.js";
import { categoriesViewsRouter } from "./categories.routes.js";
import { recipesController } from "../api/recipes.routes.js";
import { recipesViewsRoutes } from "./recipes.routes.js";
import { usersViewsRoutes } from "./users.routes.js";
import { StatusCodes } from "http-status-codes";
import { Router } from "express";

const viewsRouter = Router();

viewsRouter.use(usersViewsRoutes);
viewsRouter.use("/receitas", getUserIfLoggedIn, recipesViewsRoutes);
viewsRouter.use("/categorias", getUserIfLoggedIn, categoriesViewsRouter);

viewsRouter.get("/algo-deu-errado", getUserIfLoggedIn, (req, res) => {
  const user = req.app.locals.user;
  return res.status(StatusCodes.OK).render("error", { user });
});

viewsRouter.get("/pagina-nao-encontrada", (_req, res) => {
  return res.render("page-not-found");
});

viewsRouter.get(
  "/",
  getUserIfLoggedIn,
  recipesController.loadHomeRecipes.bind(recipesController)
);

viewsRouter.all("*", (_req, res) => {
  return res.render("page-not-found");
});

export { viewsRouter };
