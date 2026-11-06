# Express에 TypeScript 적용하기 연습문제

`Express에 TypeScript 적용하기` 강의의 연습문제 5개를 담은 저장소입니다. 문제마다 `template.ts`에 `TODO`로 비워 둔 자리가 있고, 그 자리를 강의에서 배운 대로 채워 타입 검사와 실행 검사를 함께 통과시키는 것이 목표입니다. 문제끼리는 서로 이어지지 않으므로 교재가 안내하는 순서대로 하나씩 독립적으로 풉니다.

| 폴더                                 | 완성할 내용                                                         |
| ------------------------------------ | ------------------------------------------------------------------- |
| `practices/04/06-response-values`    | 도서관 열람실 응답 파일을 읽어 zod로 검사하고 쓸 값으로 바꾸기      |
| `practices/05/07-request-values`     | 빵 목록 query 문자열을 스키마로 바꾸는 검증 미들웨어                |
| `practices/06/04-status-transitions` | 택배 배송 상태 전이 표와 409 예외                                   |
| `practices/07/03-unknown-errors`     | 예약 API에서 `unknown` 오류를 좁혀 응답을 정하는 에러 핸들러        |
| `practices/08/04-di-container`       | 카페 주문 클래스를 tsyringe 컨테이너로 잇고 구현 하나를 바꿔 끼우기 |

## 처음 한 번 준비하기

이 README가 있는 `codeit-fs-express-typescript-practice` 폴더(저장소 루트)에서 의존성을 설치하고 시작 상태를 확인합니다. 이 README의 모든 명령은 이 폴더에서 실행합니다.

```bash
pnpm install
pnpm check:starts
```

마지막 줄에 `start checks: 5/5`가 표시되면 5개 문제가 모두 풀이 전 상태로 준비된 것입니다. 풀이 전 문제는 `TODO` 자리가 비어 있어 타입 검사에 실패하고, 이 명령은 5개 문제가 모두 그렇게 실패하는지 확인합니다.

## 문제 폴더 구성

문제 폴더마다 다음 파일이 있습니다.

- `README.md`: 확인 명령과 `TODO` 번호별로 할 일
- `template.ts`: 직접 고치는 파일입니다. 고칠 자리에는 `// TODO 1:`처럼 번호가 붙은 주석이 있습니다.
- `test-cases.ts`: `template.ts`의 타입과 실행 결과가 기대와 같은지 검사하는 파일입니다. 고치지 않습니다.
- `answers/`: 정답 `template.ts`와 해설 `README.md`가 있습니다. 문제를 푼 뒤에만 엽니다.

문제 폴더의 나머지 파일(응답 JSON 파일, `breads.ts`, `exceptions.ts`, `error-handler.middleware.ts`, `reservation.repository.ts`)은 문제에 필요한 데이터와 제공 코드이므로 고치지 않습니다. 문제 폴더 밖의 `scripts/`, `_helpers/`, `practice-paths.json`, `package.json`, `tsconfig.json`도 확인 명령을 위해 제공한 파일이므로 고치지 않습니다.

## 문제 풀기

1. 교재가 안내하는 문제 폴더의 `README.md`를 읽습니다.
2. `template.ts`에서 `TODO` 번호 순서대로 코드를 채웁니다.
3. 저장소 루트에서 확인 명령을 실행합니다. 예를 들어 첫 문제는 다음 명령으로 확인합니다.

   ```bash
   pnpm check -- practices/04/06-response-values
   ```

   확인 명령은 먼저 타입을 검사하고, 통과하면 검사용 JavaScript를 `.check/` 폴더에 만들어 실행합니다. 타입이 맞지 않으면 `practices/04/06-response-values/template.ts(26,23): error TS2355: …`처럼 파일·줄·칸이 붙은 진단이, 실행 결과가 기대와 다르면 `FAIL:` 줄과 `기대:`·`실제:` 값이 표시되고, 두 경우 모두 마지막 줄에 `[ELIFECYCLE] Command failed with exit code 1.`이 표시됩니다. 모두 맞으면 `PASS: practices/04/06-response-values`가 표시됩니다.

4. 통과한 뒤 `answers/template.ts`, `answers/README.md`와 비교합니다.
