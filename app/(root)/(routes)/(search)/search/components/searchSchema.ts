import { z } from "zod";

const filterSchema = z.preprocess((x) => {
  if (typeof x === "string") {
    return x;
  }
  if (Array.isArray(x) && x.length > 0) {
    return x[0];
  }
  return undefined;
}, z.string().optional());

export const searchSchema = z.object({
  query: z.string(),
  page: z.preprocess((x) => {
    if (typeof x === "string") {
      return parseInt(x);
    }
    if (typeof x === "number") {
      return x;
    }
    return 1;
  }, z.number().default(1)),
  subject: filterSchema,
  chapter: filterSchema,
  book: filterSchema,
});

export type SearchSchema = z.infer<typeof searchSchema>;
