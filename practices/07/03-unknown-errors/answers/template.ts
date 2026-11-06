import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  HttpException,
  NotFoundException,
} from "./exceptions.js";
import { ReservationRepository } from "./reservation.repository.js";

export type ErrorResponse = {
  success: false;
  message: string;
  details?: Record<string, string[]>;
};

export function isBodyParseError(err: unknown): boolean {
  return err instanceof SyntaxError && "status" in err && err.status === 400;
}

export function isUniqueViolation(err: unknown): boolean {
  return err instanceof Error && "sqlState" in err && err.sqlState === "23505";
}

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

  if (isBodyParseError(err)) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ success: false, message: ERROR_MESSAGE.VALIDATION_FAILED });
    return;
  }

  if (isUniqueViolation(err)) {
    res
      .status(HTTP_STATUS.CONFLICT)
      .json({ success: false, message: ERROR_MESSAGE.RESERVATION_TIME_TAKEN });
    return;
  }

  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR });
}

export function createApp(): Express {
  const app = express();
  const reservationRepository = new ReservationRepository();

  app.use(express.json());

  app.get("/reservations/:id", async (req, res) => {
    const reservation = await reservationRepository.findById(
      Number(req.params.id),
    );
    if (!reservation) {
      throw new NotFoundException(ERROR_MESSAGE.RESERVATION_NOT_FOUND);
    }
    res.json(reservation);
  });

  app.post("/reservations", async (req, res) => {
    const reservation = await reservationRepository.create(
      req.body.time,
      req.body.trainerId,
    );
    res.status(201).json(reservation);
  });

  app.use(errorHandler);

  return app;
}
