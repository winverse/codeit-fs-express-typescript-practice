import { checkCase } from "../../../../_helpers/check-case.js";
import type { Equal, Expect } from "../../../../_helpers/type-test.js";
import { HttpException } from "./exceptions.js";
import {
  DELIVERY_STATUS_TRANSITIONS,
  DeliveryService,
  ParcelRepository,
} from "./template.js";
import type { DeliveryStatus } from "./template.js";

type cases = [
  Expect<
    Equal<
      DeliveryStatus,
      "ordered" | "packed" | "shipping" | "delivered" | "canceled"
    >
  >,
  Expect<
    Equal<
      typeof DELIVERY_STATUS_TRANSITIONS,
      Record<DeliveryStatus, readonly DeliveryStatus[]>
    >
  >,
];

const service = new DeliveryService(
  new ParcelRepository([
    { id: 1, item: "무선 이어폰", status: "ordered" },
    { id: 2, item: "요리책", status: "shipping" },
    { id: 3, item: "장우산", status: "delivered" },
  ]),
);

async function caught(run: () => Promise<unknown>): Promise<unknown> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof HttpException) {
      return {
        type: error.constructor.name,
        statusCode: error.statusCode,
        message: error.message,
      };
    }
    throw error;
  }
}

await checkCase(
  "1번 택배 ordered → packed",
  () => caught(() => service.changeStatus(1, "packed")),
  {
    id: 1,
    item: "무선 이어폰",
    status: "packed",
    allowedNextStatuses: ["shipping", "canceled"],
  },
);
await checkCase(
  "1번 택배 packed → shipping",
  () => caught(() => service.changeStatus(1, "shipping")),
  {
    id: 1,
    item: "무선 이어폰",
    status: "shipping",
    allowedNextStatuses: ["delivered"],
  },
);
await checkCase(
  "1번 택배 shipping → shipping",
  () => caught(() => service.changeStatus(1, "shipping")),
  {
    type: "ConflictException",
    statusCode: 409,
    message: "허용되지 않은 상태 변경입니다.",
  },
);
await checkCase(
  "2번 택배 shipping → packed",
  () => caught(() => service.changeStatus(2, "packed")),
  {
    type: "ConflictException",
    statusCode: 409,
    message: "허용되지 않은 상태 변경입니다.",
  },
);
await checkCase(
  "3번 택배 delivered → canceled",
  () => caught(() => service.changeStatus(3, "canceled")),
  {
    type: "ConflictException",
    statusCode: 409,
    message: "허용되지 않은 상태 변경입니다.",
  },
);
await checkCase(
  "99번 택배 → packed",
  () => caught(() => service.changeStatus(99, "packed")),
  {
    type: "NotFoundException",
    statusCode: 404,
    message: "택배를 찾을 수 없습니다.",
  },
);
