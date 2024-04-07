"use client";

import { useServerStore } from "@/hooks/use-server-data";
import { SearchHistory } from "@/services/history";

// async function getCurrentUserSearchHistory(): Promise<{
//   history: SearchHistory;
// }> {
//   const response = await fetch(`/api/posts/history`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     cache: "no-store",
//     credentials: "same-origin",
//     mode: "same-origin",
//   });
//   return response.json();
// }

export default function SearchHistory() {
  const history = useServerStore((state) => state.searchHistory);

  if (!history || !history.length) {
    return (
      <div className="mt-2">
        <p className="text-lg text-center">Search...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center text-lg">Recent Search History</p>
      <section className="flex flex-col md:flex-row gap-4">
        {history.map((h) => (
          <button
            type="button"
            key={h.id}
            className="bg-card-result rounded-md p-2 text-secondary"
          >
            <p className="text-base items-center">{h.query}</p>
            <p className="text-sm items-center">See results</p>
          </button>
        ))}
      </section>
    </div>
  );
}
