import { ServerTableStoreProvider } from "@/hooks/use-server-table-data";
import { SubjectsClient } from "./components/client";
import { searchParamsSchema } from "@/lib/schemas";
import { getSubjects } from "@/services/subject";

const SizesPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { page, limit, query } = searchParamsSchema.parse(searchParams);
  const { subjects, count } = await getSubjects({ page, limit, query });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServerTableStoreProvider initialData={{ data: subjects, count }}>
          <SubjectsClient />
        </ServerTableStoreProvider>
      </div>
    </div>
  );
};

export default SizesPage;

export const dynamic = true;
