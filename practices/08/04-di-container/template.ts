import { container, injectable } from "tsyringe";

const MENU_PRICES: Record<string, number> = {
  아메리카노: 4500,
  카페라테: 5000,
};

export class MenuBoard {
  priceOf(menu: string): number {
    return MENU_PRICES[menu];
  }
}

// TODO 1: MenuBoard를 상속해 priceOf가 MenuBoard의 가격보다 1000원 낮은 값을 반환하는 MorningMenuBoard를 만드세요.

export class ReceiptPrinter {
  print(lines: string[]): string {
    return lines.join(" / ");
  }
}

// TODO 2: 컨테이너가 생성자 의존성을 넣을 수 있게 OrderService에 데코레이터를 붙이고, MenuBoard와 ReceiptPrinter를 private readonly 생성자 매개변수 프로퍼티로 받으세요.
export class OrderService {
  // TODO 3: menu를 count개 주문한 영수증 글자를 반환하세요. 가격은 MenuBoard에서 얻고, 글자는 ReceiptPrinter에 [`${menu} x ${count}`, `합계 ${total}원`]을 넘겨 만듭니다.
  order(menu: string, count: number): string {}
}

// TODO 4: MenuBoard, ReceiptPrinter, OrderService를 컨테이너에 싱글톤으로 등록하고 container를 반환하세요.
export function setupContainer() {}

// TODO 5: setupContainer처럼 등록하고 container를 반환하되, MenuBoard를 요청하면 MorningMenuBoard가 만들어지게 등록하세요.
// registerSingleton의 두 번째 인자로 클래스를 넘기면 첫 번째 인자를 요청할 때 그 클래스의 객체가 만들어집니다.
export function setupMorningContainer() {}

// TODO 6: 컨테이너에서 OrderService를 꺼내 order를 호출한 결과를 반환하세요.
export function takeOrder(menu: string, count: number): string {}
