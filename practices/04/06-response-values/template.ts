import { readFile } from "node:fs/promises";
import { z } from "zod";

// TODO 1: roomNo, roomName, totalSeats, usedSeats, laptopYn, closeTime, notice를 모두 문자열로 검사하는 항목 스키마를 만드세요.
export const readingRoomItemSchema = z.object({});

// TODO 2: response.body.items.item이 항목 스키마의 배열인지 검사하는 응답 스키마를 만드세요.
export const readingRoomResponseSchema = z.object({});

// TODO 3: 항목 스키마에서 ReadingRoomItem 타입을 얻으세요.
export type ReadingRoomItem = unknown;

export interface ReadingRoom {
  roomNo: number;
  name: string;
  totalSeats: number;
  availableSeats: number;
  laptopAllowed: boolean;
  closeTime: string | null;
  notice: string | null;
}

export class ReadingRoomProvider {
  constructor(private readonly filePath: string) {}

  async fetchRooms(): Promise<ReadingRoomItem[]> {
    // TODO 4: filePath의 파일을 readFile로 읽어 JSON.parse 결과를 unknown 타입 변수에 담고, 응답 스키마로 검사하세요.
    // 실패하면 z.prettifyError로 만든 메시지로 Error를 던지고, 성공하면 item 배열을 반환하세요.
  }
}

// TODO 5: 숫자 글자는 number로, laptopYn은 "Y"일 때만 true로, 빈 문자열인 closeTime·notice는 null로 바꿔 ReadingRoom을 반환하세요.
// availableSeats는 totalSeats에서 usedSeats를 뺀 값입니다.
export function toReadingRoom(item: ReadingRoomItem): ReadingRoom {}
