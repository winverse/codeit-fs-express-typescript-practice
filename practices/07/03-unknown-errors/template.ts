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

// TODO 1: err가 SyntaxError이면서 status 프로퍼티가 400일 때만 true를 반환하세요.
export function isBodyParseError(err: unknown): boolean {}

// TODO 2: err가 Error이면서 sqlState 프로퍼티가 "23505"일 때만 true를 반환하세요.
export function isUniqueViolation(err: unknown): boolean {}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) {
  // TODO 3: err를 HttpException, 본문 해석 오류, 중복 예약 순서로 좁혀 각각 err의 상태 코드, 400, 409로 응답하고, 나머지는 500으로 응답하세요.
  // HttpException이면 { success: false, message, details }를, 나머지는 { success: false, message }를 보내며 message는 ERROR_MESSAGE에서 고릅니다. 상태 코드는 HTTP_STATUS에 있습니다.
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
