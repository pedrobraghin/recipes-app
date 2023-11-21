import { Router } from "express";
import { usersApiRouter } from "./users.routes.js";
import { recipesApiRouter } from "./recipes.routes.js";
import { categoriesApiRouter } from "./categories.routes.js";

const apiRouter = Router();

apiRouter.use("/users", usersApiRouter);
apiRouter.use("/recipes", recipesApiRouter);
apiRouter.use("/categories", categoriesApiRouter);

export { apiRouter };
