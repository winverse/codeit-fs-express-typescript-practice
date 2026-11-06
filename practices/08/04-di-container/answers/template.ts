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

export class MorningMenuBoard extends MenuBoard {
  priceOf(menu: string): number {
    return super.priceOf(menu) - 1000;
  }
}

export class ReceiptPrinter {
  print(lines: string[]): string {
    return lines.join(" / ");
  }
}

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
