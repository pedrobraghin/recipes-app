import bcrypt from "bcrypt";

export class PasswordUtils {
  static async hashPass(password) {
    return await bcrypt.hash(password, 12);
  }

  static async comparePass(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}
