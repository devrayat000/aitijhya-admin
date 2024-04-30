"use client";

import { createStore } from "zustand/vanilla";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

interface ServerData<T = any> {
  data: T[];
  count: number;
}

export type ServerStore = ServerData;

export function initServerStore<T>(initialData: ServerData<T>): ServerData<T> {
  return initialData;
}

export const defaultInitState: ServerData = {
  data: [],
  count: 0,
};

export function createServerStore<T>(
  initState: ServerData<T> = defaultInitState
) {
  return createStore<ServerData<T>>()((set, get) => ({
    ...initState,
  }));
}

const ServerStoreContext = createContext<StoreApi<ServerData> | null>(null);

export interface ServerStoreProviderProps<T> {
  initialData: ServerData<T>;
  children: ReactNode;
}

export function ServerTableStoreProvider<T>({
  children,
  initialData,
}: ServerStoreProviderProps<T>) {
  const storeRef = useRef<StoreApi<ServerData<T>>>();
  if (!storeRef.current) {
    storeRef.current = createServerStore(initServerStore(initialData));
  }

  return (
    <ServerStoreContext.Provider value={storeRef.current}>
      {children}
    </ServerStoreContext.Provider>
  );
}

export const useServerTableStore = <D, T>(
  selector: (store: ServerData<D>) => T
): T => {
  const serverStoreContext = useContext(ServerStoreContext);

  if (!serverStoreContext) {
    throw new Error(`useServerStore must be use within ServerStoreProvider`);
  }

  return useStore<StoreApi<ServerData<D>>, T>(serverStoreContext, selector);
};
