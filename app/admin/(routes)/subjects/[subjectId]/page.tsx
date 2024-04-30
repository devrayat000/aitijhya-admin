import { SubjectForm } from "./components/subject-form";
import { getSubjectById } from "@/services/subject";

const SizePage = async ({ params }: { params: { subjectId: string } }) => {
  let initialData = null;

  if (params.subjectId !== "new") {
    initialData = await getSubjectById(params.subjectId);
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
