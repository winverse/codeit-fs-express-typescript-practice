# 상태 전이 규칙 만들기 정답과 해설

`template.ts`의 `TODO` 자리를 다음처럼 채웁니다. 전체 정답은 `answers/template.ts`에 있습니다.

```ts
export const DELIVERY_STATUSES = [
  "ordered",
  "packed",
  "shipping",
  "delivered",
  "canceled",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const DELIVERY_STATUS_TRANSITIONS: Record<
  DeliveryStatus,
  readonly DeliveryStatus[]
> = {
  ordered: ["packed", "canceled"],
  packed: ["shipping", "canceled"],
  shipping: ["delivered"],
  delivered: [],
  canceled: [],
};

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(HTTP_STATUS.CONFLICT, message);
  }
}
```

```ts
export function toParcelResponse(parcel: Parcel): ParcelResponse {
  return {
    id: parcel.id,
    item: parcel.item,
    status: parcel.status,
    allowedNextStatuses: [...DELIVERY_STATUS_TRANSITIONS[parcel.status]],
  };
}

export class DeliveryService {
  constructor(private readonly parcelRepository: ParcelRepository) {}

  async changeStatus(
    id: number,
    nextStatus: DeliveryStatus,
  ): Promise<ParcelResponse> {
    const parcel = await this.parcelRepository.findById(id);
    if (!parcel) {
      throw new NotFoundException(ERROR_MESSAGE.PARCEL_NOT_FOUND);
    }

    const allowedNextStatuses = DELIVERY_STATUS_TRANSITIONS[parcel.status];
    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new ConflictException(ERROR_MESSAGE.STATUS_CHANGE_NOT_ALLOWED);
    }

    const updatedParcel = await this.parcelRepository.updateStatus(
      parcel,
      nextStatus,
    );
    return toParcelResponse(updatedParcel);
  }
}
```

## 해설

- `TODO 1`: `as const`가 없으면 배열 타입이 `string[]`이라 `(typeof DELIVERY_STATUSES)[number]`도 `string`이 됩니다. `as const`를 붙이면 배열이 읽기 전용 튜플이 되고 요소 타입이 각 글자 그대로 남아 `DeliveryStatus`가 다섯 상태의 Union이 됩니다.
- `TODO 2`: `Record<DeliveryStatus, …>`는 Union의 모든 상태를 키로 요구하므로 한 상태의 행을 빠뜨리면 타입 검사가 막습니다. 값 쪽 `readonly DeliveryStatus[]`는 다른 코드가 표의 목록에 `push` 같은 변경을 하면 타입 검사가 막게 합니다.
- `TODO 3`: `ConflictException`은 상태 코드만 `HTTP_STATUS.CONFLICT`(409)로 정해 `HttpException`에 넘깁니다. 요청 형식은 맞지만 현재 상태와 맞지 않는 변경이라 400이 아니라 409입니다.
- `TODO 4`: 응답의 `allowedNextStatuses`는 `DeliveryStatus[]`라서 읽기 전용 배열을 그대로 넣을 수 없습니다. `[...]`로 복사한 새 배열을 넣습니다.
- `TODO 5`: 생성자 매개변수 앞에 `private readonly`를 붙이면 같은 이름의 프로퍼티가 만들어지고 값이 들어갑니다.
- `TODO 6`: 없는 택배를 먼저 거른 뒤 표에서 현재 상태의 목록을 꺼내 다음 상태가 들어 있는지 봅니다. 같은 상태로 바꾸는 요청도 목록에 없으므로 409입니다.

## 자주 하는 실수

- `allowedNextStatuses: DELIVERY_STATUS_TRANSITIONS[parcel.status]`처럼 복사하지 않으면 다음 오류가 표시됩니다.

  ```text
  error TS4104: The type 'readonly ("canceled" | "delivered" | "ordered" | "packed" | "shipping")[]' is 'readonly' and cannot be assigned to the mutable type '("canceled" | "delivered" | "ordered" | "packed" | "shipping")[]'.
  ```

- 표에서 `canceled` 행을 빠뜨리면 다음 오류가 표시됩니다.

  ```text
  error TS2741: Property 'canceled' is missing in type '{ ordered: ("canceled" | "packed")[]; packed: ("canceled" | "shipping")[]; shipping: "delivered"[]; delivered: never[]; }' but required in type 'Record<"canceled" | "delivered" | "ordered" | "packed" | "shipping", readonly ("canceled" | "delivered" | "ordered" | "packed" | "shipping")[]>'.
  ```
