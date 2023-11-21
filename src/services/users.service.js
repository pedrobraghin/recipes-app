import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { PasswordUtils } from "../utils/password-utils.js";
import { TokenUtils } from "../utils/token-utils.js";

export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async create(userDto) {
    const [phoneAlreadyExists, emailAlreadyExists] = await Promise.all([
      this.usersRepository.getUserByPhone(userDto.phone),
      this.usersRepository.getUserByEmail(userDto.email),
    ]);

    if (emailAlreadyExists) {
      throw new BadRequestError("Email already exists");
    }

    if (phoneAlreadyExists) {
      throw new BadRequestError("Phone already exists");
    }

    const passwordHash = await PasswordUtils.hashPass(userDto.password);

    const user = await this.usersRepository.createUser({
      ...userDto,
      password: passwordHash,
    });

    const token = TokenUtils.generateToken(user.id);

    return token;
  }

  async login(email, password) {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = await PasswordUtils.comparePass(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = TokenUtils.generateToken(user.id);
    return token;
  }

  async getById(id) {
    const user = await this.usersRepository.getUserById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async checkEmailAvailability(email) {
    const emailAlreadyExists = await this.usersRepository.getUserByEmail(email);
    return !emailAlreadyExists;
  }

  async checkPhoneAvailability(phone) {
    const phoneAlreadyExists = await this.usersRepository.getUserByPhone(phone);
    return !phoneAlreadyExists;
  }

  async delete(id) {
    await history.usersRepository.deleteUser(id);
  }
}
