import { searchParamsSchema } from "@/lib/schemas";
import { BooksClient } from "./components/client";
import { getBooks } from "@/services/book";
import { ServerTableStoreProvider } from "@/hooks/use-server-table-data";

const SizesPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { page, limit, query } = searchParamsSchema.parse(searchParams);
  const { books, count } = await getBooks({ page, limit, query });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServerTableStoreProvider initialData={{ data: books, count }}>
          <BooksClient />
        </ServerTableStoreProvider>
      </div>
    </div>
  );
};

export default SizesPage;

export const dynamic = true;
