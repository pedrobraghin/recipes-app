import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.js";

export class BadRequestError extends AppError {
  constructor(message) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}
