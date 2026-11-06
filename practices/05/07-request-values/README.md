# 요청 값 검사하기

`codeit-fs-express-typescript-practice` 폴더에서 아래 명령을 실행하면 `practices/05/07-request-values/template.ts`와 `test-cases.ts`에서 타입 오류가 납니다.

```bash
pnpm check -- practices/05/07-request-values
```

`template.ts`를 열어 `TODO 1`부터 차례로 고치고 명령을 다시 실행합니다.

1. `TODO 1`: `express` 모듈의 `Request`에 `Partial<Record<ValidationTarget, unknown>>` 타입의 선택 프로퍼티 `validated`를 선언 병합으로 추가합니다.
2. `TODO 2`: `page`(1 이상 정수, 기본 1), `sort`(`"name"` 또는 `"price"`, 기본 `"name"`), `vegan`(`"Y"`면 `true`, `"N"`이면 `false`, 생략 가능)을 검사하는 스키마를 만듭니다.
3. `TODO 3`: `validate()`가 돌려주는 미들웨어에서 `schema`로 `req[target]`을 검사합니다. 실패하면 `ERROR_MESSAGE.VALIDATION_FAILED`와 `z.flattenError`의 `fieldErrors`로 `BadRequestException`을 던집니다. 통과하면 `req.validated`에 이미 있던 값에 `target` 자리의 결과를 더한 새 객체를 넣고 다음 미들웨어로 넘깁니다.
4. `TODO 4`: `getValidated()`에서 `req.validated`의 `target` 자리 값을 `T` 타입으로 꺼내 반환합니다.
5. `TODO 5`: `createApp()`에서 `GET /breads`에 `validate("query", breadListQuerySchema)`를 연결하고, 핸들러에서 `getValidated`로 꺼낸 `query` 값을 `listBreads`에 넘겨 결과를 JSON으로 응답합니다.

오류 없이 `PASS: practices/05/07-request-values`가 나오면 끝입니다. 정답은 `answers/template.ts`, 해설과 자주 하는 실수는 `answers/README.md`에 있습니다.
