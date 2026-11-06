export const ERROR_MESSAGE = {
  VALIDATION_FAILED: "입력값 검증에 실패했습니다.",
  RESERVATION_NOT_FOUND: "예약을 찾을 수 없습니다.",
  RESERVATION_TIME_TAKEN: "이미 예약된 시간입니다.",
  INTERNAL_SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
} as const;

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(HTTP_STATUS.NOT_FOUND, message);
  }
}
