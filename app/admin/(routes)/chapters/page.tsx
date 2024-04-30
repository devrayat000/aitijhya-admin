// import { format } from "date-fns";

import { ChaptersClient } from "./components/client";
import { getChapters } from "@/services/chapter";

const ChaptersPage = async () => {
  const chapters = await getChapters();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ChaptersClient data={chapters} />
      </div>
    </div>
  );
};

export default ChaptersPage;

export const dynamic = true;
