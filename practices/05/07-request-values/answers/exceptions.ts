export const ERROR_MESSAGE = {
  VALIDATION_FAILED: "입력값 검증에 실패했습니다.",
  INTERNAL_SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
} as const;

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
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

export class BadRequestException extends HttpException {
  constructor(message: string, details?: Record<string, string[]>) {
    super(HTTP_STATUS.BAD_REQUEST, message, details);
  }
}
