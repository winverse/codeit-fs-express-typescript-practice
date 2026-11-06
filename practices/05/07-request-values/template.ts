import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z, type ZodType } from "zod";
import { listBreads } from "./breads.js";
import { errorHandler } from "./error-handler.middleware.js";
import { BadRequestException, ERROR_MESSAGE } from "./exceptions.js";

export type ValidationTarget = "body" | "params" | "query";

// TODO 1: express 모듈의 Request에 Partial<Record<ValidationTarget, unknown>> 타입의 선택 프로퍼티 validated를 선언 병합으로 추가하세요.

// TODO 2: page(1 이상 정수, 기본 1), sort("name" 또는 "price", 기본 "name"), vegan("Y"면 true, "N"이면 false, 생략 가능)을 검사하는 스키마를 만드세요.
export const breadListQuerySchema = z.object({});

export type BreadListQuery = z.infer<typeof breadListQuerySchema>;

export function validate(target: ValidationTarget, schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO 3: schema로 req[target]을 검사하세요. 실패하면 ERROR_MESSAGE.VALIDATION_FAILED와 z.flattenError의 fieldErrors로 BadRequestException을 던지세요.
    // 통과하면 req.validated에 이미 있던 값에 target 자리의 결과를 더한 새 객체를 넣고 다음 미들웨어로 넘기세요.
  };
}

// TODO 4: req.validated에서 target 자리의 값을 T 타입으로 꺼내 반환하세요.
export function getValidated<T>(req: Request, target: ValidationTarget): T {}

export function createApp(): Express {
  const app = express();

  // TODO 5: GET /breads에 validate("query", breadListQuerySchema)를 연결하고, 핸들러에서 getValidated로 꺼낸 query 값을 listBreads에 넘겨 결과를 JSON으로 응답하세요.

  app.use(errorHandler);

  return app;
}
