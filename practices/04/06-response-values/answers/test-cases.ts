import path from "node:path";
import { checkCase } from "../../../../_helpers/check-case.js";
import type { Equal, Expect } from "../../../../_helpers/type-test.js";
import { ReadingRoomProvider, toReadingRoom } from "./template.js";
import type { ReadingRoomItem } from "./template.js";

type cases = [
  Expect<
    Equal<
      ReadingRoomItem,
      {
        roomNo: string;
        roomName: string;
        totalSeats: string;
        usedSeats: string;
        laptopYn: string;
        closeTime: string;
        notice: string;
      }
    >
  >,
];

const unitDir = path.join(process.cwd(), "practices/04/06-response-values");
const provider = new ReadingRoomProvider(
  path.join(unitDir, "reading-rooms.json"),
);
let items: ReadingRoomItem[] = [];

await checkCase(
  "fetchRooms()가 돌려준 항목 수",
  async () => {
    items = await provider.fetchRooms();
    return items.length;
  },
  3,
);
await checkCase(
  "fetchRooms()가 돌려준 첫 항목의 키",
  () => Object.keys(items[0] ?? {}).sort(),
  [
    "closeTime",
    "laptopYn",
    "notice",
    "roomName",
    "roomNo",
    "totalSeats",
    "usedSeats",
  ],
);
await checkCase("toReadingRoom(제1열람실)", () => toReadingRoom(items[0]), {
  roomNo: 1,
  name: "제1열람실",
  totalSeats: 60,
  availableSeats: 18,
  laptopAllowed: false,
  closeTime: "22:00",
  notice: null,
});
await checkCase("toReadingRoom(노트북열람실)", () => toReadingRoom(items[1]), {
  roomNo: 2,
  name: "노트북열람실",
  totalSeats: 30,
  availableSeats: 0,
  laptopAllowed: true,
  closeTime: "18:00",
  notice: "정기 소독으로 18시에 닫습니다.",
});
await checkCase("toReadingRoom(어린이열람실)", () => toReadingRoom(items[2]), {
  roomNo: 3,
  name: "어린이열람실",
  totalSeats: 24,
  availableSeats: 19,
  laptopAllowed: false,
  closeTime: null,
  notice: null,
});
await checkCase(
  "roomName이 roomNm으로 바뀐 응답을 읽을 때 던지는 오류",
  async () => {
    const changed = new ReadingRoomProvider(
      path.join(unitDir, "reading-rooms.changed.json"),
    );
    try {
      await changed.fetchRooms();
      return "오류 없음";
    } catch (error) {
      return error instanceof Error &&
        error.message.includes("→ at response.body.items.item[0].roomName")
        ? "roomName 위치가 담긴 오류"
        : "다른 오류";
    }
  },
  "roomName 위치가 담긴 오류",
);
