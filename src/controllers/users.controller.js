import { userBuilder } from "../builders/user.builder.js";
import { CookieUtils } from "../utils/cookie-utils.js";
import { AppError } from "../errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  async register(req, res) {
    try {
      const token = await this.usersService.create(req.body);
      CookieUtils.setJwtCookie(res, token);

      return res.status(StatusCodes.CREATED).json({
        data: {
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await this.usersService.login(email, password);

      CookieUtils.setJwtCookie(res, token);

      return res.status(StatusCodes.CREATED).json({
        data: {
          token,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async logout(_req, res) {
    CookieUtils.removeSessionCookie(res);

    return res.status(StatusCodes.OK).json({
      status: "success",
    });
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.usersService.getById(id);
      const publicUser = userBuilder(user);

      return res.status(StatusCodes.OK).json({
        status: "success",
        data: publicUser,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async getMe(req, res) {
    try {
      const user = req.app.locals.user;
      const publicUser = userBuilder(user);

      return res.status(StatusCodes.OK).json({
        status: "success",
        data: publicUser,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async checkEmailAvailable(req, res) {
    try {
      const { email } = req.body;
      const available = await this.usersService.checkEmailAvailability(email);

      return res.status(StatusCodes.OK).json({
        status: "success",
        data: {
          available,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }

  async checkPhoneAvailable(req, res) {
    try {
      const { phone } = req.body;
      const available = await this.usersService.checkPhoneAvailability(phone);

      return res.status(StatusCodes.OK).json({
        status: "success",
        data: {
          available,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error. Please try again later.",
        timestamps: new Date().toISOString(),
      });
    }
  }
}
