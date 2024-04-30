import { format } from "date-fns";

import { SubjectsClient } from "./components/client";
import db from "@/lib/db";
import { subject } from "@/db/schema";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const subjects = await db.select().from(subject);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubjectsClient data={subjects} />
      </div>
    </div>
  );
};

export default SizesPage;

export const dynamic = true;
