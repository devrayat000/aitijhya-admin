import { subject } from "@/db/schema";
import db from "@/lib/db";

const allSubjectsStatement = db
  .select()
  .from(subject)
  .prepare("get_all_subjects");

export function getAllSubjects() {
  return allSubjectsStatement.execute();
}
