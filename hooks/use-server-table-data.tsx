"use client";

import { createStore } from "zustand/vanilla";
import { type ReactNode, createContext, useRef, useContext } from "react";

interface ServerData<T = any> {
  data: T[];
  count: number;
}

export type ServerStore = ServerData;

export const defaultInitState: ServerData = {
  data: [],
  count: 0,
};

const ServerStoreContext = createContext<ServerData>(defaultInitState);

export interface ServerStoreProviderProps<T> {
  initialData: ServerData<T>;
  children: ReactNode;
}

export function ServerTableStoreProvider<T>({
  children,
  initialData,
}: ServerStoreProviderProps<T>) {
  return (
    <ServerStoreContext.Provider value={initialData}>
      {children}
    </ServerStoreContext.Provider>
  );
}

export const useServerTableStore = <T,>() => {
  return useContext<ServerData<T>>(ServerStoreContext);
};
