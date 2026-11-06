import type { AddressInfo } from "node:net";
import { checkCase } from "../../../_helpers/check-case.js";
import { createApp, isBodyParseError, isUniqueViolation } from "./template.js";

await checkCase(
  "isBodyParseError(status 프로퍼티가 없는 SyntaxError)",
  () => isBodyParseError(new SyntaxError("Unexpected end of JSON input")),
  false,
);
await checkCase(
  "isBodyParseError({ status: 400 })",
  () => isBodyParseError({ status: 400 }),
  false,
);
await checkCase(
  'isUniqueViolation(sqlState가 "23503"인 Error)',
  () =>
    isUniqueViolation(Object.assign(new Error("fk"), { sqlState: "23503" })),
  false,
);
await checkCase(
  'isUniqueViolation({ sqlState: "23505" })',
  () => isUniqueViolation({ sqlState: "23505" }),
  false,
);

const server = createApp().listen(0);
await new Promise((resolve) => server.once("listening", resolve));
const { port } = server.address() as AddressInfo;

async function request(
  method: string,
  url: string,
  body?: string,
): Promise<unknown> {
  const response = await fetch(`http://localhost:${port}${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(2000),
  });
  return { status: response.status, body: await response.json() };
}

await checkCase(
  'POST /reservations {"time":"20:00","trainerId":1}',
  () => request("POST", "/reservations", '{"time":"20:00","trainerId":1}'),
  { status: 201, body: { id: 2, time: "20:00", trainerId: 1 } },
);
await checkCase(
  "GET /reservations/99",
  () => request("GET", "/reservations/99"),
  {
    status: 404,
    body: { success: false, message: "예약을 찾을 수 없습니다." },
  },
);
await checkCase(
  'POST /reservations {"time":',
  () => request("POST", "/reservations", '{"time":'),
  {
    status: 400,
    body: { success: false, message: "입력값 검증에 실패했습니다." },
  },
);
await checkCase(
  'POST /reservations {"time":"19:00","trainerId":1}',
  () => request("POST", "/reservations", '{"time":"19:00","trainerId":1}'),
  { status: 409, body: { success: false, message: "이미 예약된 시간입니다." } },
);
await checkCase(
  'POST /reservations {"time":"21:00","trainerId":9}',
  () => request("POST", "/reservations", '{"time":"21:00","trainerId":9}'),
  {
    status: 500,
    body: { success: false, message: "서버 내부 오류가 발생했습니다." },
  },
);

server.closeAllConnections();
server.close();
