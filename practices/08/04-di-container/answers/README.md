# 클래스 연결 바꿔 끼우기 정답과 해설

`template.ts`의 `TODO` 자리를 다음처럼 채웁니다. 전체 정답은 `answers/template.ts`에 있습니다.

```ts
export class MorningMenuBoard extends MenuBoard {
  priceOf(menu: string): number {
    return super.priceOf(menu) - 1000;
  }
}
```

```ts
@injectable()
export class OrderService {
  constructor(
    private readonly menuBoard: MenuBoard,
    private readonly printer: ReceiptPrinter,
  ) {}

  order(menu: string, count: number): string {
    const total = this.menuBoard.priceOf(menu) * count;
    return this.printer.print([`${menu} x ${count}`, `합계 ${total}원`]);
  }
}

export function setupContainer() {
  container.registerSingleton(MenuBoard);
  container.registerSingleton(ReceiptPrinter);
  container.registerSingleton(OrderService);
  return container;
}

export function setupMorningContainer() {
  container.registerSingleton(MenuBoard, MorningMenuBoard);
  container.registerSingleton(ReceiptPrinter);
  container.registerSingleton(OrderService);
  return container;
}

export function takeOrder(menu: string, count: number): string {
  const orderService = container.resolve(OrderService);
  return orderService.order(menu, count);
}
```

## 해설

- `TODO 1`: `MorningMenuBoard`는 `MenuBoard`를 상속하므로 `MenuBoard`가 필요한 자리에 그대로 들어갈 수 있습니다. `super.priceOf(menu)`로 원래 가격을 얻어 1000원을 뺍니다.
- `TODO 2`: `OrderService`는 생성자로 `MenuBoard`와 `ReceiptPrinter`를 받습니다. `@injectable()`을 붙여야 빌드한 JavaScript에 생성자 매개변수 타입이 남고, 컨테이너가 그 타입을 보고 두 객체를 만들어 넣습니다. 생성자 의존성이 없는 `MenuBoard`·`ReceiptPrinter`에는 데코레이터가 필요 없습니다.
- `TODO 3`: `order()`는 받은 두 객체만 부릅니다. 어떤 가격표가 들어왔는지는 모르고, 바뀐 가격표가 들어오면 같은 코드로 다른 금액을 냅니다.
- `TODO 4`: `registerSingleton(클래스)`로 등록하면 컨테이너가 객체를 한 번만 만들고 다시 꺼낼 때 같은 객체를 줍니다. 등록을 마친 `container`를 반환하면 부르는 쪽이 `setupContainer().resolve(…)`처럼 바로 꺼낼 수 있습니다.
- `TODO 5`: `registerSingleton(MenuBoard, MorningMenuBoard)`는 `MenuBoard`를 요청하는 자리에 `MorningMenuBoard`를 만들어 넣으라는 등록입니다. `OrderService`의 코드는 그대로인데 `takeOrder("카페라테", 1)`의 결과가 `카페라테 x 1 / 합계 5000원`에서 `카페라테 x 1 / 합계 4000원`으로 바뀝니다.
- `TODO 6`: `container.resolve(OrderService)`가 `OrderService`와 그 생성자 의존성을 함께 만들어 줍니다. `new`로 객체를 이어 붙이는 코드는 어디에도 없습니다.

## 자주 하는 실수

- `OrderService`에 `@injectable()`을 붙이지 않으면 타입 검사는 통과하지만 실행 중에 컨테이너가 생성자 매개변수를 알 수 없어 다음 줄이 표시됩니다.

  ```text
  FAIL: setupContainer() 뒤 takeOrder("아메리카노", 2)
    기대: "아메리카노 x 2 / 합계 9000원"
    실제: "오류: TypeInfo not known for \"OrderService\""
  ```

- `setupMorningContainer()`에서 `container.registerSingleton(MorningMenuBoard)`처럼 새 클래스만 등록하면 `OrderService`가 요청하는 `MenuBoard` 자리는 그대로라 금액이 바뀌지 않습니다.

  ```text
  FAIL: setupMorningContainer() 뒤 takeOrder("카페라테", 1)
    기대: "카페라테 x 1 / 합계 4000원"
    실제: "카페라테 x 1 / 합계 5000원"
  ```
