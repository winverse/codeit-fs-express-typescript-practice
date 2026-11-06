# 외부 응답 값 검사하기

`codeit-fs-express-typescript-practice` 폴더에서 아래 명령을 실행하면 `practices/04/06-response-values/template.ts`와 `test-cases.ts`에서 타입 오류가 납니다.

```bash
pnpm check -- practices/04/06-response-values
```

`template.ts`를 열어 `TODO 1`부터 차례로 고치고 명령을 다시 실행합니다.

1. `TODO 1`: `roomNo`, `roomName`, `totalSeats`, `usedSeats`, `laptopYn`, `closeTime`, `notice`를 모두 문자열로 검사하는 항목 스키마를 만듭니다.
2. `TODO 2`: `response.body.items.item`이 항목 스키마의 배열인지 검사하는 응답 스키마를 만듭니다.
3. `TODO 3`: 항목 스키마에서 `ReadingRoomItem` 타입을 얻습니다.
4. `TODO 4`: `fetchRooms()`에서 파일을 `readFile`로 읽어 `JSON.parse` 결과를 `unknown` 타입 변수에 담고 응답 스키마로 검사합니다. 실패하면 `z.prettifyError`로 만든 메시지로 `Error`를 던지고, 성공하면 `item` 배열을 반환합니다.
5. `TODO 5`: `toReadingRoom()`에서 숫자 글자는 `number`로, `laptopYn`은 `"Y"`일 때만 `true`로, 빈 문자열인 `closeTime`·`notice`는 `null`로 바꿔 `ReadingRoom`을 반환합니다. `availableSeats`는 `totalSeats`에서 `usedSeats`를 뺀 값입니다.

오류 없이 `PASS: practices/04/06-response-values`가 나오면 끝입니다. 정답은 `answers/template.ts`, 해설과 자주 하는 실수는 `answers/README.md`에 있습니다.
