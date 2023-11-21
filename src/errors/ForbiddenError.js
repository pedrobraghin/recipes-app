import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError {
  constructor(message) {
    super(StatusCodes.FORBIDDEN, message);
  }
}
