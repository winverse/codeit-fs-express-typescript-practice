import type { AddressInfo } from "node:net";
import { checkCase } from "../../../_helpers/check-case.js";
import type { Equal, Expect } from "../../../_helpers/type-test.js";
import { createApp } from "./template.js";
import type { BreadListQuery } from "./template.js";

type cases = [
  Expect<
    Equal<
      BreadListQuery,
      { page: number; sort: "name" | "price"; vegan?: boolean | undefined }
    >
  >,
];

const server = createApp().listen(0);
await new Promise((resolve) => server.once("listening", resolve));
const { port } = server.address() as AddressInfo;

async function request(query: string): Promise<unknown> {
  const response = await fetch(`http://localhost:${port}/breads${query}`, {
    signal: AbortSignal.timeout(2000),
  });
  const body: unknown = await response.json();
  return { status: response.status, body };
}

async function names(query: string): Promise<unknown> {
  const result = (await request(query)) as { status: number; body: unknown };
  if (!Array.isArray(result.body)) {
    return result;
  }
  return {
    status: result.status,
    names: result.body.map((bread: { name: string }) => bread.name),
  };
}

await checkCase("GET /breads", () => names(""), {
  status: 200,
  names: ["단팥빵", "베이글", "소금빵"],
});
await checkCase(
  "GET /breads?page=2&sort=price",
  () => names("?page=2&sort=price"),
  {
    status: 200,
    names: ["크루아상", "치아바타", "통밀 바게트"],
  },
);
await checkCase("GET /breads?vegan=Y", () => names("?vegan=Y"), {
  status: 200,
  names: ["베이글", "치아바타", "통밀 바게트"],
});
await checkCase("GET /breads?vegan=N", () => names("?vegan=N"), {
  status: 200,
  names: ["단팥빵", "소금빵", "크루아상"],
});
await checkCase("GET /breads?page=0", () => request("?page=0"), {
  status: 400,
  body: {
    success: false,
    message: "입력값 검증에 실패했습니다.",
    details: { page: ["Too small: expected number to be >=1"] },
  },
});
await checkCase("GET /breads?page=abc", () => request("?page=abc"), {
  status: 400,
  body: {
    success: false,
    message: "입력값 검증에 실패했습니다.",
    details: { page: ["Invalid input: expected number, received NaN"] },
  },
});
await checkCase("GET /breads?sort=popular", () => request("?sort=popular"), {
  status: 400,
  body: {
    success: false,
    message: "입력값 검증에 실패했습니다.",
    details: { sort: ['Invalid option: expected one of "name"|"price"'] },
  },
});
await checkCase(
  "GET /breads?vegan=Y&vegan=N",
  () => request("?vegan=Y&vegan=N"),
  {
    status: 400,
    body: {
      success: false,
      message: "입력값 검증에 실패했습니다.",
      details: { vegan: ['Invalid option: expected one of "Y"|"N"'] },
    },
  },
);

server.closeAllConnections();
server.close();
