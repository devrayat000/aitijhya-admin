import db from "@/lib/db";
import { AdForm } from "./components/ad-form";
import { eq } from "drizzle-orm";
import { ad, subject } from "@/db/schema";
import { getAdById } from "@/server/ad/service";
import { getAllSubjects, getSubjects } from "@/server/subject/service";
import { Suspense } from "react";

const SizePage = async ({ params }: { params: { adId: string } }) => {
  let initialData: any = {
    subjects: await getAllSubjects(),
  };

  if (params.adId !== "new") {
    initialData = {
      ...initialData,
      ad: await getAdById(params.adId),
    };
  } else {
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense>
          <AdForm initialData={initialData} />
        </Suspense>
      </div>
    </div>
  );
};

export default SizePage;
