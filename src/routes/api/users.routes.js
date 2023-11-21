import { UsersRepository } from "../../repositories/users.repository.js";
import { UsersController } from "../../controllers/users.controller.js";
import { UsersService } from "../../services/users.service.js";
import { auth } from "../../middlewares/auth.js";
import { Router } from "express";

const usersApiRouter = Router();
const usersController = new UsersController(
  new UsersService(new UsersRepository())
);

usersApiRouter.post(
  "/register",
  usersController.register.bind(usersController)
);

usersApiRouter.post("/login", usersController.login.bind(usersController));
usersApiRouter.get("/logout", usersController.logout.bind(usersController));

usersApiRouter.post(
  "/email/availability",
  usersController.checkEmailAvailable.bind(usersController)
);

usersApiRouter.post(
  "/phone/availability",
  usersController.checkPhoneAvailable.bind(usersController)
);

usersApiRouter.get("/me", auth, usersController.getMe.bind(usersController));

usersApiRouter.get("/:id", usersController.getById.bind(usersController));

export { usersApiRouter };
