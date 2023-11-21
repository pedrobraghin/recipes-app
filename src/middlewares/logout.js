import { CookieUtils } from "../utils/cookie-utils.js";

export function logout(_req, res, next) {
  CookieUtils.removeSessionCookie(res);
  return next();
}
