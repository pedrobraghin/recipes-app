import { UsersRepository } from "../repositories/users.repository.js";
import { UsersService } from "../services/users.service.js";
import { TokenUtils } from "../utils/token-utils.js";

export async function getUserIfLoggedIn(req, _res, next) {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies["jwt"];

    if (!token) {
      req.app.locals.user = undefined;
      return next();
    }

    const tokenPayload = TokenUtils.validateToken(token);

    if (!tokenPayload) {
      req.app.locals.user = undefined;
      return next();
    }

    const usersService = new UsersService(new UsersRepository());
    const user = await usersService.getById(tokenPayload.id);

    req.app.locals.user = user;

    return next();
  } catch (e) {
    req.app.locals.user = undefined;
    return next();
  }
}
