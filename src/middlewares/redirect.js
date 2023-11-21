import { UsersRepository } from "../repositories/users.repository.js";
import { UsersService } from "../services/users.service.js";
import { TokenUtils } from "../utils/token-utils.js";

export function redirectIfLoggedIn(to) {
  return function (req, res, next) {
    const user = req.app.locals.user;
    if (user) {
      return res.redirect(to);
    }
    return next();
  };
}

export function redirectIfNotLoggedIn(to) {
  return async function (req, res, next) {
    const redirectUrl = `${to}?r=${encodeURIComponent(req.originalUrl)}`;

    try {
      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies["jwt"];

      if (!token) {
        return res.redirect(redirectUrl);
      }

      const tokenPayload = TokenUtils.validateToken(token);

      if (!tokenPayload) {
        return res.redirect(redirectUrl);
      }

      const usersService = new UsersService(new UsersRepository());
      const user = await usersService.getById(tokenPayload.id);

      req.app.locals.user = user;

      return next();
    } catch (e) {
      return res.redirect(redirectUrl);
    }
  };
}
