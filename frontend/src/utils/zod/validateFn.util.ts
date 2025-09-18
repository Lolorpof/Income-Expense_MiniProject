import type { ZodObject, ZodSchema } from "zod";
import { fromError } from "zod-validation-error";

export default async function catchError<T>(
  fn: Promise<T>
): Promise<[T, null] | [null, Error]> {
  fn.then((data) => {
    return [data, null];
  }).catch((error) => {
    return [null, error];
  });
}
