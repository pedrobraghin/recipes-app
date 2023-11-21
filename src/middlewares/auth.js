import { UsersRepository } from "../repositories/users.repository.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { UsersService } from "../services/users.service.js";
import { TokenUtils } from "../utils/token-utils.js";

export async function auth(req, _res, next) {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies["jwt"];

    if (!token) {
      return next(new UnauthorizedError("Token is missing"));
    }

    const tokenPayload = TokenUtils.validateToken(token);

    if (!tokenPayload) {
      return next(new UnauthorizedError("Invalid or expired token"));
    }

    const usersService = new UsersService(new UsersRepository());
    const user = await usersService.getById(tokenPayload.id);

    req.app.locals.user = user;

    return next();
  } catch (e) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
}
