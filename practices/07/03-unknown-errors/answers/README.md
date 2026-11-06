# unknown 오류 좁히기 정답과 해설

`template.ts`의 `TODO` 자리를 다음처럼 채웁니다. 전체 정답은 `answers/template.ts`에 있습니다.

```ts
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
```

## 해설

- `TODO 1`: `express.json()`이 깨진 JSON 본문을 만나면 `status`가 `400`인 `SyntaxError`를 다음으로 넘깁니다. `unknown`에는 바로 `in`을 쓸 수 없으므로 `instanceof SyntaxError`로 먼저 객체임을 좁히고, `"status" in err`로 프로퍼티가 있는지 확인한 뒤에야 `err.status`를 비교할 수 있습니다.
- `TODO 2`: 저장소는 같은 트레이너의 같은 시간 예약을 `sqlState`가 `"23505"`인 `Error`로, 없는 트레이너를 `"23503"`인 `Error`로 던집니다. 프로퍼티가 있는지만 보지 않고 값까지 비교해야 `"23503"`이 중복 예약으로 바뀌지 않습니다.
- `TODO 3`: 세 가지 오류는 모두 `Error`를 상속하므로 좁은 종류부터 검사합니다. 앞에서 `err instanceof Error` 같은 넓은 분기를 먼저 두면 뒤 분기에 닿지 않습니다. `HttpException`은 `details`가 있으면 함께 보내고, 어느 분기에도 맞지 않는 오류는 원인을 응답에 드러내지 않고 500으로 보냅니다.

## 자주 하는 실수

- `instanceof SyntaxError` 없이 `"status" in err`부터 쓰면 `error TS18046: 'err' is of type 'unknown'.`이 표시됩니다.
- `HttpException` 분기보다 앞에 `err instanceof Error`면 500으로 응답하는 분기를 두면 404·400·409 요청이 모두 500이 되어 다음 줄이 표시됩니다.

  ```text
  FAIL: GET /reservations/99
    기대: {"status":404,"body":{"success":false,"message":"예약을 찾을 수 없습니다."}}
    실제: {"status":500,"body":{"success":false,"message":"서버 내부 오류가 발생했습니다."}}
  ```
