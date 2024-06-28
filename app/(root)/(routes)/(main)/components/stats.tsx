import { use } from "react";
import { getStats } from "@/server/miscellaneous/service/get-stats";
import Countup from "@/components/countup";

export default function Stats() {
  const { userCount, bookAuthorCount, postCount, chapterCount } = use(
    getStats()
  );

  return (
    <div className="grid grid-cols-2 gap-4 text-slate-500 px-5">
      <div className="rounded-xl border border-border p-2">
        <Countup
          end={userCount}
          duration={3}
          className="block text-center text-3xl font-semibold"
        />
        <h4 className="text-center">Active users</h4>
      </div>
      <div className="rounded border border-border p-2">
        <div>{bookAuthorCount}</div>
        <h4>Books uploaded</h4>
      </div>
    </div>
  );
}
