# 요청 값 검사하기 정답과 해설

`template.ts`의 `TODO` 자리를 다음처럼 채웁니다. 전체 정답은 `answers/template.ts`에 있습니다.

```ts
declare module "express" {
  interface Request {
    validated?: Partial<Record<ValidationTarget, unknown>>;
  }
}

export const breadListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  sort: z.enum(["name", "price"]).default("name"),
  vegan: z
    .enum(["Y", "N"])
    .transform((value) => value === "Y")
    .optional(),
});
```

```ts
export function validate(target: ValidationTarget, schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      throw new BadRequestException(
        ERROR_MESSAGE.VALIDATION_FAILED,
        z.flattenError(result.error).fieldErrors,
      );
    }

    req.validated = { ...req.validated, [target]: result.data };
    next();
  };
}

export function getValidated<T>(req: Request, target: ValidationTarget): T {
  return req.validated?.[target] as T;
}
```

```ts
app.get("/breads", validate("query", breadListQuerySchema), (req, res) => {
  const query = getValidated<BreadListQuery>(req, "query");
  res.json(listBreads(query));
});
```

## 해설

- `TODO 1`: `req.query`는 실행 중에 다른 값으로 바꿔 넣을 수 없으므로 검사한 값을 둘 자리를 따로 만듭니다. `declare module "express"` 안의 `interface Request`는 Express의 `Request`에 프로퍼티를 더하는 선언 병합이고, `"query"`·`"params"`·`"body"` 자리마다 검사한 값을 담도록 `Partial<Record<ValidationTarget, unknown>>`로 둡니다. 미들웨어의 `req`에 `Request`를 적어 두어야 이 프로퍼티가 보입니다.
- `TODO 2`: query 값은 늘 글자로 도착합니다. `z.coerce.number()`는 `"2"`를 `2`로 바꾼 뒤 `.int().min(1)`로 검사하고, 값이 없으면 `.default(1)`이 채웁니다. `"Y"`/`"N"`은 `z.enum`으로 두 글자만 받은 뒤 `.transform`으로 `boolean`을 만들고, `.optional()`이라 `vegan`이 없으면 `undefined`로 남아 모든 빵을 보여 줍니다. 같은 키를 두 번 보낸 `?vegan=Y&vegan=N`은 배열로 도착하므로 `z.enum`이 400으로 막습니다.
- `TODO 3`: `target`으로 받은 영역 하나만 검사하고, 실패하면 `BadRequestException`을 던져 `errorHandler`가 400 본문 `{ success: false, message, details }`를 보내게 합니다. 통과했을 때만 `{ ...req.validated, [target]: result.data }`로 이미 있던 값에 `target` 자리의 결과를 더한 새 객체를 `req.validated`에 넣고 `next()`로 넘기므로 핸들러에는 검사를 통과한 요청만 도착합니다.
- `TODO 4`: `getValidated<T>()`는 값을 바꾸지 않고 타입만 정해 꺼냅니다. 꺼낼 타입은 같은 스키마에서 얻은 `BreadListQuery`라서 검사한 값과 모양이 같습니다.
- `TODO 5`: `validate("query", …)`를 핸들러 앞에 두고, 핸들러에서는 `getValidated(req, "query")`로 검사한 query 값만 꺼내 씁니다.

## 자주 하는 실수

- `vegan: z.coerce.boolean().optional()`로 쓰면 빈 문자열이 아닌 글자는 모두 `true`가 되어 `"N"`도 `true`로 바뀝니다. 타입 검사는 통과하지만 다음 줄이 표시됩니다.

  ```text
  FAIL: GET /breads?vegan=N
    기대: {"status":200,"names":["단팥빵","소금빵","크루아상"]}
    실제: {"status":200,"names":["베이글","치아바타","통밀 바게트"]}
  ```

- 검사한 값을 `req[target] = result.data;`로 원래 영역에 다시 넣으면 타입 검사는 통과하지만 실행 중에 `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`가 출력되고 요청이 500이 되어 다음 줄이 표시됩니다.

  ```text
  FAIL: GET /breads
    기대: {"status":200,"names":["단팥빵","베이글","소금빵"]}
    실제: {"status":500,"body":{"success":false,"message":"서버 내부 오류가 발생했습니다."}}
  ```

- `TODO 1`을 빼먹으면 `error TS2339: Property 'validated' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.`가 표시됩니다.
