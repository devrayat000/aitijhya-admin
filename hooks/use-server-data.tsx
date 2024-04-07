"use client";

import { createStore } from "zustand/vanilla";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";
import { BookmarkedList } from "@/services/bookmark";
import { SearchHistory } from "@/services/history";

interface ServerData {
  searchHistory: SearchHistory;
  bookmarks: BookmarkedList;
}

export type ServerStore = ServerData;

export const initServerStore = (initialData: ServerData): ServerData => {
  return initialData;
};

export const defaultInitState: ServerData = {
  searchHistory: [],
  bookmarks: [],
};

export const createServerStore = (initState: ServerData = defaultInitState) => {
  return createStore<ServerStore>()(() => ({
    ...initState,
  }));
};

const ServerStoreContext = createContext<StoreApi<ServerStore> | null>(null);

export interface ServerStoreProviderProps {
  initialData: ServerData;
  children: ReactNode;
}

export const ServerStoreProvider = ({
  children,
  initialData,
}: ServerStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ServerStore>>();
  if (!storeRef.current) {
    storeRef.current = createServerStore(initServerStore(initialData));
  }

  return (
    <ServerStoreContext.Provider value={storeRef.current}>
      {children}
    </ServerStoreContext.Provider>
  );
};

export const useServerStore = <T,>(selector: (store: ServerStore) => T): T => {
  const serverStoreContext = useContext(ServerStoreContext);

  if (!serverStoreContext) {
    throw new Error(`useServerStore must be use within ServerStoreProvider`);
  }

  return useStore(serverStoreContext, selector);
};
