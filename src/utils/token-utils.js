import jwt from "jsonwebtoken";

export class TokenUtils {
  static generateToken(userId) {
    const TOKEN_SECRET = process.env.TOKEN_SECRET;
    const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;

    const token = jwt.sign({ id: userId }, TOKEN_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
      issuer: "www.receitasdecasa.com",
    });

    return token;
  }

  static validateToken(token) {
    try {
      const TOKEN_SECRET = process.env.TOKEN_SECRET;
      const payload = jwt.verify(token, TOKEN_SECRET);
      return payload;
    } catch (e) {
      return null;
    }
  }
}
