import { readFile } from "node:fs/promises";
import { z } from "zod";

export const readingRoomItemSchema = z.object({
  roomNo: z.string(),
  roomName: z.string(),
  totalSeats: z.string(),
  usedSeats: z.string(),
  laptopYn: z.string(),
  closeTime: z.string(),
  notice: z.string(),
});

export const readingRoomResponseSchema = z.object({
  response: z.object({
    body: z.object({
      items: z.object({
        item: z.array(readingRoomItemSchema),
      }),
    }),
  }),
});

export type ReadingRoomItem = z.infer<typeof readingRoomItemSchema>;

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
    const text = await readFile(this.filePath, "utf8");
    const body: unknown = JSON.parse(text);

    const result = readingRoomResponseSchema.safeParse(body);
    if (!result.success) {
      throw new Error(z.prettifyError(result.error));
    }

    return result.data.response.body.items.item;
  }
}

export function toReadingRoom(item: ReadingRoomItem): ReadingRoom {
  const totalSeats = Number(item.totalSeats);

  return {
    roomNo: Number(item.roomNo),
    name: item.roomName,
    totalSeats,
    availableSeats: totalSeats - Number(item.usedSeats),
    laptopAllowed: item.laptopYn === "Y",
    closeTime: item.closeTime === "" ? null : item.closeTime,
    notice: item.notice === "" ? null : item.notice,
  };
}
