# unknown 오류 좁히기

`codeit-fs-express-typescript-practice` 폴더에서 아래 명령을 실행하면 `practices/07/03-unknown-errors/template.ts`에서 타입 오류가 납니다.

```bash
pnpm check -- practices/07/03-unknown-errors
```

`template.ts`를 열어 `TODO 1`부터 차례로 고치고 명령을 다시 실행합니다. 실패 줄의 `실제:` 값이 `"오류: The operation was aborted due to timeout"`이면 그 요청이 들어간 분기에서 응답을 보내지 않은 것입니다.

1. `TODO 1`: `err`가 `SyntaxError`이면서 `status` 프로퍼티가 `400`일 때만 `isBodyParseError()`가 `true`를 반환하게 합니다.
2. `TODO 2`: `err`가 `Error`이면서 `sqlState` 프로퍼티가 `"23505"`일 때만 `isUniqueViolation()`이 `true`를 반환하게 합니다.
3. `TODO 3`: `errorHandler`에서 `err`를 `HttpException`, 본문 해석 오류, 중복 예약 순서로 좁혀 각각 `err`의 상태 코드, 400, 409로 응답하고, 나머지는 500으로 응답합니다. `HttpException`이면 `{ success: false, message, details }`를, 나머지는 `{ success: false, message }`를 보냅니다. `message`는 `ERROR_MESSAGE`에서, 상태 코드는 `HTTP_STATUS`에서 고릅니다.

오류 없이 `PASS: practices/07/03-unknown-errors`가 나오면 끝입니다. 정답은 `answers/template.ts`, 해설과 자주 하는 실수는 `answers/README.md`에 있습니다.
