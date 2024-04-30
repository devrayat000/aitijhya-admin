// import { format } from "date-fns";

import { searchParamsSchema } from "@/lib/schemas";
import { ChaptersClient } from "./components/client";
import { getChapters } from "@/services/chapter";
import { ServerTableStoreProvider } from "@/hooks/use-server-table-data";

const ChaptersPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { page, limit, query } = searchParamsSchema.parse(searchParams);
  const { chapters, count } = await getChapters({ page, limit, query });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServerTableStoreProvider initialData={{ data: chapters, count }}>
          <ChaptersClient />
        </ServerTableStoreProvider>
      </div>
    </div>
  );
};

export default ChaptersPage;

export const dynamic = true;
