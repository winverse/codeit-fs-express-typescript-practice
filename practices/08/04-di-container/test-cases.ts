import "reflect-metadata";
import { container } from "tsyringe";
import { checkCase } from "../../../_helpers/check-case.js";
import {
  OrderService,
  setupContainer,
  setupMorningContainer,
  takeOrder,
} from "./template.js";

container.reset();
const appContainer = setupContainer();

await checkCase(
  'setupContainer() 뒤 takeOrder("아메리카노", 2)',
  () => takeOrder("아메리카노", 2),
  "아메리카노 x 2 / 합계 9000원",
);
await checkCase(
  "setupContainer() 뒤 OrderService를 두 번 꺼냈을 때 같은 객체인지",
  () =>
    appContainer.resolve(OrderService) === appContainer.resolve(OrderService),
  true,
);

container.reset();
setupMorningContainer();

await checkCase(
  'setupMorningContainer() 뒤 takeOrder("카페라테", 1)',
  () => takeOrder("카페라테", 1),
  "카페라테 x 1 / 합계 4000원",
);
await checkCase(
  'setupMorningContainer() 뒤 takeOrder("아메리카노", 3)',
  () => takeOrder("아메리카노", 3),
  "아메리카노 x 3 / 합계 10500원",
);
