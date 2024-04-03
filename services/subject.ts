import { subject } from "@/db/schema";
import db from "@/lib/db";

export async function getSubjects() {
  const subjects = await db.select().from(subject);
  return subjects;
}
