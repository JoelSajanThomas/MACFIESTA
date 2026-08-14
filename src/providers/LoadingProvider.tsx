"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface LoadingContextValue {
  isDone: boolean;
  markDone: () => void;
}

const LoadingContext = createContext<LoadingContextValue>({
  isDone: false,
  markDone: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isDone, setIsDone] = useState(false);
  const markDone = useCallback(() => setIsDone(true), []);

  return (
    <LoadingContext.Provider value={{ isDone, markDone }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
