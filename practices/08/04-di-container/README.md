# 클래스 연결 바꿔 끼우기

`codeit-fs-express-typescript-practice` 폴더에서 아래 명령을 실행하면 `practices/08/04-di-container/template.ts`와 `test-cases.ts`에서 타입 오류가 납니다.

```bash
pnpm check -- practices/08/04-di-container
```

`template.ts`를 열어 `TODO 1`부터 차례로 고치고 명령을 다시 실행합니다. `test-cases.ts`의 오류는 `TODO 4`를 마치면 사라지므로 `test-cases.ts`는 고치지 않습니다.

1. `TODO 1`: `MenuBoard`를 상속해 `priceOf()`가 `MenuBoard`의 가격보다 1000원 낮은 값을 반환하는 `MorningMenuBoard`를 만듭니다.
2. `TODO 2`: 컨테이너가 생성자 의존성을 넣을 수 있게 `OrderService`에 데코레이터를 붙이고, `MenuBoard`와 `ReceiptPrinter`를 `private readonly` 생성자 매개변수 프로퍼티로 받게 합니다.
3. `TODO 3`: `order()`가 `menu`를 `count`개 주문한 영수증 글자를 반환하게 합니다. 가격은 `MenuBoard`에서 얻고, 글자는 `ReceiptPrinter`에 ``[`${menu} x ${count}`, `합계 ${total}원`]``을 넘겨 만듭니다.
4. `TODO 4`: `setupContainer()`에서 `MenuBoard`, `ReceiptPrinter`, `OrderService`를 컨테이너에 싱글톤으로 등록하고 `container`를 반환합니다.
5. `TODO 5`: `setupMorningContainer()`에서 `setupContainer()`처럼 등록하고 `container`를 반환하되, `MenuBoard`를 요청하면 `MorningMenuBoard`가 만들어지게 등록합니다. `registerSingleton`의 두 번째 인자로 클래스를 넘기면 첫 번째 인자를 요청할 때 그 클래스의 객체가 만들어집니다.
6. `TODO 6`: `takeOrder()`에서 컨테이너로 `OrderService`를 꺼내 `order()`를 호출한 결과를 반환합니다.

오류 없이 `PASS: practices/08/04-di-container`가 나오면 끝입니다. 정답은 `answers/template.ts`, 해설과 자주 하는 실수는 `answers/README.md`에 있습니다.
