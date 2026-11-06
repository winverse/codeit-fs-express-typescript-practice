import type { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGE, HTTP_STATUS, HttpException } from "./exceptions.js";

export type ErrorResponse = {
  success: false;
  message: string;
  details?: Record<string, string[]>;
};

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) {
  if (err instanceof HttpException) {
    res
      .status(err.statusCode)
      .json({ success: false, message: err.message, details: err.details });
    return;
  }

  console.error(err);
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
}
