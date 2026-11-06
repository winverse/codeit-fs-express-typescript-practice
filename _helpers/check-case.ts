import { isDeepStrictEqual } from "node:util";

function show(value: unknown): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}

export async function checkCase(
  label: string,
  run: () => unknown,
  expected: unknown,
): Promise<void> {
  let actual: unknown;
  try {
    actual = await run();
  } catch (error) {
    actual =
      "오류: " + (error instanceof Error ? error.message : String(error));
  }

  if (isDeepStrictEqual(actual, expected)) {
    return;
  }

  process.exitCode = 1;
  console.error("FAIL: " + label);
  console.error("  기대: " + show(expected));
  console.error("  실제: " + show(actual));
}
