import db from "@/lib/db";
import { SubjectForm } from "./components/subject-form";
import { eq } from "drizzle-orm";
import { subject } from "@/db/schema";

const SizePage = async ({ params }: { params: { subjectId: string } }) => {
  let initialData = null;

  if (params.subjectId !== "new") {
    initialData = (
      await db.select().from(subject).where(eq(subject.id, params.subjectId))
    )[0];
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubjectForm initialData={initialData} />
      </div>
    </div>
  );
};

export default SizePage;
