import { UserModel } from "../schemas/user.schema.js";

export class UsersRepository {
  async createUser(userDto) {
    const user = await UserModel.create(userDto);
    return user;
  }

  async getUserById(id) {
    const user = await UserModel.findById(id);
    return user;
  }

  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async deleteUser(id) {
    const user = await UserModel.findByIdAndDelete(id);
    return user;
  }

  async getUserByPhone(phone) {
    const user = await UserModel.findOne({ phone });
    return user;
  }
}
