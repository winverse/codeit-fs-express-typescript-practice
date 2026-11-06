# 상태 전이 규칙 만들기

`codeit-fs-express-typescript-practice` 폴더에서 아래 명령을 실행하면 `practices/06/04-status-transitions/template.ts`와 `test-cases.ts`에서 타입 오류가 납니다.

```bash
pnpm check -- practices/06/04-status-transitions
```

`template.ts`를 열어 `TODO 1`부터 차례로 고치고 명령을 다시 실행합니다.

1. `TODO 1`: `DELIVERY_STATUSES` 배열을 `as const`로 고정하고, `typeof`로 얻은 배열 타입에 `[number]`로 접근해 `DeliveryStatus` 타입을 만듭니다.
2. `TODO 2`: 상태마다 바꿀 수 있는 다음 상태를 `Record<DeliveryStatus, readonly DeliveryStatus[]>` 타입의 표로 만듭니다. `ordered` → `packed`·`canceled`, `packed` → `shipping`·`canceled`, `shipping` → `delivered`이고 `delivered`·`canceled`에서는 바꿀 수 없습니다.
3. `TODO 3`: `HttpException`을 상속해 상태 코드 `HTTP_STATUS.CONFLICT`(409)를 갖는 `ConflictException`을 만듭니다.
4. `TODO 4`: `toParcelResponse()`에서 `parcel`을 `ParcelResponse`로 바꿉니다. `allowedNextStatuses`에는 표에서 현재 상태의 다음 상태 목록을 담습니다.
5. `TODO 5`: `DeliveryService`가 `ParcelRepository`를 `private readonly` 생성자 매개변수 프로퍼티로 받게 합니다.
6. `TODO 6`: `changeStatus()`에서 id로 택배를 찾아 없으면 `NotFoundException`을, 표가 허용하지 않는 다음 상태면 `ConflictException`을 던집니다. 허용되면 상태를 바꾼 택배를 `ParcelResponse`로 바꿔 반환합니다. 오류 메시지는 `ERROR_MESSAGE`에서 고릅니다.

오류 없이 `PASS: practices/06/04-status-transitions`가 나오면 끝입니다. 정답은 `answers/template.ts`, 해설과 자주 하는 실수는 `answers/README.md`에 있습니다.
