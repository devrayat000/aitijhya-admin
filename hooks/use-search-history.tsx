import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SearchHistoryState = {
  history: string[];
  saveHistory: (suggestion: string) => void;
};

export const useSearchStore = create<
  SearchHistoryState,
  [["zustand/persist", SearchHistoryState]]
>(
  persist(
    (set) => ({
      history: [],
      saveHistory: (suggestion) => {
        console.log("adding history");
        set((state) => ({
          history: [suggestion, ...state.history],
        }));
      },
    }),
    {
      name: "search-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useStore<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
): F | undefined;
export function useStore<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
  initialData: F
): F;
export function useStore<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
  initialData?: F
) {
  const result = store(callback) as F;
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
}
