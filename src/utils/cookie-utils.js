export class CookieUtils {
  static setJwtCookie(res, token) {
    const expiresIn = Number(process.env.SESSION_COOKIE_EXPIRES_IN);
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const maxAge = Date.now() + expiresIn * ONE_DAY;

    const cookieOptions = {
      httpOnly: true,
      maxAge,
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res.cookie("jwt", token, cookieOptions);
  }

  static removeSessionCookie(res) {
    res.clearCookie("jwt");
  }
}
