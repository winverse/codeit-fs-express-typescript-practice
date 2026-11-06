export const ERROR_MESSAGE = {
  PARCEL_NOT_FOUND: "택배를 찾을 수 없습니다.",
  STATUS_CHANGE_NOT_ALLOWED: "허용되지 않은 상태 변경입니다.",
} as const;

export const HTTP_STATUS = {
  NOT_FOUND: 404,
  CONFLICT: 409,
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
