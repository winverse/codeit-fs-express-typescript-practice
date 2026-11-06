# 외부 응답 값 검사하기 정답과 해설

`template.ts`의 `TODO` 자리를 다음처럼 채웁니다. 전체 정답은 `answers/template.ts`에 있습니다.

```ts
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
```

```ts
  async fetchRooms(): Promise<ReadingRoomItem[]> {
    const text = await readFile(this.filePath, "utf8");
    const body: unknown = JSON.parse(text);

    const result = readingRoomResponseSchema.safeParse(body);
    if (!result.success) {
      throw new Error(z.prettifyError(result.error));
    }

    return result.data.response.body.items.item;
  }
```

```ts
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
```

## 해설

- `TODO 1`·`TODO 2`: 응답 파일의 값은 숫자도 `"60"`처럼 글자로 들어 있으므로 항목 필드는 모두 `z.string()`으로 검사합니다. 응답 스키마는 파일의 중첩 구조를 따라 `response` → `body` → `items` → `item` 배열까지 내려갑니다. 스키마에 적지 않은 `libCode`·`updtDt`는 검사 결과에서 빠지므로 `fetchRooms()`가 돌려준 항목에는 7개 키만 남습니다.
- `TODO 3`: `z.infer<typeof readingRoomItemSchema>`는 스키마에서 타입을 만듭니다. 필드 7개를 타입으로 한 번 더 적지 않아도 되고, 스키마를 고치면 타입도 함께 바뀝니다.
- `TODO 4`: `JSON.parse`는 `any`를 돌려주므로 결과를 `unknown` 변수에 담아야 검사 전에 필드를 꺼내는 코드를 타입 검사가 막습니다. `safeParse` 결과는 `result.success`가 `true`인 분기에서만 `result.data`의 타입이 정해지고, 실패 분기에서는 `z.prettifyError`가 어느 경로의 값이 틀렸는지 적은 메시지를 만듭니다. `reading-rooms.changed.json`처럼 `roomName`이 없는 응답을 읽으면 메시지에 `→ at response.body.items.item[0].roomName`이 들어갑니다.
- `TODO 5`: 반환 타입 `ReadingRoom`을 적어 두었으므로 필드를 빠뜨리거나 `number` 자리에 글자를 넣으면 타입 검사가 막습니다. 빈 문자열은 "값 없음"이라는 뜻이라 `null`로 바꿔 다른 글자 값과 구분합니다.

## 자주 하는 실수

- `laptopAllowed: Boolean(item.laptopYn)`처럼 쓰면 `"N"`도 빈 문자열이 아니라서 `true`가 되어 다음 줄이 표시됩니다.

  ```text
  FAIL: toReadingRoom(제1열람실)
    기대: {"roomNo":1,"name":"제1열람실","totalSeats":60,"availableSeats":18,"laptopAllowed":false,"closeTime":"22:00","notice":null}
    실제: {"roomNo":1,"name":"제1열람실","totalSeats":60,"availableSeats":18,"laptopAllowed":true,"closeTime":"22:00","notice":null}
  ```

- 검사를 통과한 `result.data` 대신 `body.response.body.items.item`을 반환하면 `body`가 `unknown`이라 `error TS18046: 'body' is of type 'unknown'.`이 표시됩니다.
