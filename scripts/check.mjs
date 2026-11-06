import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const practicePaths = JSON.parse(
  fs.readFileSync(path.join(root, "practice-paths.json"), "utf8"),
);
const tsc = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsc.cmd" : "tsc",
);
const outDir = path.join(root, ".check");
const compilerArgs = [
  "--ignoreConfig",
  "--strict",
  "--module",
  "nodenext",
  "--target",
  "es2023",
  "--skipLibCheck",
  "--experimentalDecorators",
  "--emitDecoratorMetadata",
  "--types",
  "node",
  "--noEmitOnError",
  "--rootDir",
  ".",
  "--outDir",
  ".check",
];

function run(testFile) {
  fs.rmSync(outDir, { recursive: true, force: true });
  const compiled = spawnSync(tsc, [...compilerArgs, testFile], {
    encoding: "utf8",
  });
  if (compiled.status !== 0) {
    return { stage: "type", ...compiled };
  }

  const compiledFile = path.join(outDir, testFile.replace(/\.ts$/, ".js"));
  const executed = spawnSync(process.execPath, [compiledFile], {
    encoding: "utf8",
    timeout: 20000,
  });
  return { stage: "run", ...executed };
}

function printOutput(result) {
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  if (result.error?.code === "ETIMEDOUT") {
    console.error("FAIL: 20초 안에 끝나지 않았습니다.");
  }
}

const rawArgs = process.argv.slice(2);
const args = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;
const mode = args[0];

if (mode === "--answers" || mode === "--starts") {
  const answers = mode === "--answers";
  let passed = 0;

  for (const practicePath of practicePaths) {
    const testFile = answers
      ? path.join(practicePath, "answers", "test-cases.ts")
      : path.join(practicePath, "test-cases.ts");
    const result = run(testFile);
    const success = answers
      ? result.status === 0
      : result.stage === "type" && result.status !== 0;

    if (!success) {
      console.error("FAIL: " + practicePath);
      printOutput(result);
      process.exitCode = 1;
      continue;
    }

    passed += 1;
  }

  console.log(
    (answers ? "answer" : "start") +
      " checks: " +
      passed +
      "/" +
      practicePaths.length,
  );
} else {
  if (!practicePaths.includes(mode)) {
    console.error("사용법: pnpm check -- <practice 경로>");
    process.exit(1);
  }

  const result = run(path.join(mode, "test-cases.ts"));
  printOutput(result);
  if (result.status === 0) {
    console.log("PASS: " + mode);
  }
  process.exit(result.status ?? 1);
}
