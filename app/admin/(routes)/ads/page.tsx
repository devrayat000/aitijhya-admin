import { searchParamsSchema } from "@/lib/schemas";
import { AdsClient } from "./components/client";
import { getAds } from "@/server/ad/service";
import { ServerTableStoreProvider } from "@/providers/server-table-provider";

const AddsPage = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { page, limit, query } = searchParamsSchema.parse(searchParams);
  const ads = await getAds({ page, limit, query });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServerTableStoreProvider initialData={ads}>
          <AdsClient />
        </ServerTableStoreProvider>
      </div>
    </div>
  );
};

export default AddsPage;

export const dynamic = true;
