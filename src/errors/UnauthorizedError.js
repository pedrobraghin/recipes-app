import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
  constructor(message) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}
