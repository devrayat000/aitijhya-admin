import { z } from "zod";

const filterSchema = z.preprocess((x) => {
  if (typeof x === "string") {
    return x.split(",");
  }
  if (Array.isArray(x)) {
    return x;
  }
  return undefined;
}, z.string().array().optional());

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
  subjects: filterSchema,
  chapters: filterSchema,
  books: filterSchema,
});

export type SearchSchema = z.infer<typeof searchSchema>;
