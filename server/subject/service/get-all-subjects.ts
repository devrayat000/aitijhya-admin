import { subject } from "@/db/schema";
import { getFilteredSubjects } from "./get-filtered-subjects";

export function getAllSubjects() {
  return getFilteredSubjects({
    fields: {
      id: subject.id,
      name: subject.name,
      createdAt: subject.createdAt,
    },
  });
}
