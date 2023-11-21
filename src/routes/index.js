import { viewsRouter } from "./views/views.routes.js";
import { apiRouter } from "./api/api.routes.js";
import { Router } from "express";

const BASE_API_URL = process.env.BASE_API_URL;

const appRouter = Router();

appRouter.use(BASE_API_URL, apiRouter);
appRouter.use(viewsRouter);

export { appRouter };
