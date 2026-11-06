import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z, type ZodType } from "zod";
import { listBreads } from "./breads.js";
import { errorHandler } from "./error-handler.middleware.js";
import { BadRequestException, ERROR_MESSAGE } from "./exceptions.js";

export type ValidationTarget = "body" | "params" | "query";

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

export type BreadListQuery = z.infer<typeof breadListQuerySchema>;

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

export function createApp(): Express {
  const app = express();

  app.get("/breads", validate("query", breadListQuerySchema), (req, res) => {
    const query = getValidated<BreadListQuery>(req, "query");
    res.json(listBreads(query));
  });

  app.use(errorHandler);

  return app;
}
