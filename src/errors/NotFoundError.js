import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message) {
    super(StatusCodes.NOT_FOUND, message);
  }
}
