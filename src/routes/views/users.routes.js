import { logout } from "../../middlewares/logout.js";
import { redirectIfLoggedIn } from "../../middlewares/redirect.js";
import { Router } from "express";

const usersViewsRoutes = Router();

usersViewsRoutes.get("/entrar", redirectIfLoggedIn("/"), (_req, res) => {
  return res.status(200).render("login");
});

usersViewsRoutes.get("/cadastre-se", redirectIfLoggedIn("/"), (_req, res) => {
  return res.status(200).render("register");
});

usersViewsRoutes.get("/sair", logout, (_req, res) => {
  return res.status(200).redirect("/");
});

export { usersViewsRoutes };
